import React, { FC, useState, useEffect } from 'react';
import store from "../useStore";
import { Descriptions } from "antd"
//<pre>{JSON.stringify(c, null, 2)}</pre>
const Ui: FC<{}> = () => {
    const espState = store(s => s.espState)
    useEffect(() => {
       
    }, []);
    const EspUi = Object.entries(espState).map(([k, v], i) => {
        return (
            <Descriptions key={i} title={k}>
                {Object.entries(v).map(([k2, v2], i) => (
                    <Descriptions.Item key={i} label={k2}>
                        {v2}
                    </Descriptions.Item>))}
            </Descriptions>
        )
    })
    return <>{EspUi}</>
}
export default Ui;