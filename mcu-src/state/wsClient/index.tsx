import React, { FC } from 'react'
import store from "../../useStore";
import { Descriptions, Segmented, Input } from "antd"
const App: FC = () => {
    const c = store(s => s.state.wsClient)
    const set_uri = (e: React.ChangeEvent<HTMLInputElement>) => store.setState(s => {
        s.state.wsClient.uri = e.target.value
        s.req("api_config_set", "wsClient", s.state.wsClient)
    });
    return (
        <Descriptions>
            {/* <Descriptions.Item label="hostname">
            </Descriptions.Item> */}
            <Descriptions.Item label="uri">
                <Input
                    value={c.uri}
                    bordered={false}
                    onChange={set_uri}
                />;
            </Descriptions.Item>
            <Descriptions.Item label="connectionIng">
                {c.connectionIng ? "握手状态" : "断开状态"}
            </Descriptions.Item>
        </Descriptions>
    )
}
export default App