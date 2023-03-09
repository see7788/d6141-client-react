import React, { FC, useState, useRef, useEffect } from 'react';
import Db, { BYTYPENAMES } from "./db"
import _ from "lodash"
import DoTypes from "./doTypes"
import store from "../../useStore";
import { Descriptions, Segmented, Row, Switch, InputRef, Input, Tooltip, Space, theme } from 'antd';
const UiaddState: FC = () => {
    const addDb = store(s => s.state.ybl.addDb);
    const cssArr = [
        {
            backgroundColor: '#888888', hover: { backgroundColor: '#AAAAAA' }
        },
        {
            backgroundColor: '#33CC33', hover: { backgroundColor: '#33FF33' }
        }
    ]
    const addDbSet = (bool: boolean) => {
        store.setState(s => {
            s.state.ybl.addDb = bool;
            s.req("api_config_set", "ybl", s.state.ybl)
        })
    }
    const [byType, set_byType] = useState(0)
    const byTypeSet = (name: any) => {
        set_byType(BYTYPENAMES[name as keyof typeof BYTYPENAMES])
    }
    return (
        <Descriptions>
            <Row>
                <Db byType={byType} />
            </Row>
            <Descriptions.Item label="抗干扰">
                <Switch
                    style={cssArr[Number(addDb)]}
                    checkedChildren="允许新增传感器"
                    unCheckedChildren="禁止新增传感器"
                    defaultChecked={addDb}
                    onChange={addDbSet}
                />
            </Descriptions.Item>
            <Descriptions.Item label="排序">
                <Segmented
                    value={_.invert(BYTYPENAMES)[byType]}
                    options={Object.keys(BYTYPENAMES)}
                    onChange={byTypeSet}
                />
            </Descriptions.Item>
            <Descriptions.Item label="用途">
                <DoTypes />
            </Descriptions.Item>
        </Descriptions>
    )
}
export default UiaddState