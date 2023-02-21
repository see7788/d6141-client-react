import React, { FC, useEffect, useState } from 'react';
import { Slider } from 'antd';
import store from '../store/webSocket';
import _ from 'lodash';
type SliderParam = {
    uiType?: '竖向',
    style?: React.CSSProperties
}
/**
 * 包裹在Space会报错
 */
const Ui: FC<SliderParam> = ({ uiType, style }) => {
    const db = store(s => s.fjs);
    const config = store(s => s.fjsConfig.doorFloorBetween)
    const configSet = store.fjsConfig.doorFloorBetweenSet
    const minMax = store(s => {
        const arr = Object.values(s.fjs).map(({ doorFloor }) => doorFloor)||[1]
        const min = _.min(arr)
        let max = _.max(arr)
        return { max, min };
    })
    return (
        <div onClick={event => event.stopPropagation()}>
            <Slider
                tipFormatter={v => `第${v}层`}
                style={style || {}}
                //tooltipVisible={false}//值为 true 时，Tooltip 将会始终显示；否则始终不显示，哪怕在拖拽及移入时
                range={{ draggableTrack: true }}//	双滑块模式
                defaultValue={config}
                onChange={configSet}
                min={minMax.min}
                max={minMax.max}
            />
        </div>
    )
}
export default Ui;