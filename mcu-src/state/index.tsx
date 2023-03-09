import React, { FC ,lazy,Suspense} from 'react';
import { useNavigate, RouteObject, useRoutes, useLocation } from "react-router-dom";
import { Collapse, theme, Steps } from "antd"
import { CaretRightOutlined } from '@ant-design/icons';
// import YblState from "./ybl"
// import Fangjian from "./fangjian"
const Fangjian=lazy(()=>import("./fangjian"))
const YblState=lazy(()=>import("./ybl"))
const App = () => {
    const { Panel } = Collapse;
    const { token } = theme.useToken();
    const panelStyle = {
        marginBottom: 24,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
      };
    return (
        <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        style={{ background: token.colorBgContainer }}
        >
            <Panel header="房间配置" key="1">
                <Suspense fallback={<>我是懒加载</>}><Fangjian /></Suspense>
            </Panel>
            <Panel header="射频433" key="2">
                <YblState />
            </Panel>
            <Panel header="bluetoothServer" key="3">
                -----
            </Panel>
            <Panel header="wifiApServer" key="4">
                -----
            </Panel>
            <Panel header="wifiSta" key="5">
                -----
            </Panel>
            <Panel header="ETH" key="6">
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
            </Panel>
            <Panel header="webSocketClient" key="11">
                -----
            </Panel>
            <Panel header="udpClient" key="12">
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
            </Panel>
        </Collapse>
    )
}
export default App