import React, { useState, useEffect} from 'react';
import store from "../../useStore";
//<pre>{JSON.stringify(c, null, 2)}</pre>
//wsUri必须没有/结尾
export default (param?: `wsUri=${string}`) => {
    const [wsUri, wsUriSet] = useState("")
    const wsInit = store(s => s.ipc.webSocketInit)
    const loginStart = "正在获取ws参数..."
    const urlError = "错误，url?所有参数空！请关闭浏览器重新访问。"
    const uriError = "错误，uri参数不存在！请关闭浏览器重新访问。"
    const uricharAtError = "错误，uri参数不能/结尾！请关闭浏览器重新访问。"
    const uriindexofError = "错误，uri参数不能/结尾！请关闭浏览器重新访问。"
    const uriSuccess = "uri 参数正确"
    const openIng = "正在连接mcu服务器。如果两三秒没连上请联系管理员"
    const openError = "未能成功连接，请联系管理员"
    const [msg, msg_Set] = useState<string>(loginStart);
    const msgSet = (str: string) => msg_Set(str + "请确保本页面是在您连接设备AP热点后，被AP自动打开的");
    const wsUriToker = () => {
        const c = param ? param : window.location.href.split("?")[1]
        if (!c) {
            msgSet(urlError);
        } else {
            const c2 = new URLSearchParams(c);
            const op = Object.fromEntries(c2.entries());
            if (!op["wsUri"]) {
                msgSet(uriError)
            } else {
                const uri = op["wsUri"] as `${"ws://" | "wss://"}${string}`;
                if (uri.charAt(uri.length - 1) == "/") {
                    msg_Set(uricharAtError)
                } else if (uri.indexOf("ws://") !== 0 && uri.indexOf("wss://") !== 0) {
                    msg_Set(uriindexofError)
                } else {
                    msgSet(uriSuccess + ";" + openIng)
                    wsInit(uri)
                        .then(() => {
                            wsUriSet(uri)
                        })
                        .catch(e => {
                            msgSet(openError + JSON.stringify(e))
                        });
                }
            }
        }
    }
    useEffect(() => {
        wsUriToker()
    }, [param])
    return { msg, wsUri }
}
