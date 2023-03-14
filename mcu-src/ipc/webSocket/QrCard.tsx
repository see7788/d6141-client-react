import React, { FC, useState, useEffect } from 'react';
import { Card, QRCode } from "antd"
//<pre>{JSON.stringify(c, null, 2)}</pre>
const { Meta } = Card;
const Ui: FC<{ qrUrl: string, size?: number }> = ({ qrUrl, size = 500 }) => {
    return (
        <Card
            hoverable
            style={{ width: 100 }}
            cover={<QRCode
                size={size}
                icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                iconSize={90}
                value={qrUrl}
            />}
        >
            <Meta title="朋友快速加入二维码" description="朋友先连接设备父路由，再用微信或者相机扫码" />
        </Card>
    )
}
export default Ui;