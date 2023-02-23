import React, { FC, Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Space, Layout } from 'antd';
const McuSpiffsApp = lazy(() => import('../mcu-spiffs/App'))
const Mcuwebsocket = lazy(() => import('../mcu-websocket/Route'))
const Mcuwebserial = lazy(() => import('../mcu-webserial/App'))
// import VConsole from 'vconsole';
// new VConsole();
// vConsole.destroy();//关闭
const headerStyle: React.CSSProperties = {
    // textAlign: 'center',
    //color: '#fff',
    // height: 64,
    // paddingInline: 50,
    // lineHeight: '64px',
    // backgroundColor: '#7dbcea',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};
const App: FC = () => {
    const { Header, Content } = Layout;
    const pages = { McuSpiffsApp, Mcuwebsocket, Mcuwebserial };
    const Btns = Object.keys(pages).map((name, i) => (
        <Link
            key={i}
            to={`/${name}`}>{name}
        </Link>
    ))
    const RouterPage: FC<{ children: React.ReactChild }> = (props) => (
        <Layout>
            <Header ><Space>{Btns}</Space></Header>
            <Content style={headerStyle}><>{props.children}</></Content>
        </Layout>
    )
    return (
        <BrowserRouter>
            <Suspense fallback={<h2>Loading..</h2>}>
                <Routes>
                    {
                        Object.entries(pages).map(([name, Ui]) => (
                            <Route
                                key={name}
                                path={`/${name}`}
                                element={<RouterPage><Ui /></RouterPage>}
                            />
                        ))
                    }
                    <Route path="*" element={<RouterPage><Mcuwebsocket /></RouterPage>} />
                </Routes>
            </Suspense>
        </BrowserRouter >
    )
}
export default App
// export default ()=><>123</>