import React, { FC } from 'react';
import store, { Store, GlobalConfig } from "../../useStore";
import { Descriptions, Input, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';

export const Sta = () => {
    type Obj = GlobalConfig["wifiSta"];
    const set = <T extends keyof Obj>(k: T, v: Obj[T]) => store.setState(s => {
        if (s.globalConfig) s.globalConfig.wifiSta[k] = v;
        console.log({ k, v })
    });
    const c = store(s => s.globalConfig?.wifiSta as Obj)
    // const wifiScan = store(s => s.wifiScan)
    // const wifiScan_get = (bool: boolean) => bool && store.getState().api('wifiScan_get')
    return <Descriptions title="sta"
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
        <Descriptions.Item label={<>ssid</>}>
            <Select
                bordered={false}
                value={c.ssid}
                size="large"
                // onDropdownVisibleChange={wifiScan_get}
                onChange={e => set("ssid", e)}
            >
                {/* {
                    Object.entries(wifiScan).map(([x, v], i) => <Select.Option key={i} value={v[0]}>{v[0]}</Select.Option>)
                } */}
            </Select>
        </Descriptions.Item>
        <Descriptions.Item label={<>password</>}>
            <Input
                bordered={false}
                defaultValue={c.password}
                maxLength={255}
                onChange={e => set("password", e.target.value)}
            /><EditOutlined />
        </Descriptions.Item>
        <Descriptions.Item label={<>hostname</>}>
            <Input
                bordered={false}
                value={c.hostname}
                maxLength={255}
                onChange={e => set("hostname", e.target.value)}
            /><EditOutlined />
        </Descriptions.Item>
    </Descriptions>
}

export default Sta;