import React, { useEffect, useState } from 'react';
import store from "../mcu-src/useStore"
import App from "../mcu-src/state/index"
// import App from "../mcu-src/index"
import useUrlFrom from '../mcu-src/ipc/webSocket/useWsUriToker';
// import { FloatButton } from "antd"
const hostname = window.location.hostname
const wsUri = `ws://${hostname === "localhost" ? "192.168.110.172" : hostname}/ws` as const
export default () => {
  const { msg } = useUrlFrom("wsUri=ws://192.168.110.172/ws")
  const workIng = store(s => s.ipc.globalConfig)
  // const ipc = <FloatButton
  //   description="分享二维码"
  //   shape="square"
  //   style={{ right: 120 }}
  //   onClick={() => {
  //     store.setState(s => {
  //       s.req("api_globalConfig_toFile")
  //     });
  //   }}
  // />
  // return <>{workIng ? <><App />{ipc}</> : msg}</>
  return <>{workIng ? <App /> : msg}</>
}