import React, { FC, Suspense, lazy, useEffect, useState } from 'react';
import { Space, Col, Row, Steps } from "antd"
import { useNavigate,RouteObject, useRoutes } from "react-router-dom";
import store from "../useStore"
const YblState = lazy(() => import("../ybl"))
const Def: FC = () => {
    const routeArr: RouteObject[] = [
        {
            path: "/",
            element:<>index</>
        },
        {
            path: "/0",
            element: <>ipc方式</>,
        },
        {
            path: "/1",
            element: <Suspense fallback={<>我是懒加载</>}><YblState /></Suspense>,
            // children: [
            //     {
            //         id: "fangjian",
            //         path: "/1/fangjiang",
            //         element: <>1</>
            //     },
            //     {
            //         id: "yblState",
            //         path: "/1/yblState",
            //         element: <Suspense fallback={<>我是懒加载</>}><YblState /></Suspense>
            //     },
            //     {
            //         id: "yblRes",
            //         path: "/1/yblRes",
            //         element: <>1</>
            //     },
            //     {
            //         id: "mdnsServer",
            //         path: "/1/mdnsServer",
            //         element: <>1</>
            //     },
            //     {
            //         id: "wifiSta",
            //         path: "/1/wifiSta",
            //         element: <>1</>
            //     },
            //     {
            //         id: "serialServer",
            //         path: "/1/serialServer",
            //         element: <>1</>
            //     },
            //     {
            //         id: "bluetoothServer",
            //         path: "/1/fangjiang",
            //         element: <>1</>
            //     },
            //     {
            //         id: "webServer",
            //         path: "/1/fangjiang",
            //         element: <>1</>
            //     },
            //     {
            //         id: "wsClient",
            //         path: "/1/fangjiang",
            //         element: <>1</>
            //     },
            // ]
        },

    ];
    const ipc_success = store(s => s.ipc.success)
    const goto=useNavigate();
    const [pageId, pageIdSet] = useState(ipc_success ? 1 : 0);
    const routerset=(c:number)=>{
        pageIdSet(c);
        goto(`/${c}`)
    }
    const App = (
        <Steps
            size="small"
            progressDot
            onChange={routerset}
            current={pageId}
            items={[
                {
                    title: ipc_success ? `${ipc_success}已连接` : "待连接",
                    subTitle: "切换连接方式",
                },
                {
                    title: '操作配置',
                    subTitle: "切换"
                }
            ]}
        />
    )
    return <>{App}{useRoutes(routeArr)}</>;

}

export default Def