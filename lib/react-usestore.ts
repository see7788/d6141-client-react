import { immer } from 'zustand/middleware/immer'
import { create } from "zustand"
import _ from "lodash"
let ws: WebSocket;
export default <ReqParam extends Record<string, any>, State extends Record<string, any>>(state: State) => {
    type Store = {
        ipcInit: {
            success: boolean
            websocketInit: (wsuri: `${"ws://" | "wss://"}${string}`) => Promise<true>;
            reqInit: (sendFun: (str: string) => void) => void
        };
        res: (obj: Partial<State & { api: keyof State }>) => void;
        req: (op: ReqParam) => any;
        reqFun: (op: ReqParam, req: (str: string) => void) => void;
        state: State;
    }
    return create<Store>()(immer<Store>((set) => {
        const res: Store["res"] = obj => set(s => {
            const { api, ...info } = obj;
            if (api && typeof s.state[api] !== "undefined") {
                s.state = { ...s.state, ...info }
            } else {
                console.log("web 不处理", api);
            }
        })
        const reqFun = (op: ReqParam, req: (str: string) => void) =>{
            // ws.send(JSON.stringify(op))
            set(s => {
                 Object.entries(op).map(([api, db]) => {
                    if (api === "state_merge") {
                        s.state = _.merge(s.state, db);
                    } else if (api === "state_replace") {
                        s.state = { ...s.state, ...db as Partial<State> };
                    } else {
                        console.log({op,db,c:JSON.stringify({api,db})})
                        //req(JSON.stringify(db));
                    }
                })
            })
        }
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
                        // reqInit(ws.send)
                        //reqInit(console.log)
                        set(s => {
                            s.ipcInit.success = true;
                            s.req = op => reqFun(op, ws.send)
                        })
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
                success:false
            },
            res,
            req: op => reqFun(op, () => console.log("req未初始化，只执行本地修改")),
            reqFun,
            state: state// || {} as State
        }
    }))
}