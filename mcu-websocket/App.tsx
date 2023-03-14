import React from 'react';
import store from "../mcu-src/useStore"
import App from "../mcu-src/index"
const wsUri="ws://192.168.110.142/ws"
store.getState().ipc.webSocketInit(wsUri)
export default () => {
  const msg="连接中"
  const workIng = store(s => s.ipc.state[1])
  return <>{workIng ? <App /> : msg}</>
}