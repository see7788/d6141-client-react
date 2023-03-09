import React from 'react';
import store from "../mcu-src/useStore"
import useUrlFrom from '../mcu-src/ipc/webSocket/useWsUriToker';
import App from "../mcu-src/index"
export default () => {
	const { msg, wsUri } = useUrlFrom("wsUri=ws://192.168.110.171/ws")
	const ipc_success = store(s => s.state)
	return <>{ipc_success ? <App /> : msg}</>
  }