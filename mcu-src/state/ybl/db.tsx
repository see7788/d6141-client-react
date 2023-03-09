import React, { FC, useEffect, useState } from 'react';
import store from "../../useStore";
import _ from "lodash"
import {
    Descriptions,
    Space,
    Drawer,
    Popover,
    List,
    Avatar,
    Badge,
    Typography,
    Divider,
    Tag,
    Button,
    Dropdown,
    Select
} from 'antd';
const { Text } = Typography;
import {
    DeleteOutlined,
    UserAddOutlined,
    FormOutlined
} from '@ant-design/icons';
export const BYTYPENAMES={
    '自然顺序':0, '用途顺序':2
} as const
const App: FC<{byType?:number}> = ({byType=0}) => {
    const ybl = store(s => s.state.ybl);
    const dbs = ybl.db;
    const db_entries = Object.entries(dbs)
    const doTypes = store(s => s.state.ybl.doTypes);
    const children =_.orderBy(db_entries, e => `${e[1][byType]}${e[1][0]}`).map(([id, info]) => {
        const [byNumber, state, doId] = info as [number, boolean, number];
        const doname = doTypes[doId]
        const style = { backgroundColor: state ? '#FF3366' : "#33CC33" }
        const doIdSet = (doId: string) => {
            store.setState(s => {
                s.state.ybl.db[id][2] = Number(doId);
                s.req("api_config_set", "ybl", s.state.ybl)
            });
        }
        const del = (id: string) => {
            store.setState(s => {
                const by=s.state.ybl.db[id][0];
                delete s.state.ybl.db[id];
                db_entries.map(([id,info])=>{
                    if(info[0]>by){
                        s.state.ybl.db[id][0]=info[0]-1
                    }
                })
                s.req("api_config_set", "ybl", s.state.ybl)
            });
        }
        return (
            <Badge
                key={id}
                style={style}
                count={byNumber}
            >
                <Popover
                    content={
                        <Space wrap={true}>
                            <Button onClick={() => del(id)}>删传感器<DeleteOutlined /></Button >
                            <Select
                                onChange={doIdSet}
                                defaultValue={doname}
                                options={doTypes.map((v, i) => ({
                                    value: i,
                                    label: doId === i ? `*${v}*` : v,
                                }))} />
                        </Space>
                    } >
                    <Avatar
                        shape="square"
                        style={style}
                        size={64}
                    >
                        {doname}
                    </Avatar >
                </Popover>
            </Badge>
        )
    })
    return <Space wrap={true} align="end" children={children} />
}
export default App