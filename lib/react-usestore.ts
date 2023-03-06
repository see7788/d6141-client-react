import { immer } from 'zustand/middleware/immer'
import { create } from "zustand"
import _ from "lodash"
declare global {  //设置全局属性
    interface Window {  //window对象属性
        my_req: (str: string) => void
    }
}
export default <ReqParam extends Record<string, any>, State extends Record<string, any>>(state: State) => {
    let ws: WebSocket;
    // let my_req: (str: string) => void
    type Store = {
        ipc: {
            success?: string
            websocketInit: (wsuri: `${"ws://" | "wss://"}${string}`) => Promise<true>;
            res: (obj: Partial<State & { api: keyof State }>) => void;
        };
        req: (op: ReqParam) => any;
        state: State;
        stateInit?:true
    }
    return create<Store>()(immer<Store>((set, self) => {
        const res: Store["ipc"]["res"] = obj => set(s => {
            const { api, ...info } = obj;
            if (api) {
                if (api === "globalConfig") {
                    s.state = { ...s.state, ...info }
                    console.log(obj);
                } else if (typeof s.state[api] !== "undefined") {
                    s.state = { ...s.state, [api]: info }
                    console.log(obj);
                } else {
                    console.log({ api: api + ";web pass", ...info });
                }
            } else {
                console.log({ api: "undefind web pass", ...info });
            }
        })
        const websocketInit: Store['ipc']["websocketInit"] = c => new Promise((ok) => {
            ws = new WebSocket(c);
            ws.onopen = e => {
                const loop = setInterval(() => {
                    if (ws.readyState === 1) {
                        set(s => {
                            s.ipc.success = "wesocket";
                            window.my_req = op => ws.send(JSON.stringify(op))
                        })
                        clearInterval(loop)
                        console.log("ws.onopen", "成功连接")
                        ok(true);
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
                    delete s.ipc.success
                })
                setTimeout(() => {
                    websocketInit(c);
                }, 2000);
            }
        })
        return {
            ipc: {
                websocketInit,
                res,
            },
            req: op => Object.entries(op).map(([api, db]) => {
                set(s => {
                    if (api === "state_merge") {
                        s.state = _.merge(s.state, db);
                    } else if (api === "state_replace") {
                        s.state = { ...s.state, ...db as Partial<State> };
                    } else {
                        window.my_req({ api, db } as any);
                    }
                })
            }),
            state: state
        }
    }))
}