import React, { FC, useState } from 'react';
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
const UiyblState: FC = () => {
    const dbs = store(s => s.state.ybl.db);
    const db_entries = Object.entries(dbs)
    const doTypes = store(s => s.state.ybl.doTypes);
    const del = (id: string) => store.setState(s => {
        delete s.state.ybl.db[id];
        s.req({ api_globalConfig_set: { ybl: s.state.ybl } })
    });
    const setOrderBy = (id: string, by: number) => store.setState(s => {
        s.state.ybl.db[id][0] = by
        s.req({ api_globalConfig_set: { ybl: s.state.ybl } })
    });
    const setDoType = (id: string, doId: number) => store.setState(s => {
        s.state.ybl.db[id][2] = doId
        s.req({ api_globalConfig_set: { ybl: s.state.ybl } })
    });
    //先按用途，再按定义排序
    // c => `${c[1][2]}${c[1][0]}`
    const children = _.orderBy(db_entries).map(([id, info]) => {
        const [byNumber, state, doId] = info as [number, boolean, number];
        const doname = doTypes[doId]
        const style = { backgroundColor: state ? '#FF3366' : "#33CC33" }
        return (
            <Badge
                key={id}
                style={style}
                count={byNumber}
            >
                <Popover
                    content={
                        <Space wrap={true}>
                            <Button onClick={() => del(id)}>删除<DeleteOutlined /></Button >
                            <Select
                                onChange={(value) => setOrderBy(id, Number(value))}
                                defaultValue="修改编号"
                                options={
                                    [...Array(db_entries.length)].map((v, i) => {
                                        ++i
                                        return {
                                            value: i,
                                            label: byNumber === i ? `*${i}*` : i,
                                        }
                                    })
                                } />
                            <Select
                                onChange={(value) => setDoType(id, Number(value))}
                                defaultValue="修改用途"
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
export default UiyblState