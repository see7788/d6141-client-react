import React, { FC, Suspense, lazy, useEffect, useState } from 'react';
import { Collapse, Col, Row, Steps } from "antd"
const { Panel } = Collapse;
const App: FC = () => {
    return <Collapse>
        <Panel header="webSocket" key="1">
            webSocket
        </Panel>
        <Panel header="webSerial" key="2">
            webSerial
        </Panel>
    </Collapse>
}
export default App