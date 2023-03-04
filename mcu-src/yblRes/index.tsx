import React, { FC } from 'react';
import store from "../useStore";
import { Segmented, } from 'antd';

const UiaddState: FC = () => {
    // const doTypes = store(s => s.state.yblRes.doTypes);
    // const ids=store(s=>s.state.yblRes.ids)
    //const addId = store(s => s.state.yblRes.addId);
    const obj = {
        '允许添加传感器': true,
        '不许添加传感器': false,
    } as const
    // const set = (bool: boolean) => store.setState(s => {
    //     s.state.yblRes.addId = bool;
    // });
    return (
        <Segmented
            block
            options={Object.keys(obj)}
         //   value={addId ? '允许添加传感器' : '不许添加传感器'}
        //  onChange={(e:keyof typeof obj) => set(obj[e])}
        />
    )
}
export default UiaddState