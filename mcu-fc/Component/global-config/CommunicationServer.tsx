import React, { FC, useEffect } from 'react';
import store from "../../useStore";
import { useNavigate } from 'react-router-dom'
import { Descriptions, Input, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const Ui: FC = () => {
    const espState = store(s => s.espState)
    const to = useNavigate();
    useEffect(()=>{
        if (espState["wifi*"] == undefined || espState["wifi*"]["localIP"] === undefined) {
            to("/home");
        }
    },[])
    const ap = store(s => s.globalConfig.wifi.ap)
    const c = store(s => s.globalConfig.communicationServer)
    const set = (v:string) => store.setState(s => {
        s.globalConfig.communicationServer.password=v
    });
    return (
        <Descriptions
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
            <Descriptions.Item label="动态ip">{espState["wifi*"]&&`http://${espState["wifi*"]["localIP"]}`}</Descriptions.Item>
            <Descriptions.Item label="静态msdn">{ap.msdn}</Descriptions.Item>
            <Descriptions.Item label="webServer">
                <span>port:{c.port}</span>
            </Descriptions.Item>
            <Descriptions.Item label="webSocketServer">
                <Space>
                    <span>port:{c.port}</span>
                    <span>path:{c.path.webSocket}</span>
                </Space>
            </Descriptions.Item>
            <Descriptions.Item label="webEventSourceServer">
                <Space>
                    <span>port:{c.port}</span>
                    <span>path:{c.path.webEventSource}</span>
                </Space>
            </Descriptions.Item>
            <Descriptions.Item label="秘钥">
                <Input
                    bordered={false}
                    defaultValue={c.password}
                    maxLength={255}
                    onChange={e=>set(e.target.value)}
                />
                <EditOutlined />
            </Descriptions.Item>
        </Descriptions>
    )
}
export default Ui;