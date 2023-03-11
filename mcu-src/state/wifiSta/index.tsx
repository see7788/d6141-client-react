import React, { FC } from 'react'
import store from "../../useStore";
import { Descriptions, Segmented, Input } from "antd"
const App: FC = () => {
    const c = store(s => s.state.wifiSta)
    const set_ssid = (e: React.ChangeEvent<HTMLInputElement>) => store.setState(s => {
        s.state.wifiSta.ssid = e.target.value
        s.req("api_config_set", "wifiSta", s.state.wifiSta)
    });
    const set_password = (e:React.ChangeEvent<HTMLInputElement>) => store.setState(s => {
        s.state.wifiSta.password = e.target.value
        s.req("api_config_set", "wifiSta", s.state.wifiSta)
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
            <Descriptions.Item label="热点密码">
                <Input 
                value={c.password} 
                bordered={false} 
                onChange={set_password}
                />;
            </Descriptions.Item>
            <Descriptions.Item label="localIP">
                {c.localIP ? c.localIP : "断网中"}
            </Descriptions.Item>
        </Descriptions>
    )
}
export default App