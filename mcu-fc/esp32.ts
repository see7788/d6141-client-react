type IoClass = 'XiaoYuanA' | 'JiDianQiA'//|'ioRes'|'ioSend'
interface IdBase {
    id: number | string//唯一码,
    name?: string//名称
}
interface IoResXiaoYuanA {
    id: number | string//唯一码,
    state?: 0 | 1, //状态
}
interface IdXiaoYuanA extends IdBase, IoResXiaoYuanA {
    ioClass: 'XiaoYuanA'
}
interface IoSendJiDianQiA {
    id: number | string//唯一码,
    state?: 0 | 1, //状态
}
interface IdJiDianQiA extends IdBase, IoSendJiDianQiA {
    ioClass: 'JiDianQiA'
}
type idsInfoObject = IdXiaoYuanA | IdJiDianQiA
type Gpios = Record<number, IoClass>
type GlobleConfigDb = {
    version: string
    gpios: Gpios
    Cli_WebSocket: { url: string }
    Serve_WebSocket: { port: number }
    Serve_http: { port: number }
    data: idsInfoObject[]
}
let globleConfigDb: GlobleConfigDb = {
    version: '1.0.0',
    gpios: {},
    Cli_WebSocket: { url: '' },
    Serve_WebSocket: { port: 80 },
    Serve_http: { port: 80 },
    data: [
        { id: 111111111111, ioClass: 'JiDianQiA', name: 'xx灯继电器' },
        { id: 2222222222, ioClass: 'XiaoYuanA', name: 'xx门开关' }
    ]
}
const configFile = {
    get(): GlobleConfigDb {
        return globleConfigDb
    },
    Set(config: GlobleConfigDb) { },
    dataIndexGet: (mac: string) => globleConfigDb.data.findIndex((v, i) => v.id === mac),
    dataNameSet(mac: string, name: string) {
        const index = this.dataIndexGet(mac)
        if (index >= 0) {
            globleConfigDb.data[index].name = name
        }
    },
    dataStateSet(mac: string, state: any) {
        const index = this.dataIndexGet(mac)
        if (index >= 0) {
            globleConfigDb.data[index].state = state
        }
    },
    dataGet: (ioClass: IoClass) => globleConfigDb.data.filter(v => v.ioClass === ioClass),
    dataDel(mac: string) {
        const index = this.dataIndexGet(mac)
        if (index >= 0) {
            delete globleConfigDb.data[index]
        } else {
            console.log({ api: 'from.res.setState', mac, error: 'mac===false' })
        }
    },
    Serve_WebSocketSet() { },
    Serve_httpSet() { },
    Cli_WebSocketSet() { }
}
class Cli_WebSocket {
    private ws: WebSocket
    sendToServe(api: string) {
        switch (api) {
            case '':
            case '':
            default:
        }
    }
    constructor() {
        this.ws = new WebSocket(globleConfigDb.Cli_WebSocket.url)
    }
    private initSocket() { }
}
class Serve_WebSocket {
    // private ws: WebSocket
    // constructor() {
    //     this.ws = new WebSocket(globleConfigDb.Serve_WebSocket.port)
    //     this.initRes()
    // }
    sendToWeb(data: any) { }
    private initRes() { }
}
class Serve_http {
    constructor() {

    }
    private initRes() {
        globleConfigDb.Serve_http.port
    }
}
class GpioRes_Ev1527 {
    private xiaoyuanSchool: boolean = true
    private sendToWeb
    private sendToServe
    constructor(wsSendToWeb: Serve_WebSocket['sendToWeb'], wsSendToServe: Cli_WebSocket['sendToServe']) {
        this.sendToWeb = wsSendToWeb
        this.sendToServe = wsSendToServe
    }
    xiaoyuanSchoolSet(bool: boolean) {
        this.xiaoyuanSchool = bool;
    }
    //接收注册
    xiaoyuanRegiste = (mac: string) => {
        if (this.xiaoyuanSchool) {
            globleConfigDb.data.push({ id: mac, ioClass: 'XiaoYuanA' })
        } else {
            console.log({ api: 'GpioRes_Ev1527.xiaoyuanRegiste', error: 'xiaoyuanSchool===false', mac })
        }
    }
    //接收状态
    xiaoyuanRes = (mac: string, state: 0 | 1) => {
        const index = configFile.dataIndexGet(mac)
        if (index >= 0) {
            globleConfigDb.data[index].state = state
        } else {
            console.log({ api: 'GpioRes_Ev1527.xiaoyuanRes', mac, error: 'mac===false', state })
        }
    }
}
class GpioSend_Ev1527 {
    private sendToWeb
    private sendToServe
    constructor(wsSendToWeb: Serve_WebSocket['sendToWeb'], wsSendToServe: Cli_WebSocket['sendToServe']) {
        this.sendToWeb = wsSendToWeb
        this.sendToServe = wsSendToServe
    }
    //申请注册
    jidianqiRegiste = (): void => { }
    //测试是否注册成功
    jidianqiTest(): boolean { return false }
    //发送
    jidianqiSend = (state: any) => { }
}
export default class {
    constructor() {
        globleConfigDb = configFile.get()
        const sendToServe = (new Cli_WebSocket()).sendToServe
        const sendToWeb = (new Serve_WebSocket()).sendToWeb
        new Serve_http()
        const resEv1527 = new GpioRes_Ev1527(sendToWeb, sendToServe)
        const sendEv1527 = new GpioSend_Ev1527(sendToWeb, sendToServe)
    }
    restart() {
        // ESP.restart();
    }

}
