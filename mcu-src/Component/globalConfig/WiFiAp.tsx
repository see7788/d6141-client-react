import React, { FC } from 'react';
import store, { Store, GlobalConfig } from "../../useStore";
import { Descriptions, Input, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';

export const Ap = () => {
    type Obj = GlobalConfig["wifiAp"];
    const set = <T extends keyof Obj>(k: T, v: Obj[T]) => store.setState(s => {
        if (s.globalConfig) s.globalConfig.wifiAp[k] = v;
    });
    const c = store(s => s.globalConfig?.wifiAp as Obj)
    const IpUi: FC<{ i: number }> = ({ i }) => <Input
        key={i}
        bordered={false}
        defaultValue={c.staticIp[i]}
        maxLength={3}
        size="small"
        onChange={e => set("staticIp", c.staticIp.map((v, i2) => i2 === i ? Number(e.target.value) : v))}
    />
    return <Descriptions title="ap"
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
        <Descriptions.Item label={<>ssid</>}>
            <Input
                bordered={false}
                defaultValue={c.ssid}
                maxLength={255}
                onChange={e => {
                    set("ssid", e.target.value)
                }}
            /><EditOutlined />
        </Descriptions.Item>
        <Descriptions.Item label={<>hostname</>}>
            <Input
                bordered={false}
                defaultValue={c.hostname}
                maxLength={255}
                onChange={e => set("hostname", e.target.value)}
            /><EditOutlined />
        </Descriptions.Item>
        <Descriptions.Item label={<>staticIp</>}>
            <IpUi i={0} />.<IpUi i={1} />.<IpUi i={2} />.<IpUi i={3} /><EditOutlined />
        </Descriptions.Item>
    </Descriptions>
}
export default Ap;