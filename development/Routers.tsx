import React, { FC, Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Space, Layout } from 'antd';
const McuSpiffsApp = lazy(() => import('../mcu-spiffs/Routers'))
const Mcuwebsocket = lazy(() => import('../mcu-websocket/Routers'))
const Mcuwebserial = lazy(() => import('../mcu-webserial/Routers'))
// import VConsole from 'vconsole';
// new VConsole();
// vConsole.destroy();//关闭
const App: FC = () => {
    const pages = { McuSpiffsApp, Mcuwebsocket, Mcuwebserial };
    const Btns = () => (
        <Space>{
            Object.keys(pages).map((name, i) => (
                <Link
                    key={i}
                    to={`/${name}`}>{name}
                </Link>
            ))
        } </Space>
    )
    return (
        <Routes>
            {
                Object.entries(pages).map(([name, Ui]) => (
                    <Route
                        index
                        key={name}
                        path={`/${name}`}
                        element={<Ui />}
                    />
                ))
            }
            <Route
                path={`*`}
                element={<Btns />}
            />
        </Routes>
    )
}
export default App