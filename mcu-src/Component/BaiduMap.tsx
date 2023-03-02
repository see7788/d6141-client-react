import React, { FC } from 'react';
import { Map, APILoader } from '@uiw/react-baidu-map';
import { useWindowSize } from 'react-use'
const Ui: FC = () => {
    const { width, height } = useWindowSize();
    return (
        <div style={{
            width,
            height: height - 70,
            overflow: 'auto'
        }}>
            <APILoader akay="eYpCTECSntZmw0WyoQ7zFpCRR9cpgHFG">
                <Map
                    center="北京"
                >
                </Map>
            </APILoader>
        </div>
    )
}
export default Ui;