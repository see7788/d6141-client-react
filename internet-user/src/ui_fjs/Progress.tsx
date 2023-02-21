import React, { FC, useEffect, useState } from 'react';
import { Progress, Tooltip, Divider } from 'antd';
import store from '../store/webSocket'
//ForestGreen//绿
//FireBrick //h红 
//GoldenRod  //黄
export type Param = {
  uiType?: '条状' | '圆形',
  steps?: true//分段
}
//percent进度
const Ui: FC<Param> = ({ uiType }) => {
  const data = store(s => s.fjsSelect.fjsFilter())
  const info = data.map((v, i) => {
    const shengyu = (v.kenNum - v.nowNum)
    const ingFalse = Math.round(shengyu * 100 / v.kenNum)
    return (
      <Tooltip
        key={i}
        title={`楼层${v.doorFloor}/房间名${v.doorName}/总位${v.kenNum}/可用位${shengyu}/可用率${ingFalse}%`}>
        <Progress
          type="line"
          percent={ingFalse}
          steps={v.kenNum}
          strokeColor={shengyu > 4 ? 'ForestGreen' : shengyu > 2 ? 'GoldenRod' : 'FireBrick'}
          format={(percent, successPercent) => v.doorName}
          strokeWidth={12}
        />
        <br />
        <br />
      </Tooltip>
    )
  })
  return <div>{info}</div>
}
export default Ui