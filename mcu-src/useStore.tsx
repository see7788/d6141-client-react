import reactstore from "../lib/react-usestore"
import globalConfig from "../globalConfig.json";
type PowerPartial<T> = { [U in keyof T]?: T[U] extends object ? PowerPartial<T[U]> : T[U]; }
export type State = (typeof globalConfig) & {
    ybl: {
        db: {
            [i: string]: [//id
                number, //定义排序
                boolean, //state开关状态
                number//yblRes.doTypes[number]用途
            ]
        }
    }
}

type ReqParam = {
    state_merge?: PowerPartial<State>;
    state_replace?: Partial<State>;
    api_globalConfig_set?: Partial<State>,
    api_globalConfig_get?: true,
    api_globalConfig_toFile?: true,
    api_globalConfig_fromFile?: true,
    api_espRestart?: true
};
export default reactstore<ReqParam, State>(globalConfig as State)
// let person= ['张三', '李四', '王五'];
// console.log(person.unshift('小明')); // 头部插入，返回数组长度
//person.pop();//删除最后一个