import React, { FC } from 'react';
import store, { Store, GlobalConfig } from "../../useStore";
import { Descriptions, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
type Obj = GlobalConfig["internetServer"]["webSocket"];
const CWebSocket = () => {
    const set = <T extends keyof Obj>(k: T, v: Obj[T]) => store.setState(s => {
        if (s.globalConfig) s.globalConfig.internetServer.webSocket[k] = v;
    });
    const c = store(s => s.globalConfig?.internetServer.webSocket)
    const iparr = c?.ip.split(".") || [];
    const IpUi: FC<{ i: number }> = ({ i }) => <Input
        key={i}
        bordered={false}
        defaultValue={iparr[i]}
        maxLength={3}
        size="small"
        onChange={e => set("ip", iparr.map((v, i2) => i2 === i ? e.target.value : v).join("."))}
    />
    return <Descriptions
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
    >
        <Descriptions.Item label={<>webSocket</>}>
            <IpUi i={0} />.<IpUi i={1} />.<IpUi i={2} />.<IpUi i={3} />:<Input
                bordered={false}
                defaultValue={c?.port}
                maxLength={255}
                onChange={e => set("port", parseInt(e.target.value))}
            /><EditOutlined />
        </Descriptions.Item>
    </Descriptions>
}
const Ui: FC = () => {
    return (
        <div><CWebSocket /></div>
    )
}
export default Ui;