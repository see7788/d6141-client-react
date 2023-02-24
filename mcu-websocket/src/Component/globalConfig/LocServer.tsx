import React, { FC } from 'react';
import store,{Store} from "../../useStore";
import { Descriptions, Input, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const Ui: FC = () => {
    const locServer = store(s => s.globalConfig.locServer)
    return (
        <Descriptions
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                {Object.entries(locServer).map((kv,i)=>(
                    <Descriptions.Item key={i} label={kv[0]}>
                    <Input
                    bordered={false}
                    defaultValue={kv[1]}
                    maxLength={255}
                    onChange={e=>set(e.target.value)}
                />
                </Descriptions.Item>
                ))}
        </Descriptions>
    )
}
export default Ui;