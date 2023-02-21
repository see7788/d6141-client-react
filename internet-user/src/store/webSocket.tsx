import mobz from 'mobz'
import cookies from 'js-cookie'
import _ from 'lodash';
export interface fjIdDb {
    'id': number,//id
    'doorFloor': number,//楼层
    'doorName': string,//房间名
    'doorType': DoorType,//girl|boy
    'dateTime': string,//时间
    'nowNum': number,//当前人数
    'kenNum': number//总共坑位
}
declare global {
    interface Window {
        config6142Db: {
            socketAllUrl: string
            fjs: fjIdDb[]
        }
    }
}
type DoorType = 'boy' | 'girl'
type DoorFloor = [number, number];
type DoorFloorArr = number[];
type DoorLikeArr = number[];
type uiDb_a = {
    xField: string,
    yField: number,
    seriesField: '坑位总数' | '当前人数',
}[]
type uiDb_b = {
    xField: string,
    yField: number,
    seriesField: '剩余坑位' | '当前人数',
}[]
type Store = {
    fjs: Record<number, fjIdDb>//原始数据
    fjsConfig: {
        doorType: DoorType,//选男女
        doorTypeSet(doorType: DoorType): void,
        doorFloorBetween: DoorFloor,//选楼层范围值
        doorFloorBetweenSet(minmax: DoorFloor): void
        doorFloorsArr: DoorFloorArr,//选楼层多选
        doorFloorsArrSet(doorFloor: number[] | number): void
        idArr: DoorLikeArr//选房间多选
        idArrSet(fjid: number[] | number): void
    }
    fjsSelect: {
        fjsFilter(): fjIdDb[],
        a(): uiDb_a
        b(): uiDb_b
    }
}
function socketInit1(): WebSocket {
    return new WebSocket(window.config6142Db.socketAllUrl);
}
let ws = socketInit1();
export default mobz<Store>((get, set) => {
    const socketInit2 = () => {
        ws.onmessage = ({ data }) => {
            data = JSON.parse(data)
            switch (data.api) {
                case '房间':
                    get().fjs[data.info.id] = data.info
                    console.log('switch:' + data.api, data)
                    break;
                default:
                    console.log('switch不处理', data);
            }
        }
        ws.onopen = () => console.log('WebSocket onopen');
        ws.onerror = e => console.log('onerror', e);
        ws.onclose = () => {
            console.log('WebSocket onopen');
            socketInit1();
            socketInit2();
        };
    }
    socketInit2();
    function fjsInit() {
        const c: Record<number, fjIdDb> = {}
        window.config6142Db.fjs.forEach(v => c[v.id] = v)
        console.log(c);
        return c;
    }
    function doorFloorsInit(): DoorFloor {
        const c = window.config6142Db.fjs.map(({ doorFloor }) => doorFloor);
        const min = Number(cookies.get('doorFloorsMin') || _.min(c));
        const max = Number(cookies.get('doorFloorsMax') || _.max(c))
        console.log(cookies.get('doorFloorsMin'), cookies.get('doorFloorsMax'));
        return [
            min,
            max
        ]
    }
    const store: Store = {
        fjsConfig: {
            doorType: (cookies.get('doorType') || 'boy') as DoorType,
            doorTypeSet: (doorType) => {
                get().fjsConfig.doorType = doorType
                cookies.set('doorType', doorType)
            },
            doorFloorBetween: doorFloorsInit(),
            doorFloorBetweenSet: (doorFloors: DoorFloor) => {
                get().fjsConfig.doorFloorBetween = doorFloors;
                const [min, max] = doorFloors;
                cookies.set('doorFloorsMin', `${min}`)
                cookies.set('doorFloorsMax', `${max}`)
            },
            doorFloorsArr: JSON.parse(cookies.get('doorFloorsArr') || '[]'),
            doorFloorsArrSet: (doorFloor) => {
                let c: number[] = [];
                if (typeof doorFloor === 'number') {
                    c = get().fjsConfig.doorFloorsArr;
                    if (c.indexOf(doorFloor) > -1) {
                        c = c.filter(v => v !== doorFloor)
                    } else {
                        c = [...c, doorFloor];
                    }
                } else {
                    c = doorFloor
                }
                c = _.sortBy(c)
                get().fjsConfig.doorFloorsArr = c;
                cookies.set('doorFloorsArr', JSON.stringify(c));
            },
            idArr: JSON.parse(cookies.get('doorLikeArr') || '[]'),
            idArrSet: (fjid) => {
                let c: number[] = [];
                if (typeof fjid === 'number') {
                    c = get().fjsConfig.idArr;
                    if (c.indexOf(fjid) > -1) {
                        c = c.filter(v => v !== fjid)
                    } else {
                        c = [...c, fjid];
                    }
                } else {
                    c = fjid
                }
                c = _.sortBy(c)
                get().fjsConfig.idArr = c;
                cookies.set('doorLikeArr', JSON.stringify(c))
            },
        },
        fjs: fjsInit(),
        fjsSelect: {
            fjsFilter: () => {
                const doorType = get().fjsConfig.doorType
                const [min, max] = get().fjsConfig.doorFloorBetween;
                return Object.values(get().fjs).filter(c => {
                    return c.doorType === doorType && c.doorFloor >= min && c.doorFloor <= max
                })
            },
            a: () => {
                const data: uiDb_a = []
                get().fjsSelect.fjsFilter().forEach(({ id, doorName, doorType, kenNum, nowNum }) => {
                    data.push({
                        xField: `${id}:${doorName}-${doorType}`,
                        yField: nowNum,
                        seriesField: '当前人数',
                    });
                    data.push({
                        xField: `${id}:${doorName}-${doorType}`,
                        yField: kenNum,
                        seriesField: '坑位总数',
                    });
                })
                return data;
            },
            b: () => {
                const data: uiDb_b = [];
                get().fjsSelect.fjsFilter().forEach(({ id, doorName, doorType, kenNum, nowNum }) => {
                    const c = kenNum - nowNum
                    data.push({
                        xField: `${id}:${doorName}-${doorType}`,
                        yField: nowNum,
                        seriesField: '当前人数',
                    });
                    data.push({
                        xField: `${id}:${doorName}-${doorType}`,
                        yField: c >= 0 ? c : 0,
                        seriesField: '剩余坑位',
                    });
                })
                return data;
            }
        },
    }
    return store;
})