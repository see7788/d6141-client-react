import React, { FC, useEffect, useState } from 'react';
import { Result, Badge, Alert, Card, Progress, Space, Tooltip, Divider, Row, Col, Typography } from 'antd';
import { HeartOutlined, HeartFilled, HeartTwoTone, getTwoToneColor, setTwoToneColor, SmileOutlined } from '@ant-design/icons';
import _ from 'lodash';
import store, { fjIdDb } from '../store/webSocket'
//列表//#52c41a
const UiBadge: FC<{ fjIdDbs: fjIdDb[] }> = ({ fjIdDbs }) => {
    const doorLikeArr = store(s => s.fjsConfig.idArr)
    const doorLikeSet = store(s => s.fjsConfig.idArrSet);
    const TextUi: FC = (props) => <Typography.Text >{props.children}</Typography.Text>//type={config.antdcolor}
    const info = fjIdDbs.map((v, i) => {
        const shengyu = (v.kenNum - v.nowNum)
        const ingFalse = Math.round(shengyu * 100 / v.kenNum)
        const config: { antdcolor: 'success' | 'warning' | 'danger', color: string, text: string } = shengyu > 4 ? { antdcolor: 'success', color: 'LimeGreen', text: '空闲' } : shengyu > 0 ? { antdcolor: 'warning', color: 'GoldenRod', text: '一般' } : { antdcolor: 'danger', color: '#FF3333', text: '爆满' }
        // const title = (
        //     <Progress
        //         success={{ percent: ingFalse, strokeColor: '#00AA00' }}//完成色
        //         // percent={ingFalse}
        //         // trailColor={'#FF3333'}//未完成色
        //         // steps={v.kenNum}
        //         strokeWidth={6}
        //     // showInfo={false}
        //     />
        // )
        const title2 = <Progress
            percent={ingFalse}
            steps={v.kenNum}
            strokeColor={config.color}
            //showInfo={false}
            format={() => <Typography.Text type={config.antdcolor}>{`${ingFalse}%`}</Typography.Text>}
        />
        const doorLike = doorLikeArr.indexOf(v.id) > -1
        const doorLikeUi = <HeartTwoTone twoToneColor={doorLike ? "LimeGreen" : ''} onClick={() => doorLikeSet(v.id)} />
        return (
            <div key={i} style={{ margin: '10px' }}>
                <Badge.Ribbon key={i} text={v.doorName} color={config.color} >
                    <Card title={title2} size="small">
                        <Row>
                            <Col span={12}><TextUi>{`可用坑位${shengyu}`}</TextUi></Col>
                            <Col span={11}><TextUi>{`总坑位${v.kenNum}`}</TextUi></Col>
                            <Col span={1}>{doorLikeUi}</Col>
                        </Row>
                    </Card>
                </Badge.Ribbon>
            </div>
        )
    })
    const baseGood = _.maxBy(fjIdDbs, function (o) { return o.kenNum - o.nowNum });
    return (
        <div style={{ margin: '10px' }}>
            <div style={{ width: '95%', textAlign: 'right' }}>
            {fjIdDbs.length > 0 ? `当前${baseGood?.doorName}最佳:可用坑${(baseGood?.kenNum || 0) - (baseGood?.nowNum || 0)}个` : '请选择楼层'}
            </div>
            {info}
        </div>
    )
}
export default UiBadge
