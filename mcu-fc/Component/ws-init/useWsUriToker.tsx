import React, { FC, useState, useEffect, ReactElement } from 'react';
import store from "../../useStore";
//<pre>{JSON.stringify(c, null, 2)}</pre>
//wsUri必须没有/结尾
export default (host_?: string, param?: `wsUri=${string}`) => {
    const loginStart = "正在获取ws参数..."
    const getUrlError = "错误，url所有参数不存在！请关闭浏览器重新访问。"
    const getUriError = "错误，wsUrl参数不存在！请关闭浏览器重新访问。"
    const getUricharAtError = "错误，wsUrl参数不能/结尾！请关闭浏览器重新访问。"
    const getUriindexofError = "错误，wsUrl参数不能/结尾！请关闭浏览器重新访问。"
    const openIng = "正在连接mcu服务器。如果两三秒没连上请联系管理员"
    const openError = "未能成功连接，请联系管理员"
    const [tokerMsg, tokerMsg_Set] = useState(loginStart);
    const tokerMsgSet = (str: string) => tokerMsg_Set(str + "请确保本页面是在您连接设备AP热点后，被AP自动打开的");
    const wsInit = store(s => s.wsInit);
    const [host] = useState(host_ || window.location.href.split("?")[0])
    const [wsUri, wsUriSet] = useState("")
    const wsUriToker = () => {
        const c = param ? param : window.location.href.split("?")[1]
        if (!c) {
            tokerMsgSet(getUrlError);
        } else {
            const c2 = new URLSearchParams(c);
            const op = Object.fromEntries(c2.entries());
            if (!op["wsUri"]) {
                tokerMsgSet(getUriError)
            } else {
                const uri = op["wsUri"] as `${"ws://" | "wss://"}${string}`;
                if (uri.charAt(uri.length - 1) == "/") {
                    tokerMsg_Set(getUricharAtError)
                } else if (uri.indexOf("ws://") !== 0 && uri.indexOf("wss://") !== 0) {
                    tokerMsg_Set(getUriindexofError)
                } else {
                    tokerMsgSet(openIng)
                    wsInit(uri)
                        .then(() => {
                            wsUriSet(uri)
                            tokerMsg_Set("")
                            console.log(uri)
                        })
                        .catch(e => {
                            tokerMsgSet(openError + JSON.stringify(e))
                        });
                }
            }
        }
    }
    useEffect(() => {
        wsUriToker()
    }, [])
    return { tokerMsg, qrUrl: () => host + "?wsUri=" + wsUri }
}
