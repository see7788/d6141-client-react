import React, { FC } from 'react';
import store, { Store } from "../../useStore";
import {
    Descriptions, Input,
    Space,
    Segmented,
    Badge,
    Avatar
} from 'antd';
import _ from "lodash"
import { EditOutlined } from '@ant-design/icons';
type Obj = Store["globalConfig"]["fangjian"];
const Ui: FC = () => {
    const c = store(s => s.globalConfig.fangjian)
    const yblState = store(s => s.globalConfig.uartYbl.state);
    const keng = Object.values(yblState).filter(v => v[2] && v[2] === "坑门锁")
    const nowNumer = keng.filter(v => v[0]).length
    const set = <T extends keyof Obj>(k: T, v: Obj[T]) => store.setState(s => {
        s.globalConfig.fangjian[k] = v;
    });
    const AllState = () => {
        const children = _.sortBy(Object.entries(yblState), c => (c[1][1])).filter(([id, info]) => info[2] && info[2] === "坑门锁").map(([id, info]) => {
            const [state, autoAddress, doInfo, ...other] = info;
            const style = { backgroundColor: state ? '#FF3366' : "#33CC33" }
            return (
                <Badge
                    key={id}
                    style={style}
                    count={`${autoAddress}号传感器`}
                >
                    <Avatar
                        key={id}
                        shape="square"
                        style={style}
                        size={64}
                    >
                        {[doInfo, ...other].join("/")}
                    </Avatar >
                </Badge>
            )
        })
        return <Space key={1} wrap={true} align="end" children={children} />
    }
    return (
        <Descriptions
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
            <Descriptions.Item label={<>楼层</>}>
                <Input
                    bordered={false}
                    value={c.doorFloor}
                    maxLength={255}
                    onChange={e => set("doorFloor", parseInt(e.target.value))}
                /><EditOutlined />
            </Descriptions.Item>
            <Descriptions.Item label={<>性别</>}>
                <Segmented options={['boy', 'girl']} value={c.doorType} onChange={e => set("doorType", e as string)} />
            </Descriptions.Item>
            <Descriptions.Item label={<>门牌</>}>
                <Input
                    bordered={false}
                    value={c.doorName}
                    maxLength={255}
                    onChange={e => set("doorName", e.target.value)}
                /><EditOutlined />
            </Descriptions.Item>
            <Descriptions.Item label={<>坑位</>}>
                <Space>
                    <span>总量{keng.length}</span>
                    <span>用量{nowNumer}</span>
                    <span>余量{keng.length - nowNumer}</span>
                </Space>
            </Descriptions.Item>
            <Descriptions.Item>
                <AllState />
            </Descriptions.Item>
        </Descriptions>
    )
}
export default Ui;