import React, { FC, useState, useRef,useEffect } from 'react';
import Db from "./db"
import DoTypes from "./doTypes"
import store from "../useStore";
import { Segmented, Row, Tag, InputRef, Input, Tooltip, Space, theme } from 'antd';

const UiaddState: FC = () => {
    // const doTypes = store(s => s.state.yblRes.doTypes);
    // const ids=store(s=>s.state.yblRes.ids)
    const addDb = store(s => s.state.ybl.addDb);
    const doTypes = store(s => s.state.ybl.doTypes);
    const obj = {
        '允许添加传感器': true,
        '不许添加传感器': false,
    }// as const
    const addDbSet = (bool: boolean) => {
        store.setState(s => {
            s.state.ybl.addDb = bool;
        })
    }
    return (
        <>
            <Row>
                <Db />
            </Row>
            <Row>
                <DoTypes/>
            </Row>
            <Row>
                <Segmented
                    block
                    options={Object.keys(obj)}
                    value={addDb ? '允许添加传感器' : '不许添加传感器'}
                    onChange={(c) => addDbSet(obj[c as keyof typeof obj])}
                />
            </Row>
        </>
    )
}
export default UiaddState