import React, { FC, useEffect, useState } from 'react';
import { RadialBar } from '@ant-design/charts';
import store from '../store/webSocket'

export type Param = {
    uiType: '堆叠玉珏图'
    style?: React.CSSProperties
}
const uiPunlicFile = {
    xField: 'xField',
    yField: 'yField',
    seriesField: 'seriesField',
}
const Ui: FC<Param> = (props) => {
    const data = store(s => s.fjsSelect.b())
    switch (props.uiType) {
        case '堆叠玉珏图':
            return <RadialBar {...{
                data,
                ...uiPunlicFile,
                isStack: true,
                legend: {
                    position: 'top'
                },
                maxAngle: 200,
            }} />;
    }
};
export default Ui;