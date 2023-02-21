import React, { FC, Suspense, useEffect, useState } from 'react'
import _ from 'lodash'
import { Radio, Tabs, Empty } from 'antd-mobile'
import { StarFill, StarOutline, FilterOutline } from 'antd-mobile-icons'
import store, { fjIdDb } from './store/webSocket'
import './styles/App4_style_a.css'

const InfoItemList: FC<{ fjIdDbs: fjIdDb[], idArr: number[] }> = ({ fjIdDbs, idArr }) => {
	const idLikeSet = store.fjsConfig.idArrSet
	if (fjIdDbs.length === 0) {
		return <Empty description='暂无数据' />
	}
	return (
		<div className="info-item-list">
			{fjIdDbs.map((v, i) => {
				const syIng = (v.nowNum / v.kenNum) * 100;
				const syNumber = v.kenNum - v.nowNum
				let syUiConfig = { text: '空闲', css: 'leisure' }
				switch (syIng) {
					case 100:
						syUiConfig = { text: '已满', css: 'full' }
						break;
					case 0:
						syUiConfig = { text: '无人', css: 'unmanned' }
				}
				return (
					<div key={i} className="info-item">
						<div className="item-titile-status">
							<span style={{ fontSize: '16px', fontWeight: '600' }}>
								{v.doorName}
							</span>
							{/* full,leisure,unmanned  三种className 根据状态显示 */}
							<span
								className={`${syUiConfig.css}`}
							>
								{syUiConfig.text}
							</span>
						</div>
						<div className="item-detail">
							<div>
								<span>当前人数</span>
								<span className="detail-num">{v.nowNum}</span>
							</div>
							<div>
								<span>剩余坑位</span>
								<span className="detail-num">
									{syNumber}
								</span>
							</div>
							{/* color属性 高亮该icon   激活 #FFD21E  未激活 #CCCCCC*/}
							<StarFill
								style={{ fontSize: '26px', color: idArr.indexOf(v.id) > -1 ? '#FFD21E' : '#CCCCCC' }}
								onClick={() => idLikeSet(v.id)}
							/>
						</div>
					</div>
				)
			})}
		</div>
	)
}

function App() {
	const [filterShow, filterShowSet] = useState(true)
	const [tabsKey, tabsKeySet] = useState<number>(101)
	const idArr = store(s => s.fjsConfig.idArr)
	const doorType = store(s => s.fjsConfig.doorType)
	const doorTypeSet = store.fjsConfig.doorTypeSet;
	const floorAll = store(s => _.uniq(Object.values(s.fjs).map(c => c.doorFloor)))
	const allDb = store(s => Object.values(s.fjs))
	const getDB = () => {
		switch (tabsKey) {
			case 100:
				//我的关注
				return allDb.filter(v =>doorType === v.doorType&&idArr.indexOf(v.id) > -1)
			case 101:
				//所有楼层
				return allDb.filter(v =>doorType === v.doorType)
			default:
				return allDb.filter(v => doorType === v.doorType&&v.doorFloor === tabsKey)
		}
	}
	const FilterUi = filterShow && (<div>
		<div className="floor-tabs-box">
			<Tabs
				style={{
					'--title-font-size': '16px', //文字大小
					'--active-line-height': '3px', //激活时下划线高度
					border: 'none',
					flex: '1',
					width: '100%',
					overflowX: 'auto',
				}}
				onChange={v => tabsKeySet(Number(v))}
				activeKey={tabsKey.toString()}
			>
				<Tabs.Tab title={<><StarOutline className="collect-btn" />我的关注</>} key={100} />,
				<Tabs.Tab title={`全部楼层`} key={101} />
				{floorAll.map(floor => <Tabs.Tab title={`${floor}层`} key={floor} />)}
			</Tabs>
		</div>
		<div className="gender-selection-box">
			<Radio.Group value={doorType} onChange={val => doorTypeSet(val as 'boy' | 'girl')} >
				<Radio value="boy">男生</Radio>
				<Radio value="girl">女生</Radio>
			</Radio.Group>
		</div>
	</div>)
	return (
		<div className="app4-sayle-a-base">
			<div className="navBar">
				卫生间人数实时统计<span className="collect-btn">
					<FilterOutline onClick={() => filterShowSet(!filterShow)} />
				</span>
			</div>
			{FilterUi}
			<InfoItemList fjIdDbs={getDB()} idArr={idArr}></InfoItemList>
		</div>
	)
}
export default App
