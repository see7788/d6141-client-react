import { immer } from 'zustand/middleware/immer'
import { create } from "zustand"
import _ from "lodash"
import globalConfig from "../globalConfig.json";
type PowerPartial<T> = { [U in keyof T]?: T[U] extends object ? PowerPartial<T[U]> : T[U]; }
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
        webSocketInit: (wsuri: `${"ws://" | "wss://"}${string}`) => Promise<void>
        workIng?: "webSocket"
        //ipcSet:(ipcNow:"webSocket")=>Promise<void>
    };
    res: <T extends keyof State >(op: ({ api: T, db: State[T] } | { api: "globalConfig", db: State })) => void
    req: <T extends keyof State>(
        ...op: ["api_config_get", T] |
        ["api_config_set", [T, State[T]]] |
        ["api_globalConfig_set", Partial<State>] |
        ["api_globalConfig_get"] |
        ["api_globalConfig_toFile"] |
        ["api_globalConfig_fromFile"] |
        ["api_espRestart"]
    ) => void;
    state: State
}
export default create<Store>()(immer<Store>((set, self) => {
    let ws: WebSocket;
    let req: Store["req"]
    const res: Store["res"] = ({ api, db }) => set(s => {
        if (api === "globalConfig") {
            s.state = { ...s.state, ...db }
        } else if (api in s.state) {
            s.state = { ...s.state, [api]:db }
        } else {
            console.log(api + ";web pass");
        }
    })
    const loingState = (): Promise<void> => new Promise((ok) => {
        const loop = setInterval(() => {
            if (self().state) {
                clearInterval(loop)
                ok();
            }
        }, 500);
    })
    const wsInit: Store["ipc"]["webSocketInit"] = (wsuri) => new Promise((ok) => {
        ws = new WebSocket(wsuri);
        ws.onopen = e => {
            const loop = setInterval(() => {
                if (ws.readyState === 1) {
                    req = (...op) => {
                        const [api, db] = op;
                        ws.send(JSON.stringify({ api, db}))
                    }
                    set(s => {
                        s.ipc.workIng = "webSocket";
                    })
                    clearInterval(loop)
                    console.log("ws.onopen", "成功连接")
                    ok();
                }
            }, 1000);
        }
        ws.onmessage = e => {
            try {
                const obj = JSON.parse(e.data);
                res(obj)
            } catch (e) {
                console.error("ws.onmessage", e)
            }
        };
        ws.onclose = e => {
            console.error("ws.onclose", e);
            set(s => {
                delete s.ipc.workIng;
            })
            setTimeout(() => {
                wsInit(wsuri);
            }, 2000);
        }
    })
    return {
        ipc: {
            webSocketInit: (c) => wsInit(c).then(() => req("api_globalConfig_get")).then(loingState),
            // ipcSet:async()=>{}
        },
        res,
        req: (...op) => req(...op),
        state: false as unknown as State
    }
}))
// let person= ['张三', '李四', '王五'];
// console.log(person.unshift('小明')); // 头部插入，返回数组长度
//person.pop();//删除最后一个