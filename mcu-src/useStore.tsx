import { immer } from 'zustand/middleware/immer'
import { create } from "zustand"
import _ from "lodash"
import globalConfig from "../globalConfig.json";
type PowerPartial<T> = { [U in keyof T]?: T[U] extends object ? PowerPartial<T[U]> : T[U]; }
class StreamToJsonStr {
    container: string = ''
    l = "{"
    r = "}"
    ll = 0
    rl = 0
    async transform(chunk: string, controller: any) {
        chunk.split("").map(v => {
            if (this.ll > 0 || v == "l") {
                this.container += v;
            }
            if (v === "{") {
                this.ll += 1;
            } else if (v === "}") {
                this.rl += 1;
            }
            if (this.ll === this.rl) {
                this.ll = 0
                this.rl = 0
                controller.enqueue(this.container);
                this.container = ""
            }
        })
    }
    flush(controller: any) {
        controller.enqueue("flush");
    }
}
class WebSerialClass {
    private readableStreamClosed
    private decoder
    private reader
    private writableStreamClosed
    private encoder
    private writer
    constructor(
        public readonly port: SerialPort,
        public readonly onDb: (str: string) => void,
        public readonly onClose: () => void
    ) {
        this.decoder = new TextDecoderStream("utf-8", {});
        if (this.port.readable) {
            this.readableStreamClosed = this.port.readable.pipeTo(this.decoder.writable);
        } else {
            throw new Error("SerialPort.readable undefind");
        }
        this.reader = this.decoder.readable.getReader();
        this.encoder = new TextEncoderStream();
        if (this.port.writable) {
            this.writableStreamClosed = this.encoder.readable.pipeTo(this.port.writable);
        } else {
            throw new Error("SerialPort.readable undefind");
        }
        this.writer = this.encoder.writable.getWriter();
    }
    async close() {
        await this.reader.cancel().then(() => console.log("success")).catch((e) => console.error("error", e))
        await this.readableStreamClosed.then(() => console.log("success")).catch((e) => console.error("error", e))
        this.onClose();
    }
    async onAny() {
        this.reader = this.decoder.readable.getReader();
        while (this.port.readable) {
            const { value, done } = await this.reader.read()
            if (value) {
                this.onDb(value);
            }
            if (done) {
                this.reader.releaseLock();
                break;
            }
        }
    }
    async onObject_json() {
        this.reader = this.decoder.readable.pipeThrough(new TransformStream(new StreamToJsonStr())).getReader();
        while (this.port.readable) {
            const { value, done } = await this.reader.read()
            if (value) {
                this.onDb(value);
            }
            if (done) {
                this.reader.releaseLock();
                break;
            }
        }
    }
    async send(data: string) {
        await this.writer.write(data);
        await this.writer.close().then(() => console.log("success")).catch((e) => console.error("error", e))
        await this.writableStreamClosed.then(() => console.log("success")).catch((e) => console.error("error", e))
    }
}

type State = (typeof globalConfig) & {
    ybl: {
        db: Record<string, [//id
            number, //const排序
            boolean, //state开关状态
            number//yblRes.doTypes[number]用途
        ]>
    }
}
type Store = {
    ipc: {
        webSerialInit: () => Promise<void>
        webSocketInit: (wsuri: `${"ws://" | "wss://"}${string}`) => Promise<void>
        name?: "webSocket" | "webSerial"
        globalConfig?: true

        //ipcSet:(ipcNow:"webSocket")=>Promise<void>
    };
    res: <T extends keyof State >(op: ({ api: T, info: State[T] } | { api: "globalConfig", info: State })) => void
    req: <T extends keyof State>(
        ...op: ["api_config_get", T] |
        ["api_config_set", T, State[T]] |
        ["api_globalConfig_set", Partial<State>] |
        ["api_globalConfig_get"] |
        ["api_globalConfig_toFile"] |
        ["api_globalConfig_fromFile"] |
        ["api_espRestart"]
    ) => Promise<void>;
    state: State
}
export default create<Store>()(immer<Store>((set, self) => {
    let webSerialObj: WebSerialClass
    let webSocketObj: WebSocket
    let req: Store["req"] = async (...req) => console.log("req def", ...req);
    const res: Store["res"] = ({ api, info }) => set(s => {
        let webuseIng=true
        if (api === "globalConfig") {
            s.state = { ...s.state, ...info }
            s.ipc.globalConfig = true;
        } else if (s.state[api]) {
            s.state = { ...s.state, [api]: info }
        } else {
            webuseIng=false
        }
        console.log({api,webuseIng,info});
    })
    const loingGlobalConfig = (): Promise<void> => new Promise((ok) => {
        const loop = setInterval(() => {
            const c = self().ipc.globalConfig
            if (c) {
                clearInterval(loop)
                ok();
            }
        }, 500);
    })
    const webSocketInit: Store["ipc"]["webSocketInit"] = (wsuri) => new Promise((ok, err) => {
        console.log("wsuri", wsuri)
        webSocketObj = new WebSocket(wsuri);
        //webSocketObj.binaryType="arraybuffer";
        webSocketObj.onopen = e => {
            let i = 0;
            const loop = setInterval(() => {
                if (webSocketObj.readyState === 1) {
                    clearInterval(loop)
                    ok();
                } else if (i > 5) {
                    console.error("loing max", 5)
                    err("loing max 5")
                } else {
                    i++
                    console.log("loing", i)
                }
            }, 1000);
        }
        webSocketObj.onmessage = e => {
            try {
                const obj = JSON.parse(e.data);
                res(obj)
            } catch (e) {
                console.error("ws.onmessage", e)
            }
        };
        webSocketObj.onclose = e => {
            console.error("ws.onclose", e);
            set(s => {
                delete s.ipc.name;
            })
            setTimeout(() => {
                webSocketInit(wsuri);
            }, 2000);
        }
    })
    return {
        ipc: {
            webSerialInit: async () => navigator.serial?.requestPort().then(async (port) => {
                webSerialObj = new WebSerialClass(
                    port,
                    str => {
                        const { api, info } = JSON.parse(str);
                        res({ api, info });
                    },
                    () => {
                        set(s => {
                            delete s.ipc.name;
                        })
                    })
                req = async (...op) => {
                    const [api, ...info] = op;
                    console.log({ "req": "webSerialObj.send", api, info })
                    webSerialObj.send(JSON.stringify({ api, info }))
                }
                await self().req("api_globalConfig_get")
                await loingGlobalConfig();
                set(s => {
                    s.ipc.name = "webSerial";
                })
            }),
            webSocketInit: async (c) => {
                await webSocketInit(c);
                req = async (...op) => {
                    const [api, ...info] = op;
                    console.log({ "req": "webSocketObj.send", api, info })
                    webSocketObj.send(JSON.stringify({ api, info }))
                };
                await self().req("api_globalConfig_get")
                await loingGlobalConfig();
                set(async s => {
                    s.ipc.name = "webSocket";
                })
            },
        },
        res,
        req: (...op) => req(...op),
        state: globalConfig
    }
}))
// let person= ['张三', '李四', '王五'];
// console.log(person.unshift('小明')); // 头部插入，返回数组长度
//person.pop();//删除最后一个