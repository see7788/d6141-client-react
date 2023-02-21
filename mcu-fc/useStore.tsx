import globalConfig from "../../globalConfig.json"
import { immer } from 'zustand/middleware/immer'
import { create } from "zustand"
import { notification } from 'antd';
import _ from "lodash"

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
const loingPromise: (ms: number) => Promise<void> = ms => new Promise((ok) => {
    setTimeout(() => {
        ok();
    }, ms);
})
export const YblUseDoType = ["坑门锁"] as const;
export type YblUseDoType = (typeof YblUseDoType)[number];
/**
 * [state,id,autoAddress,YblUseDoType]
 */
type UartYbl = {
    state: {
        [i: string]: YblState_IdInfo
    };
}
type YblState_IdInfo = [
    boolean, //state
    number, //autoAddress 序号
    YblUseDoType?
]
type Uri = `${"ws://" | "wss://"}${string}`
export type GlobalConfig = typeof globalConfig & { uartYbl: UartYbl };
type Api = "globalConfig_get" | "globalConfig_set"
export type Store = {
    wsInit: (uri: Uri) => Promise<any>;
    globalConfig?: GlobalConfig;
    espState: Record<string, Record<string, string>>;
    api: (api: Api) => Promise<void>;
}

export default create<Store>()(immer<Store>((set, self) => {
    const wsInit = (uri: Uri) => new Promise((ok, err) => {
        try {
            console.log({uri})
            ws = new WebSocket(uri);
            ws.onopen = () => {
                const login = setInterval(() => {
                    if (ws.readyState == 1) {
                        console.log("ws.readyState success")
                        clearInterval(login);
                        ok(ws.readyState)
                    } else {
                        console.log("ws.readyState ing")
                    }
                }, 1000);
            }
            ws.onerror = console.error;
            ws.onclose = async e => {
                await loingPromise(3000);
                console.error(e)
                wsInit(uri);
            }
            ws.onmessage = e => {
                const str = e.data
                try {
                    const { api, ...info } = JSON.parse(str);
                    let webuseing = false;
                    switch (api) {
                        case "globalConfig":
                            set(s => {
                                s[api] = info[api]
                            });
                            webuseing = true;
                            break;
                        case "fangjianState":
                            set(s => {
                                if (s.globalConfig?.uartYbl?.state)
                                    s.globalConfig.uartYbl.state = info["uartYblState"];
                            })
                            webuseing = true;
                            break;
                    }
                    console.log({ webuseing, api, info })
                } catch (e) {
                    console.error({ str, e })
                }
            };
        } catch (e) {
            err(e)
        }
    })
    return {
        wsInit,
        espState: {},
        api: async api => {
            let db: any;
            switch (api) {
                case "globalConfig_set":
                    db = { ...self().globalConfig, api }
                    break;
                default:
                    db = { api }
            }
            ws.send(JSON.stringify(db));
        }
    }
})
)