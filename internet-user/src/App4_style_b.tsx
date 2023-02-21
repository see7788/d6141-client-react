import { FC, useEffect, useState } from 'react'
import _ from 'lodash'
//  antd mobile库
import {
	NavBar,
	Tabs,
	Selector,
	Radio,
	ProgressCircle,
	Popup,
	Empty
} from 'antd-mobile'
import {
	SetOutline,
	FilterOutline,
	HeartOutline,
	StarFill,
} from 'antd-mobile-icons'
import './styles/App4_style_b.css'
import store, { fjIdDb } from './store/webSocket'

const InfoItemList: FC<{ fjIdDbs: fjIdDb[] }> = ({ fjIdDbs }) => {
	const idLikeSet = store.fjsConfig.idArrSet
	const idArr = store(s => s.fjsConfig.idArr)
	//  计算坑位状态
	const remaining = (kenNum: number, nowNum: number, flag: string) => {
		let percentage = Math.round((nowNum / kenNum) * 100)
		//  人数百分比和坑位百分比不一样
		return `${flag === 'people' ? percentage : 100 - percentage}%`
	}
	if (fjIdDbs.length === 0) {
		return <Empty description='暂无数据' />
	}
	return (
		<div className="info-item-list">
			{fjIdDbs.map((v, i) => (
				<div key={i} className="info-item">
					<div className="item-title">
						<span style={{ fontSize: '16px', fontWeight: '400' }}>
							{v.doorName}
						</span>
						{/* color属性 高亮该icon   激活 #FFD21E  未激活 #CCCCCC*/}
						<StarFill
							onClick={() => idLikeSet(v.id)}
							style={{ fontSize: '18px', color: idArr.indexOf(v.id) > -1 ? '#FFD21E' : '#CCCCCC' }}
						/>
					</div>
					<div className="item-progress">
						<ProgressCircle
							percent={
								100 - Math.round((v.nowNum / v.kenNum) * 100)
							}
							style={{
								'--size': '90px',
								'--track-width': '12px',
								'--track-color': '#DE5D4F',
								'--fill-color': '#81E993',
							}}
						></ProgressCircle>
					</div>
					<ul className="item-detail">
						<li>
							<div
								style={{
									background: '#DE5D4F',
									width: '10px',
									height: '10px',
								}}
							></div>
							<span>当前人数</span>
							<span
								style={{ fontSize: '18px', fontWeight: '600' }}
							>
								{v.nowNum}
							</span>
							<span>
								{remaining(v.kenNum, v.nowNum, 'people')}
							</span>
						</li>
						<li>
							<div
								style={{
									background: '#81E993',
									width: '10px',
									height: '10px',
								}}
							></div>
							<span>剩余坑位</span>
							<span
								style={{ fontSize: '18px', fontWeight: '600' }}
							>
								{v.kenNum - v.nowNum}
							</span>
							<span>{remaining(v.kenNum, v.nowNum, 'pit')}</span>
						</li>
					</ul>
				</div>
			))}
		</div>
	)
}

function App() {
	//  筛选弹窗visible
	const [popupVisible, setPopupVisible] = useState(false)
	const allDb = store(s => Object.values(s.fjs))
	const floorAll = _.uniq(allDb.map(c => c.doorFloor))
	const floorsArr = store(s => s.fjsConfig.doorFloorsArr)
	const floorsArrSet = store(s => s.fjsConfig.doorFloorsArrSet)
	useEffect(() => {
		if (floorsArr.length === 0) {
			floorsArrSet(floorAll)
		}
	}, [])
	const doorType = store(s => s.fjsConfig.doorType)
	const doorTypeSet = store.fjsConfig.doorTypeSet;
	const idArr = store(s => s.fjsConfig.idArr)
	//  楼层选择器里的options
	const SelectorOpt = (floor: number) => ({
		label: `${floor}层`,
		value: floor as number,
	})

	const floorPopInfoUi = (
		<Popup
			visible={popupVisible}
			onMaskClick={() => {
				setPopupVisible(false)
			}}
			position="top"
			bodyStyle={{ minHeight: '40vh' }}
			bodyClassName="filtrate-popup-box"
		>
			<p className="title">选择我关注的楼层</p>
			<Selector
				style={{ '--checked-color': '#62DFC9', padding: '0 10px' }}
				options={floorAll.map(SelectorOpt)}
				value={floorsArr}
				multiple={true}
				onChange={(v, e) => {
					console.log(v)
					floorsArrSet(v)
					// doorFloorsArrSet(foolr, !foolrlike)
				}}
			/>
			<div className="filtrate-popup-footer">
				<div className="reset-btn" onClick={() => floorsArrSet(floorAll)}>
					重置
				</div>
				<div
					className="confirm-btn"
					onClick={() => setPopupVisible(false)}
				>
					确定
				</div>
			</div>
		</Popup>
	)
	const nvUi = (
		<div className="gender-selection-box">
			<Radio.Group
				value={doorType}
				onChange={val => doorTypeSet(val as 'boy' | 'girl')}
			>
				<Radio value="boy">男生</Radio>
				<Radio value="girl">女生</Radio>
			</Radio.Group>
		</div>
	)
	console.log(floorsArr);

	const floorUi = (
		<div className="floor-selection-box">
			<Selector
				style={{
					'--checked-color': '#E5F6F4',
					width: '80%',
					overflowX: 'auto',
				}}
				options={floorsArr.map(SelectorOpt)}
				value={floorsArr}
				onChange={(v, e) => {
					console.log('点这个不做修改了')
					// doorFloorsArrSet(foolr, !foolrlike)
				}}
				multiple={true}
			/>
			<span onClick={() => setPopupVisible(true)}>
				<FilterOutline />
				筛选
			</span>
		</div>
	)
	const [tabKey, tabKeySet] = useState('1')
	return (
		<div >
			{/* 这个组件建议封装在全局那 */}
			<NavBar
				onBack={() => {
					/* 返回函数 */
				}}
				style={{ background: '#fff' }}
			>
				卫生间人数实时统计
			</NavBar>
			{/* <div style={{ fontSize: '28px' }}><SetOutline onClick={() => setPopupVisible(true)} /></div> */}
			{floorUi}
			{nvUi}
			{floorPopInfoUi}
			{/* <div className="tabs-box"> */}
			<Tabs
				style={{
					'--title-font-size': '14px', //文字大小
					'--active-line-border-radius': '6px', //激活时下划线圆角
					'--active-line-height': '4px', //激活时下划线高度
					border: 'none',
				}}
				activeKey={tabKey}
				onChange={tabKeySet}
			>
				<Tabs.Tab title="全部" key="1" ><InfoItemList fjIdDbs={allDb.filter(v => doorType === v.doorType && floorsArr.indexOf(v.doorFloor) > -1)} /></Tabs.Tab>
				<Tabs.Tab title="关注" key="2" ><InfoItemList fjIdDbs={allDb.filter(v => doorType === v.doorType && floorsArr.indexOf(v.doorFloor) > -1 && idArr.indexOf(v.id) > -1)} /></Tabs.Tab>
			</Tabs>
		</div>
	)
}
export default App
