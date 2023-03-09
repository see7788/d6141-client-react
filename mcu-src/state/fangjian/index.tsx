import React, { FC } from 'react'
import store from "../../useStore";
import { Switch, Collapse, Descriptions, Segmented, InputNumber } from "antd"
const App: FC = () => {
    const c = store(s => s.state.fangjian)
    const set_doorType = (c: string | number) => store.setState(s => {
        s.state.fangjian.doorType = String(c)
        s.req("api_config_set", "fangjian", s.state.fangjian)
    });
    const set_doorName = (c: string | number) => store.setState(s => {
        s.state.fangjian.doorName = String(c)
        s.req("api_config_set", "fangjian", s.state.fangjian)
    });
    const set_doorFloor = (c: string | number) => store.setState(s => {
        s.state.fangjian.doorFloor = Number(c)
        s.req("api_config_set", "fangjian", s.state.fangjian)
    });
    const set_kenNum = (c: string | number) => store.setState(s => {
        s.state.fangjian.kenNum = Number(c)
        s.req("api_config_set", "fangjian", s.state.fangjian)
    });
    return (
        <Descriptions>
            <Descriptions.Item label="id">
                <InputNumber
                    defaultValue={c.id}
                    min={1}
                    max={10}
                    bordered={false} />
            </Descriptions.Item>
            <Descriptions.Item label="位置">
                <Segmented
                    value={c.doorName}
                    options={['东', '西', '南', '北']}
                    onChange={set_doorName}
                />
            </Descriptions.Item>
            <Descriptions.Item label="男女类型">
                <Segmented
                    value={c.doorType}
                    options={['girl', 'boy']}
                    onChange={set_doorType}
                />
            </Descriptions.Item>
            <Descriptions.Item label="楼层">
                <Segmented
                    value={c.doorFloor}
                    options={Array.from(new Array(10),(c,i)=>++i)}
                    onChange={set_doorFloor}
                    />
            </Descriptions.Item>
            <Descriptions.Item label="蹲坑个数">
            <Segmented
                    value={c.kenNum}
                    options={Array.from(new Array(6),(c,i)=>++i)}
                    onChange={set_kenNum}
                    />
            </Descriptions.Item>
        </Descriptions>
    )
}
export default App