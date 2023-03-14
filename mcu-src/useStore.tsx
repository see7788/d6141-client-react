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
        webSocketUri?:string
        webSocketInit: (wsuri: `${"ws://" | "wss://"}${string}`) => Promise<void>
        state: ["webSocket" | "webSerial" | false, boolean]//[0通讯初始化，1globalConfig初始化]
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
        let res = "webResUse true"
        if (api === "globalConfig") {
            s.state = { ...s.state, ...info }
            s.ipc.state[1] = true;
        } else if (s.state[api]) {
            s.state = { ...s.state, [api]: info }
        } else {
            res = "webResUse false"
        }
        console.log({ api: api + " " + res, info });
    })
    const loingOnGlobalConfig = (): Promise<void> => new Promise((ok, err) => {
        let i = 0;
        const loop = setInterval(() => {
            i++ 
            if (self().ipc.state[1]) {
                clearInterval(loop)
                console.log("success ipc.state[1]=true")
                ok();
            } else if (i === 10) {
                clearInterval(loop)
                console.log("ipc.state[1] loop===10")
                err()
            } else {
                console.log("ipc.state[1] loop===", i)
            }
        }, 300);
    })
    const webSocketInit: Store["ipc"]["webSocketInit"] = (wsuri) => new Promise((ok, err) => {
        webSocketObj = new WebSocket(wsuri);
        //webSocketObj.binaryType="arraybuffer";
        webSocketObj.onopen = e => {
            console.log("wsopen", wsuri)
            let i = 0
            const loop = setInterval(() => {
                i++
                if (webSocketObj.readyState === 1) {
                    clearInterval(loop)
                    console.log("success webSocketObj.readyState===1")
                    ok();
                } else if (i === 10) {
                    clearInterval(loop)
                    console.log("webSocketObj.readyState loop===10")
                    err()
                } else {
                    console.log("webSocketObj.readyState loop===", i)
                }
            }, 300);
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
                s.ipc.state[0] = false;
            })
            setTimeout(() => {
                webSocketInit(wsuri);
            }, 2000);
        }
    })
    return {
        ipc: {
            state: [false, false],
            webSerialInit: async () => navigator.serial?.requestPort().then(async (port) => {
                webSerialObj = new WebSerialClass(
                    port,
                    str => {
                        const { api, info } = JSON.parse(str);
                        res({ api, info });
                    },
                    () => {
                        set(s => {
                            s.ipc.state[0] = false;
                        })
                    })
                req = async (...op) => {
                    const [api, ...info] = op;
                    webSerialObj.send(JSON.stringify({ api, info }))
                }
                set(s => {
                    s.ipc.state[0] = "webSerial";
                })
                await self().req("api_globalConfig_get")
                await loingOnGlobalConfig();
            }),
            webSocketInit: (c) => webSocketInit(c).then(async () => {
                req = async (...op) => {
                    const [api, ...info] = op;
                    webSocketObj.send(JSON.stringify({ api, info }))
                };
                await self().req("api_globalConfig_get")
                set(s => {
                    s.ipc.state[0] = "webSocket";
                    s.ipc.webSocketUri=c;
                })
                await loingOnGlobalConfig();
            }),
        },
        res,
        req: (...op) => {
            const [api, ...info] = op;
            console.log({ api: api + " req", info })
            return req(...op)
        },
        state: globalConfig
    }
}))
// let person= ['张三', '李四', '王五'];
// console.log(person.unshift('小明')); // 头部插入，返回数组长度
//person.pop();//删除最后一个