import React, { FC, useEffect, useState } from 'react';
import { Rose } from '@ant-design/charts';
import store from '../store/webSocket'
//玫瑰图
export type Param = {
  uiType: '玫瑰堆叠' | '玫瑰带贴图的分组' | '玫瑰分组'
  style?: React.CSSProperties
}
const uiPunlicFile = {
  xField: 'xField',
  yField: 'yField',
  seriesField: 'seriesField',
}

const Ui: FC<Param> = (props) => {
  const dataa = store(s => s.fjsSelect.a())
  const datab = store(s => s.fjsSelect.b())
  switch (props.uiType) {
    case '玫瑰堆叠':
      return <Rose {...{
        data:datab,
        ...uiPunlicFile,
        legend: {
          position: 'top'
        },
        isStack: true,
        // 当 isStack 为 true 时，该值为必填
        radius: 0.9,
        label: {
          offset: -15,
        },
        interactions: [
          {
            type: 'element-active',
          },
        ],
      }} />;
    case '玫瑰带贴图的分组':
      return <Rose {...{
        data:datab,
        ...uiPunlicFile,
        isGroup: true,
        legend: {
          position: 'top'
        },
        radius: 0.9,
        label: {
          offset: -15,
        },
        pattern: {
          type: 'dot',
        },
        interactions: [
          {
            type: 'element-active',
          },
        ],
      }} />;
    case '玫瑰分组':
      return <Rose {...{
        data:dataa,
        ...uiPunlicFile,
        legend: {
          position: 'top'
        },
        radius: 0.9,
        label: {
          offset: -15,
        },
        interactions: [
          {
            type: 'element-active',
          },
        ],
      }} />;
  }
};

export default Ui;