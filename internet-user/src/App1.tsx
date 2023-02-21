import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Pagination, Space, Button } from 'antd'
const Column = lazy(() => import('./ui_fjs/Column'));
const Radar = lazy(() => import('./ui_fjs/Radar'));
const Charts = lazy(() => import('./ui_fjs/Charts'));
const RadialBar = lazy(() => import('./ui_fjs/RadialBar'));
const Radio = lazy(() => import('./ui_select_doorType/Radio'));
const Slider = lazy(() => import('./ui_select_doorFloors/Slider'));
const uis = [
    //<RadialBar key={1} uiType='堆叠玉珏图' />,
    <Column key={2} uiType='柱状堆叠' />,
    <Column key={3} uiType='柱状分组' />,
    <Column key={4} uiType='柱状堆叠联通区域' />,
    //<Column key={5}  uiType='柱状堆叠标注展示总计' />,
    //<Column key={6}  uiType='柱状堆叠设置背景色' />,
    <Charts key={7} uiType='玫瑰堆叠' />,
    <Charts key={8} uiType='玫瑰分组' />,
    <Charts key={9} uiType='玫瑰带贴图的分组' />,
    <Radar key={10} uiType='雷达图双色' />,
   // <Radar uiType='雷达图双色带底色' />,
]
const App = () => {
    const [uiId, uiIdSet] = useState(5)
    return (
        <Suspense fallback={<div>来个动画吧...</div>}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{
                    flex: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                }}>
                    {uis[uiId]}
                </div>
                <Slider />
                <Space>
                    <Radio />
                    <Pagination
                        simple
                        size="small"
                        pageSize={1}
                        defaultCurrent={uiId}
                        onChange={e => uiIdSet(e - 1)}
                        total={uis.length} />
                </Space>
            </div>
        </Suspense>
    )
}
export default App;