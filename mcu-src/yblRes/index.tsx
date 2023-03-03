import React, { FC } from 'react';
import store from "../useStore";
import { Segmented, } from 'antd';
const UidoTypes:FC=()=>{
    const doTypes = store(s => s.state.yblRes.doTypes);
    return <>{doTypes}</>
}
const UiaddState: FC = () => {
    const stateAdd = store(s => s.state.yblRes.addState);
    const obj = {
        '允许添加传感器': true,
        '不许添加传感器': false,
    } as const
    const set = (bool: boolean) => store.setState(s => {
        s.state.yblRes.addState = bool;
    });
    return (
        <Segmented
            block
            options={Object.keys(obj)}
            value={stateAdd ? '允许添加传感器' : '不许添加传感器'}
            onChange={(e:keyof typeof obj) => set(obj[e])}
        />
    )
}
export default UiaddState