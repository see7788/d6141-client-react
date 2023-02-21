import React, { FC, Suspense, useState } from 'react';
import Badge from './ui_fjs/Badge';
import { Space } from 'antd'
import Radio from './ui_select_doorType/Radio';
import Slider from './ui_select_doorFloors/Slider';
import store from './store/webSocket'
function App() {
    const c1 = store(s => Object.values(s.fjs))
    return (
        <div style={{
            display: "flex", flexDirection: "column", height: "95%"
        }}>
            <div style={{
                flex: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}> <Radio /></div>
            <div style={{
                flex: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
            }}>
               <Badge fjIdDbs={c1} />
            </div>
            <Slider />
        </div>
    );
}
export default App