import React, { FC, lazy, Suspense } from 'react';
import { Collapse, theme, Affix, Button, FloatButton } from "antd"
import { MoreOutlined, FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import useStore from "../useStore"
const Fangjian = lazy(() => import("./fangjian"))
const Ybl = lazy(() => import("./ybl"))
const WifiSta = lazy(() => import("./wifiSta"))
const WsClient = lazy(() => import("./wsClient"))
const WifiApServer = lazy(() => import("./wifiApServer"))
const App = () => {
    const { Panel } = Collapse;
    const { token } = theme.useToken();
    return (
        <>
            <FloatButton
                // icon={<FileTextOutlined />}
                description="复原"
                shape="square"//形状
                //type="primary"
                style={{ right: 20 }}
                onClick={c => {
                    useStore.setState(s => {
                        s.req("api_globalConfig_fromFile")
                    });
                }}
            />
            <FloatButton
                // icon={<FileTextOutlined />}
                description="放弃重启"
                shape="square"//形状
                //type="primary"
                style={{ right: 70 }}
                onClick={c => {
                    useStore.setState(s => {
                        s.req("api_espRestart")
                    });
                }}
            />
            <FloatButton
                //icon={<FileTextOutlined />}
                description="保存重启"
                shape="square"
                //type="primary"
                style={{ right: 120 }}
                onClick={c => {
                    useStore.setState(s => {
                        s.req("api_globalConfig_toFile")
                    });
                }}
            />
            <ExclamationCircleOutlined />
            <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                // expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                style={{ background: token.colorBgContainer }}
            >
                <Panel header="房间配置" key="1">
                    <Suspense fallback={<>我是懒加载</>}><Fangjian /></Suspense>
                </Panel>
                <Panel header="RF433" key="2">
                    <Suspense fallback={<>我是懒加载</>}><Ybl /></Suspense>
                </Panel>
                {/* <Panel header="bluetoothServer" key="3">
                    -----
                </Panel> */}
                <Panel header="wifiApServer" key="4">
                    <Suspense fallback={<>我是懒加载</>}><WifiApServer /></Suspense>
                </Panel>
                <Panel header="wifiSta" key="5">
                    <Suspense fallback={<>我是懒加载</>}><WifiSta /></Suspense>
                </Panel>
                {/* <Panel header="ETH" key="6">
                    -----
                </Panel>
                <Panel header="dnsServer+mdnsServer" key="7">
                    -----
                </Panel>
                <Panel header="ttl serialServer" key="8">
                    -----
                </Panel>
                <Panel header="udpServer" key="9">
                    -----
                </Panel>
                <Panel header="webScoketServer+webServer+esServer" key="10">
                    -----
                </Panel> */}
                <Panel header="webSocketClient" key="11">
                    <Suspense fallback={<>我是懒加载</>}><WsClient /></Suspense>
                </Panel>
                {/* <Panel header="udpClient" key="12">
                    -----
                </Panel>
                <Panel header="mqttClient" key="13">
                    -----
                </Panel>
                <Panel header="tcpClient" key="14">
                    -----
                </Panel>
                <Panel header="ttl serialClient" key="15">
                    -----
                </Panel> */}
            </Collapse>
        </>
    )
}
export default App