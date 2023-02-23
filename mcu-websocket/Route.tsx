import React, { FC, Suspense, lazy, useEffect, useState } from 'react';
import { Route,Link } from 'react-router-dom';
import { Space, Layout } from 'antd';
import useUrlFrom from '../mcu-fc/Component/ws-init/useWsUriToker';
const QrCard = lazy(() => import('../mcu-fc/Component/ws-init/QrCard'))
const EspState = lazy(() => import('../mcu-fc/Component/EspState'))
const GlobalConfig = lazy(() => import('../mcu-fc/Component/global-config/Index'))
// import VConsole from 'vconsole';
// new VConsole();
// vConsole.destroy();//关闭
const headerStyle: React.CSSProperties = {
  // textAlign: 'center',
  color: '#fff',
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
  const { tokerMsg, qrUrl } = useUrlFrom()
  const Index = () => tokerMsg === "" ? <QrCard qrUrl={qrUrl()} /> : <>{tokerMsg}</>
  const pages = { Index, EspState, GlobalConfig };
  const Btns = Object.keys(pages).map((name, i) => (
    <Link
      key={i}
      to={`/${name}`}>{name}
    </Link>
  ))
  const RouterPage: FC<{ children: React.ReactChild }> = (props) => (
    <Layout>
      <Header style={headerStyle}><Space>{Btns}</Space></Header>
      <Content style={headerStyle}><>{props.children}</></Content>
    </Layout>
  )
  return (
    <>
      {
        Object.entries(pages).map(([name, Ui]) => (
          <Route
            key={name}
            path={`${name}`}
            element={<RouterPage><Ui /></RouterPage>}
          />
        ))
      }
      <Route index element={tokerMsg ? <>{tokerMsg}</> : <RouterPage><Index /></RouterPage>} />
      <Route path={"*"} element={tokerMsg ? <>{tokerMsg}</> : <RouterPage><Index /></RouterPage>} />
    </>
  )
}
export default App
