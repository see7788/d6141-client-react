import React, { FC, Suspense, useEffect, useState } from 'react'
import {
	BrowserRouter,
	Route,
	Routes,
	Link,
	useRoutes,
	useNavigate,
	useLocation,
} from 'react-router-dom'
import {
	HeartOutlined,
	HeartFilled,
	HeartTwoTone,
	getTwoToneColor,
	setTwoToneColor,
} from '@ant-design/icons'
import Badge from './ui_fjs/Badge'
import cookies from 'js-cookie'
import _ from 'lodash'
import { Button, Layout, Row, Col, Space, Tag, Drawer } from 'antd'
import NvUi from './ui_select_doorType/Radio'
import Slider from './ui_select_doorFloors/Slider'
import store from './store/webSocket'
import './styles/App4.css'
import { Tabs } from 'antd-mobile'
function App() {
	const allDb = store(s => Object.values(s.fjs))
	const floorAll = _.uniq(allDb.map(c => c.doorFloor))
	const doorFloorsArr = store(s => s.fjsConfig.doorFloorsArr)
	const doorFloorsArrSet = store(s => s.fjsConfig.doorFloorsArrSet)
	useEffect(() => {
		if (doorFloorsArr.length === 0) {
			doorFloorsArrSet(floorAll)
		}
	}, [])
	const doorType = store(s => s.fjsConfig.doorType)
	const idLikeArr = store(s => s.fjsConfig.idArr)
	const doorFloorsUi = _.uniq(allDb.map(c => c.doorFloor)).map(foolr => {
		const foolrlike = doorFloorsArr.indexOf(foolr) > -1
		return (
			<div key={foolr} style={{ padding: '4px 0' }}>
				<Button
					key={foolr}
					icon={
						foolrlike && <HeartTwoTone twoToneColor="LimeGreen" />
					}
					style={{ width: '76px' }}
					onClick={() => doorFloorsArrSet(foolr)}
				>
					{`${foolr}层`}
				</Button>
				{/* {c1
					.filter(
						c =>
							foolrlike &&
							doorType === c.doorType &&
							c.doorFloor === foolr
					)
					.map(c => {
						const fjlike = idLikeArr.indexOf(c.id) > -1
						return (
							<Button
								key={c.id}
								style={{ width: '130px', margin: '0 4px' }}
								icon={
									fjlike && (
										<HeartTwoTone twoToneColor="LimeGreen" />
									)
								}
								onClick={() => idLikeArrSet(c.id, !fjlike)}
							>
								{c.doorName}
							</Button>
						)
					})} */}
			</div>
		)
	})
	const fjsFilter = allDb.filter(
		v => doorFloorsArr.indexOf(v.doorFloor) > -1 && doorType === v.doorType
	)
	const fjsLike = allDb.filter(
		v =>
			idLikeArr.indexOf(v.id) > -1 &&
			doorFloorsArr.indexOf(v.doorFloor) > -1 &&
			doorType === v.doorType
	)
	const fjsLikeUse = useState(false)
	const fjsLikeDrawer = (
		<>
			<Drawer
				title="我的关注"
				placement={'bottom'}
				closable={false}
				onClose={() => fjsLikeUse[1](false)}
				visible={fjsLikeUse[0]}
			>
				<Badge fjIdDbs={fjsLike} />
			</Drawer>
			<div onClick={() => fjsLikeUse[1](true)}>我的关注</div>
		</>
	)
	const [tabsKey, setTabsKey] = useState('2')
	return (
		<div
			style={{
				minHeight: '100vh',
				backgroundColor: '#ececec',
				overflow: 'hidden',
			}}
		>
			<Tabs
				activeKey={tabsKey}
				onChange={key => setTabsKey(key)}
				style={{ background: '#fff' }}
			>
				<Tabs.Tab title="全部" key="1" >
					<Badge fjIdDbs={allDb} />
				</Tabs.Tab>
				<Tabs.Tab
					title={<><HeartTwoTone
						twoToneColor="LimeGreen"
						style={{ paddingRight: '4px' }}
					/>筛选</>}
					key="2"
				>
					<Space><NvUi />{fjsLike.length > 0 && fjsLikeDrawer}</Space>
					<Row>
						<Col span={4}>{doorFloorsUi}</Col>
						<Col span={20}>
							<Badge fjIdDbs={fjsFilter} />
						</Col>
					</Row>
				</Tabs.Tab>
			</Tabs>
		</div>
	)
}
export default App
