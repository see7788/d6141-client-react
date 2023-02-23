import globalConfig from "../../globalConfig.json"
import { immer } from 'zustand/middleware/immer'
import { create } from "zustand"
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
    ipcInit: (uri: Uri) => Promise<any>;
    globalConfig: GlobalConfig;
    espState: Record<string, Record<string, string>>;
    api: (api: Api) => Promise<void>;
}

export default create<Store>()(immer<Store>((set, self) => {
    const ipcInit: Store['ipcInit'] = async (c) => {
        if (!c) {
            c = "ws://" + globalConfig.wifiAp.staticIp.join(".") + globalConfig.locServer.port + globalConfig.locServer.webSocketPath as Uri
        }
        if (c.indexOf("192.168.") > -1) {
            ws = new WebSocket(c);
            ws.onopen = e => console.log(e)
            ws.onmessage = (e) => {
                const str = e.data
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
            };
            ws.onclose = c => console.error("ws.onclose", c);
        } else {
            console.error("onInit 错误")
        }
    }
    return {
        ipcInit,
        globalConfig: {} as GlobalConfig,
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