import React, { FC, Suspense, lazy, useEffect, useState } from 'react';
import { notification, Steps, } from "antd"
import { useNavigate, useRoutes } from "react-router-dom";
import store from "./useStore"
const Ipc = lazy(() => import("./ipc"))
const State = lazy(() => import("./state"))
const Def: FC = () => {
    const name = store(s => s.ipc.state[0])
    const initstate = store(s => s.ipc.state[1])
    const [pageId, pageIdSet] = useState(0);
    const goto = useNavigate();
    const routerset = (c: number) => {
        pageIdSet(c);
        goto(`/${c}`)
    }
    useEffect(() => {
        if (!name) {
            notification.open({
                message: '需要先建立通讯',
                description:
                    '先选择通讯方式，并且与设备成功建立联系后，才能进行设备系统的配置。',
            });
            routerset(0);
        } else if (!initstate) {
            notification.open({
                message: '需要先等待服务器初始数据',
                description:
                    '先选择通讯方式，并且与设备成功建立联系后，才能进行设备系统的配置。',
            });
            routerset(0);
        }
    }, [name])
    const handSteps = <Steps
        onChange={routerset}
        current={pageId}
        items={[
            {
                title: name ? `${name}已连接` : "请选择通讯方式",
                description: "切换通讯方式",
                // subTitle: "切换通讯方式",
            },
            {
                title: '操作配置',
                description: "持久保存配置"
            }
        ]}
    />
    const Pages = useRoutes([
        {
            path: "/*",
            element: <Suspense fallback={<>我是懒加载</>}><Ipc /></Suspense>,
        },
        {
            path: "/1",
            element: <Suspense fallback={<>我是懒加载</>}><State /></Suspense>,
        }])
    return <>
        {handSteps}
        {Pages}
    </>;

}

export default Def