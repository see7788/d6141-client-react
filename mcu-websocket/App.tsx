import React from 'react';
import store from "../mcu-src/useStore"
import useUrlFrom from '../mcu-src/ipc/webSocket/useWsUriToker';
import App from "../mcu-src/index"
export default () => {
  //console.log(`ws://${window.location.hostname}/ws`)
  const { msg } = useUrlFrom("wsUri=ws://192.168.110.172/ws")
  const workIng = store(s => s.ipc.globalConfig)
  return <>{workIng ? <App /> : msg}</>
}