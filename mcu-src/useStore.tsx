import { immer } from 'zustand/middleware/immer'
import { create } from "zustand"
import _ from "lodash"
import globalConfig from "../globalConfig.json";
type PowerPartial<T> = { [U in keyof T]?: T[U] extends object ? PowerPartial<T[U]> : T[U]; }
type Yblstate = {
    [i: string]: [//id
        boolean, //开关状态
        number, //位置编号
        number?//yblTypes[number]
    ]
}
type State = (typeof globalConfig) & { yblstate: Yblstate }
type ReqParam = {
    state_merge?: PowerPartial<State>;
    state_replace?: Partial<State>;
    api_globalConfig_set?: Partial<State>,
    api_globalConfig_get?: true,
    api_globalConfig_toFile?: true,
    api_globalConfig_fromFile?: true,
    api_espRestart?: true
};
type Store = {
    ipcInit: {
        success?: boolean
        websocketInit: (wsuri: `${"ws://" | "wss://"}${string}`) => Promise<true>;
        reqInit: (sendFun: (str: string) => void) => void
    };
    res: (obj: Partial<State & { api: keyof State }>) => void;
    req: (op: ReqParam) => any;
    reqFun: (op: ReqParam, req: (str: string) => void) => void;
    state: State;
}
let ws: WebSocket;
export default create<Store>()(immer<Store>((set) => {
    const res: Store["res"] = obj => set(s => {
        const { api, ...info } = obj;
        if (api && typeof s.state[api] !== "undefined") {
            s.state = { ...s.state, ...info }
        } else {
            console.log("web 不处理", api);
        }
    })
    const reqFun = (op: ReqParam, req: (str: string) => void) => set(s => {
        Object.entries(op).map(([api, db]) => {
            if (api === "state_merge") {
                s.state = _.merge(s.state, db);
            } else if (api === "state_replace") {
                s.state = { ...s.state, ...db as Partial<State> };
            } else {
                req(JSON.stringify({ api, db }));
            }
        })
    })
    const reqInit: Store["ipcInit"]['reqInit'] = req => set(s => {
        s.ipcInit.success = true;
        s.req = op => reqFun(op, req)
    })
    const websocketInit: Store['ipcInit']["websocketInit"] = c => new Promise((ok) => {
        ws = new WebSocket(c);
        ws.onopen = e => {
            const loop = setInterval(() => {
                if (ws.readyState === 1) {
                    ok(true);
                    reqInit(ws.send)
                    clearInterval(loop)
                }
            }, 1000);
            console.log(e)
        }
        ws.onmessage = e => {
            try {
                const obj = JSON.parse(e.data);
                res(obj)
            } catch (e) {
                console.log(e)
            }
        };
        ws.onclose = e => {
            console.error("ws.onclose", e);
            set(s => {
                s.ipcInit.success = false
            })
            setTimeout(() => {
                websocketInit(c);
            }, 2000);
        }
    })
    return {
        ipcInit: {
            websocketInit,
            reqInit,
        },
        res,
        req: op => reqFun(op, () => console.log("req未初始化，只执行本地修改")),
        reqFun,
        state: globalConfig as State
    }
}))
// let person= ['张三', '李四', '王五'];
// console.log(person.unshift('小明')); // 头部插入，返回数组长度
//person.pop();//删除最后一个