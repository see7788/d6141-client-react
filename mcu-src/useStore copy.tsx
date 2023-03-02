import globalConfig from "../globalConfig.json"
import { immer } from 'zustand/middleware/immer'
import { create } from "zustand"
import _ from "lodash"
type PowerPartial<T> = { [U in keyof T]?: T[U] extends object ? PowerPartial<T[U]> : T[U]; }

/*
switch (ws.readyState) {
    case 1://表示连接成功，可以通信了
        ok("已经 ok");
        break;
    case 2://表示连接正在关闭
    case 3://表示连接已经关闭，或者打开连接失败
    case 0://值为0，表示正在连接
        setTimeout(() => createWebSocket(url, onMessageCallBack), loingTime);
        break;
    default:
        err("ws.readyState:" + ws.readyState);
}*/
let ws: WebSocket;
export const YblUseDoType = ["坑门锁"] as const;
export type YblUseDoType = (typeof YblUseDoType)[number];
type UartYblstate = {
    [i: string]: [
        boolean, //状态
        number, //位置序号
        YblUseDoType?
    ]
}
export type GlobalConfig = {
    uartYbl: { state: UartYblstate };
    fangjian: {
        nowNum?: number,
        kenNum?: number
    } & (typeof globalConfig)
};
//espState: Record<string, Record<string, string>>;
export type Store = {
    reqInit: {
        wsInit: (wsuri: `${"ws://" | "wss://"}${string}`) => Promise<true>;
    }
    globalConfig: GlobalConfig;
    req: (
        api?: "globalConfig_get" | "globalConfig_set" | "api_espRestart" | "api_globalConfig_fromFile" | "api_globalConfig_toFile",
        globalConfig?: PowerPartial<GlobalConfig>
    ) => Promise<void>;
}

export default create<Store>()(immer<Store>((set, self) => {
    const res = ({ api, info }: { api: string, info: any }) => {
        let webuseing = true;
        switch (api) {
            case "globalConfig":
                set(s => {
                    s.globalConfig = info
                });
                break;
            case "fangjianState":
                const { uartYblState, ...fj } = info as GlobalConfig["fangjian"] & {
                    uartYblState: UartYblstate,
                    nowNum: number,
                    kenNum: number
                }
                set(s => {
                    s.globalConfig.uartYbl.state = uartYblState;
                    s.globalConfig.fangjian = fj;
                })
                break;
            default:
                webuseing = false;
        }
        console.log({ webuseing, api, info })
    }
    const wsReq: Store['req'] = async (api, globalConfig) => {
        if (api && globalConfig) {
            set(s => {
                s.globalConfig = _.merge(s.globalConfig, globalConfig);
                ws.send(JSON.stringify({ globalConfig: s.globalConfig, api }));
            })
        } else if (api) {
            ws.send(JSON.stringify({ api }));
        } else if (globalConfig) {
            set(s => {
                s.globalConfig = _.merge(s.globalConfig, globalConfig);
            })
        }
    }

    const wsInit: Store['reqInit']["wsInit"] = c => new Promise((ok) => {
        ws = new WebSocket(c);
        ws.onopen = e => {
            const loop = setInterval(() => {
                if (ws.readyState === 1) {
                    ok(true);
                    clearInterval(loop)
                }
            }, 1000);
            console.log(e)
        }
        ws.onmessage = (e) => {
            res(JSON.parse(e.data))
        };
        ws.onclose = e => {
            console.error("ws.onclose", e);
            wsInit(c)
        }
    })
    return {
        reqInit: { wsInit },
        globalConfig: {} as GlobalConfig,
        req: wsReq
    }
}))