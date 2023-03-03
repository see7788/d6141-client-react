import React, { FC, useState, useEffect } from 'react';
import { Card, QRCode } from "antd"
import { useRafState } from "react-use"
//<pre>{JSON.stringify(c, null, 2)}</pre>
const Ui: FC<{ qrUrl: string ,size?:number}> = ({ qrUrl,size=500 }) => {
    const qrTitle = "朋友加入可用微信或者相机扫码"
    return <QRCode
        size={size}
        icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        iconSize={90}
        value={qrUrl}
    />
}
export default Ui;