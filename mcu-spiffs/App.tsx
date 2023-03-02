import React, { FC, Suspense, lazy, useEffect, useState } from 'react';
import useUrlFrom from '../mcu-src/ws-init/useWsUriToker';
import { Routes, Route } from "react-router-dom";
const QrCard = lazy(() => import("../mcu-src/ws-init/QrCard"))

// import VConsole from 'vconsole';
// https://m.tb.cn/h.UM0j2vD?tk=tUtOdS6uVB2
// https://item.taobao.com/item.htm?id=597150907052&ali_refid=a3_430585_1006:1102727029:N:vcKdxPL1Mc%2BCOsk4%2FJ9lK5bWHkMh5zBs:08488907299819d284cd41abca108d0d&ali_trackid=1_08488907299819d284cd41abca108d0d&spm=3780k.1.0.0#detail
// 显示板的板费是164十片，材料费是45块钱一片板子（6毛钱的灯珠每块板子贴70个），贴片费是210，发嘉立创贴的，可能要贴10片，烧录器10个成本60（器件费）+35（板费）。工时算一天。得按十块显示板给你出，价格1219；
// 还有数码管的那个塑料壳5.8一个，运费8，那就是要6片价格是991.8，十片价格是1285

// 4片，板费92，材料费总共180，叫别人贴贴片费150，工时算一天（300），加上烧录器（95）和塑料壳（31.2），报价756.2，十片就是上面报价1219
// new VConsole();
// vConsole.destroy();//关闭
const App: FC = () => {
  const { tokerMsg, qrUrl } = useUrlFrom("", "wsUri=ws://192.168.110.119/ws")
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {tokerMsg || <QrCard qrUrl={qrUrl()} />}
    </div>
  )
}

export default () => (
  <Routes>
    <Route index element={<App />}></Route>
  </Routes>
)