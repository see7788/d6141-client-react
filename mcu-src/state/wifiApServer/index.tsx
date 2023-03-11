import React, { FC } from 'react'
import store from "../../useStore";
import { Descriptions, Segmented, Input } from "antd"
const App: FC = () => {
    const c = store(s => s.state.wifiApServer)
    const set_ssid = (e: React.ChangeEvent<HTMLInputElement>) => store.setState(s => {
        s.state.wifiApServer.ssid = e.target.value
        s.req("api_config_set", "wifiApServer", s.state.wifiApServer)
    });
    return (
        <Descriptions>
            {/* <Descriptions.Item label="hostname">
            </Descriptions.Item> */}
            <Descriptions.Item label="热点名称">
                <Input 
                value={c.ssid}
                 bordered={false} 
                 onChange={set_ssid}
                 />;
            </Descriptions.Item>
            {/* <Descriptions.Item label="热点密码">
                <Input 
                value={c.password} 
                bordered={false} 
                onChange={set_password}
                />;
            </Descriptions.Item> */}
            <Descriptions.Item label="状态">
                {c.workIng ? "打开" : "关闭"}
            </Descriptions.Item>
        </Descriptions>
    )
}
export default App