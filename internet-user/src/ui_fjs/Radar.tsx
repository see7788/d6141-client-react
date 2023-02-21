import React, { FC, useEffect, useState } from 'react';
import { Radar } from '@ant-design/charts';
import store from '../store/webSocket'
//雷达图
export type Param = {
  uiType: '雷达图双色' | '雷达图双色带底色'
  style?: React.CSSProperties
}
const uiPunlicFile = {
  xField: 'xField',
  yField: 'yField',
  seriesField: 'seriesField',
}
const Ui: FC<Param> = (props) => {
  const data = store(s => s.fjsSelect.a())
  switch (props.uiType) {
    case '雷达图双色':
      return <Radar {...{
        data,
        ...uiPunlicFile,
        legend: {
          position: 'top'
        },
        meta: {
          score: {
            alias: '分数',
            min: 0,
            max: 80,
          },
        },
        xAxis: {
          line: null,
          tickLine: null,
          grid: {
            line: {
              style: {
                lineDash: null,
              },
            },
          },
        },
        // 开启面积
        area: {},
        // 开启辅助点
        point: {
          size: 2,
        }
      }} />;
    case '雷达图双色带底色':
      return <Radar {...{
        data,
        ...uiPunlicFile,
        legend: {
          position: 'top'
        },
        meta: {
          score: {
            alias: '分数',
            min: 0,
            max: 80,
          },
        },
        xAxis: {
          line: null,
          tickLine: null,
          grid: {
            line: {
              style: {
                lineDash: null,
              },
            },
          },
        },
        yAxis: {
          line: null,
          tickLine: null,
          grid: {
            line: {
              type: 'line',
              style: {
                lineDash: null,
              },
            },
            alternateColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        // 开启面积
        area: {},
        // 开启辅助点
        point: {
          size: 2,
        },
      }} />;
  }
};

export default Ui;