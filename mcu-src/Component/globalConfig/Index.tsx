import React, { FC, useEffect, } from 'react';
import store from "../../useStore";
import FangJian from "./FangJian";
import WiFi from "./WiFiSta";
import UartYbl from "./UartYbl";
import WebServer from "./LocServer";
import InternetServer from "./InternetServer";
import { Divider, Space, Button } from 'antd';
const Ui: FC = () => {
    useEffect(() => {
        store.getState().api("globalConfig_get")
    }, [])
    return (
        <>
            <Divider orientation="center">访问配置</Divider>
            <WebServer />
            <Divider orientation="center">WiFi配置</Divider>
            <WiFi />
            <Divider orientation="center">云服务配置</Divider>
            <InternetServer />
            <Divider orientation="center">房间配置</Divider>
            <FangJian />
            <Divider orientation="center">YBL传感器配置</Divider>
            <UartYbl />
        </>
    )
}
export default Ui;