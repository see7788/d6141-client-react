import React, {
    FC,
    // useEffect, useState 
} from 'react';
import store, { YblUseDoType, GlobalConfig } from "../../useStore";
import _ from "lodash"
import {
    Descriptions, Typography, Space, Segmented, Popover, Card, Avatar, Badge, Cascader
    // Select, Popover, Button
} from 'antd';
import {
    DeleteOutlined,
    // UserAddOutlined, UserDeleteOutlined
} from '@ant-design/icons';
const EditKenState: FC = () => {
    const data = store(s => s.globalConfig?.uartYbl.state as GlobalConfig['uartYbl']['state']);
    const del = (id: string) => store.setState(s => {
        delete s.globalConfig?.uartYbl.state[id];
    });
    const setDo = (id: string, doInfo: [YblUseDoType, number]) => store.setState(s => {
        for (let index = 0; index < doInfo.length; index++) {
           if(s.globalConfig) s.globalConfig.uartYbl.state[id][2 + index] = doInfo[index];
        }
    });
    const children = _.sortBy(Object.entries(data), c => (c[1][1])).map(([id, info]) => {
        const [state, autoAddress, dotype, ...doOther] = info;
        const style = { backgroundColor: state ? '#FF3366' : "#33CC33" }
        return (
            <Badge
                key={id}
                style={style}
                count={`${autoAddress}号传感器`}
            >
                <Popover
                    key={id}
                    title={
                        <div key={id} onClick={() => del(id)}> {`${autoAddress}号传感器`}<DeleteOutlined /></div>
                    }
                    content={
                        YblUseDoType.map((v, i) => {
                            return <Cascader
                                key={i}
                                bordered={false}
                                value={[dotype||'待配置', ...doOther]}
                                options={[
                                    { value: v, label: v, children: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(vid => ({ value: vid, label: vid })) }
                                ]}
                                onChange={(e) => {
                                    setDo(id, e as [YblUseDoType, number])
                                }}
                            />
                        })
                    } >
                    <Avatar
                        key={id}
                        shape="square"
                        style={style}
                        size={64}
                    >
                        {(dotype ? [dotype, ...doOther] : [`待配`]).join("/")}
                    </Avatar >
                </Popover>
            </Badge>
        )
    })
    return <Space key={1} wrap={true} align="end" children={children} />
}
const EditAddTure: FC = () => {
    const stateAdd = store(s => s.globalConfig?.uartYbl.stateAdd as boolean);
    const obj = {
        '允许添加传感器': true,
        '不许添加传感器': false,
    }
    const set = (bool: boolean) => store.setState(s => {
        if(s.globalConfig)s.globalConfig.uartYbl.stateAdd = bool;
    });
    return (
        <Segmented
            block
            options={Object.keys(obj)}
            value={stateAdd ? '允许添加传感器' : '不许添加传感器'}
            onChange={(e) => set(obj[e])}
        />
    )
}
const Ui: FC = () => {
    return (
        <Descriptions >
            <Descriptions.Item label={<>开关</>}>
                <EditAddTure />
            </Descriptions.Item>
            <Descriptions.Item label={<>状态</>}>
                <EditKenState />
            </Descriptions.Item>
        </Descriptions>
    )
}

export default Ui