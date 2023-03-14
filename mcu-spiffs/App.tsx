import React, { useEffect, useState, lazy, Suspense } from 'react';
import store from "../mcu-src/useStore"
const App =lazy(()=>import("../mcu-src/state/index"))
// const Qrcode = lazy(() => import("../mcu-src/ipc/webSocket/QrCard"))
// import { FloatButton, Popover,notification } from "antd"
const hostname = window.location.hostname
const wsUri = `ws://${hostname === "localhost" ? "192.168.110.142" : hostname}/ws` as const
store.getState().ipc.webSocketInit(wsUri)
export default () => {
  const [ipcname, statesucc] = store(s => s.ipc.state)
  const msg = "正在连接"
  // const openNotification = () => {
  //   notification.open({
  //     message: 'Notification Title',
  //     description: (<Suspense fallback={<>我是懒加载</>}>
  //       <Qrcode qrUrl={wsUri} />
  //     </Suspense>)

  //   });
  // };
  // const ipc = (
  //   <FloatButton
  //     description="二维码"
  //     shape="square"
  //     style={{ right: 120 }}
  //     onClick={openNotification}
  //   />
  // )
  return <>{ipcname && statesucc ? <><App /></> : msg}</>
}