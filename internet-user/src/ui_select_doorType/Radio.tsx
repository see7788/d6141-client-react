import React, { FC } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import store from '../store/webSocket';
type RadioParam = {
    style?: React.CSSProperties
}
const Ui: FC<RadioParam> = ({style}) => {
    const db = store(s => s.fjsConfig.doorType)
    const dbSet = (e: RadioChangeEvent) => {
        store.fjsConfig.doorTypeSet(e.target.value)
    }
    return (
        <Radio.Group
            style={style||{}}
            onChange={dbSet}
            value={db}>
            <Radio value={'boy'}>boy</Radio>
            <Radio value={'girl'}>girl</Radio>
        </Radio.Group>
    )
}
export default Ui;