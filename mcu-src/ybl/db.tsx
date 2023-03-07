import React, { FC, useEffect, useState } from 'react';
import store from "../useStore";
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
const App: FC = () => {
    const ybl = store(s => s.state.ybl);
    const dbs = ybl.db;
    const db_entries = Object.entries(dbs)
    const doTypes = store(s => s.state.ybl.doTypes);
    const del = (id: string) => store.setState(s => {
        delete s.state.ybl.db[id];
        // console.log(id,s.state.ybl)
        // s.req({ api_globalConfig_set: { ybl: s.state.ybl } })
    });
    const setDoType = (id: string, doId: number) => store.setState(s => {
        s.state.ybl.db[id][2]=doId;
        //s.req(["api_config_set",ybl])
    });
    const children = _.orderBy(db_entries, e => e[1][0]).map(([id, info]) => {
        const [byNumber, state, doId] = info as [number, boolean, number];
        const doname = doTypes[doId]
        const style = { backgroundColor: state ? '#FF3366' : "#33CC33" }
        const doIdSet=(value:string)=>setDoType(id, Number(value))
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
                                defaultValue="设定用途"
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
    return <Space key={1} wrap={true} align="end" children={children} />
}
export default App