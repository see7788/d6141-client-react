import React, { FC, useEffect, useState } from 'react';
import { Column } from '@ant-design/charts';
import { each, groupBy } from '@antv/util';
import store from '../store/webSocket'
//柱状图
export type Param = {
    uiType: '柱状堆叠' | '柱状堆叠联通区域'  | '柱状堆叠设置背景色' | '柱状分组'//| '柱状堆叠标注展示总计'
    style?: React.CSSProperties
}
const uiPunlicFile = {
    xField: 'xField',
    yField: 'yField',
    seriesField: 'seriesField',
}
const Ui: FC<Param> = (props) => {
    const dataa = store(s => s.fjsSelect.a())
    const datab = store(s => s.fjsSelect.b())
    switch (props.uiType) {
        case '柱状堆叠':
            return <Column {...{
                data: datab,
                ...uiPunlicFile,
                legend: {
                    position: 'top'
                },
                isStack: true,
                label: {
                    // 可手动配置 label 数据标签位置
                    position: 'middle',
                    // 'top', 'bottom', 'middle'
                    // 可配置附加的布局方法
                    layout: [
                        // 柱形图数据标签位置自动调整
                        {
                            type: 'interval-adjust-position',
                        }, // 数据标签防遮挡
                        {
                            type: 'interval-hide-overlap',
                        }, // 数据标签文颜色自动调整
                        {
                            type: 'adjust-color',
                        },
                    ],
                },
            }} />;
        case '柱状堆叠联通区域':
            return <Column  {...{
                data: datab,
                ...uiPunlicFile,
                isStack: true,
                legend: {
                    position: 'top'
                },
                label: {
                    // 可手动配置 label 数据标签位置
                    position: 'middle', // 'top', 'bottom', 'middle'
                },
                interactions: [
                    {
                        type: 'active-region',
                        enable: false,
                    },
                ],
                connectedArea: {
                    style: (oldStyle, element) => {
                        return {
                            fill: 'rgba(0,0,0,0.25)',
                            stroke: oldStyle.fill,
                            lineWidth: 0.5,
                        };
                    },
                },
            }} />;
        // case '柱状堆叠标注展示总计':
        //     const annotations: any[] = [];
        //     each(groupBy(datab as any, 'xField'), (values: any, k: any) => {
        //         const value = values.reduce((a: any, b: any) => a + b.value, 0);
        //         annotations.push({
        //             type: 'text',
        //             position: [k, value],
        //             content: `${value}`,
        //             style: {
        //                 textAlign: 'center',
        //                 fontSize: 14,
        //                 fill: 'rgba(0,0,0,0.85)',
        //             },
        //             offsetY: -10,
        //         });
        //     });
        //     return <Column {...{
        //         data: datab,
        //         ...uiPunlicFile,
        //         isStack: true,
        //         legend: {
        //             position: 'top'
        //         },
        //         label: {
        //             // 可手动配置 label 数据标签位置
        //             position: 'middle',
        //             // 'top', 'bottom', 'middle'
        //             // 可配置附加的布局方法
        //             layout: [
        //                 // 柱形图数据标签位置自动调整
        //                 {
        //                     type: 'interval-adjust-position',
        //                 }, // 数据标签防遮挡
        //                 {
        //                     type: 'interval-hide-overlap',
        //                 }, // 数据标签文颜色自动调整
        //                 {
        //                     type: 'adjust-color',
        //                 },
        //             ],
        //         },
        //         // 使用 annotation （图形标注）来展示：总数的 label
        //         annotations,
        //     }} />;
        case '柱状堆叠设置背景色':
            return <Column {...{
                data: datab,
                ...uiPunlicFile,
                isStack: true,
                legend: {
                    position: 'top'
                },
                label: {
                    // 可手动配置 label 数据标签位置
                    position: 'middle', // 'top', 'bottom', 'middle'
                },
                interactions: [
                    {
                        type: 'active-region',
                        enable: false,
                    },
                ],
                columnBackground: {
                    style: {
                        fill: 'rgba(0,0,0,0.1)',
                    }
                }
            }} />;
        case '柱状分组':
            return <Column {...{
                data: dataa,
                ...uiPunlicFile,
                isStack: true,
                legend: {
                    position: 'top'
                },
                label: {
                    // 可手动配置 label 数据标签位置
                    position: 'middle',
                    // 'top', 'middle', 'bottom'
                    // 可配置附加的布局方法
                    layout: [
                        // 柱形图数据标签位置自动调整
                        {
                            type: 'interval-adjust-position',
                        }, // 数据标签防遮挡
                        {
                            type: 'interval-hide-overlap',
                        }, // 数据标签文颜色自动调整
                        {
                            type: 'adjust-color',
                        },
                    ],
                },
            }} />;
    }
};

export default Ui;