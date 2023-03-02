import React, { FC, useState, useEffect } from 'react';
import { Card, QRCode } from "antd"
//<pre>{JSON.stringify(c, null, 2)}</pre>
const Ui: FC<{ qrUrl: string }> = ({ qrUrl }) => {
    // const [windowWidth, setwindowWidth] = useState(window.innerWidth);
    // function handleWindowResize() {
    //     setwindowWidth(window.innerWidth);
    // }
    const qrSizeDef = 350;
    const qrTitle = "朋友加入可用微信或者相机扫码"
    const qrDesc = "访问者之间的操作,是响应式的,实时互动的。扫码前，请确保您的设备已经连接到本设备上游路由器。"
    const [qrSize, qrSizeSet] = useState(qrSizeDef)
    const { Meta } = Card;
    // useEffect(() => {
    //     handleWindowResize();
    //     window.addEventListener('resize', handleWindowResize);
    //     return () => {
    //         window.removeEventListener('resize', handleWindowResize);
    //     };
    // }, []);
    return (
        <Card
            hoverable={true}
            style={{ width: qrSizeDef }}
            cover={
                <QRCode
                    size={qrSize}
                    icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                    iconSize={90}
                    value={qrUrl}
                />
            }
        >
            <Meta
                title={qrTitle}
                description={qrDesc}
            />
        </Card>
    )
}
export default Ui;