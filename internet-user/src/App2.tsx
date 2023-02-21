import React, { FC, Suspense, useState } from 'react';
import { BrowserRouter, Route, Routes, Link, useRoutes, useNavigate, useLocation } from 'react-router-dom'
import { DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Space } from 'antd'
import Column from './ui_fjs/Column';
import Radar from './ui_fjs/Radar';
import Charts from './ui_fjs/Charts';
import RadialBar from './ui_fjs/RadialBar';
import Progress from './ui_fjs/Progress'
import Radio from './ui_select_doorType/Radio';
import Slider from './ui_select_doorFloors/Slider';

function App() {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "95%" }}>
            <BrowserRouter>
                <div style={{
                    flex: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                }}>
                    <Routes>
                        <Route path="/1" element={<Column uiType='柱状堆叠' />} />
                        <Route path="/2" element={<Column uiType='柱状分组' />} />
                        <Route path="/3" element={<Column uiType='柱状堆叠联通区域' />} />
                        <Route path="/4" element={<Charts uiType='玫瑰堆叠' />} />
                        <Route path="/5" element={<Charts uiType='玫瑰分组' />} />
                        <Route path="/6" element={<Charts uiType='玫瑰带贴图的分组' />} />
                        <Route path="/7" element={<Radar uiType='雷达图双色' />} />
                        <Route path="/8" element={<RadialBar uiType='堆叠玉珏图' />} />
                        <Route path="/9" element={<Progress />} />
                        <Route path="*" element={<Progress uiType={"条状"}/>} />
                    </Routes>
                </div>
                <Slider />
                <Space>
                    <Radio />
                    <nav>
                        <Space>{[1,2,3,4,5,6,7,8,9].map((i) => <Link key={i} to={`/${i}`}>{i}</Link>)}</Space>
                    </nav>
                </Space>
            </BrowserRouter>
        </div>
    );
}
export default App