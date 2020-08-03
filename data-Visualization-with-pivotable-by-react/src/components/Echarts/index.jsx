import React from 'react';
var echarts = require('echarts');

class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            barOptions: {
                legend: {},
                tooltip: {},
                dataset: {
                    dimensions: [],
                    source: [
                    ]
                },
                title: {
                    text: 'Bar Chart'
                },
                xAxis: {type: 'category'},
                yAxis: {},
                series: [
                    {type: 'bar'},
                    {type: 'bar'},
                    {type: 'bar'},
                    {type: 'bar'}
                ]
            },
            lineOptions: {
                tooltip: {
                    trigger: 'axis'
                },
                title: {
                    text: 'Line Chart'
                },
                legend: {
                    data:[]
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'log'
                },
                series: [
                ]
            },
            pieOptions: {
                tooltip : {
                    trigger: 'item',
                    formatter: function(arg){
                        let template = arg.data.name + "<br/>" + ' count: ' + arg.data.count + "<br/>" + 'Total: $'  + arg.data.value + "<br/>" + 'proportion: '  + arg.percent +'%'
                        return template
                    }
                },
                legend: {
                    data: [],
                    top: 'auto',
                    zlevel: -2
                },
                title: {
                    text: 'Pie Chart'
                },
                series : [
                    {
                        type: 'pie',
                        radius: ['50%', '70%'],
                        name: "销售额",
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                                formatter: function(arg){
                                    let template = 'total: $' + arg.data.total
                                    return template
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '18',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        data:[
                        ]
                    }
                ]
            }
        }
        this.initChart = this.initChart.bind(this);
    }
    initChart() {
        const { barOptions, lineOptions, pieOptions } = this.state;
        const { options, type } = this.props;
        this.setState({
            id: type
        });
        let myChart;
        switch (type) {
            case 1:
                //柱状图
                myChart = echarts.init(this.refs.barChart);

                for (let i = 1; i < 13; i++){
                    options[1][i].data.unshift(i+ '月');
                    options[1][i].index.unshift('month');
                }
                barOptions.dataset.dimensions = options[1][1].index;
        
                let barSource = [];
                for (let i = 1; i < 13; i++){
                    let obj = {};
                    obj[barOptions.dataset.dimensions[0]]= options[1][i].data[0];
                    obj[barOptions.dataset.dimensions[1]]= options[1][i].data[1];
                    obj[barOptions.dataset.dimensions[2]]= options[1][i].data[2];
                    obj[barOptions.dataset.dimensions[3]]= options[1][i].data[3];
                    obj[barOptions.dataset.dimensions[4]]= options[1][i].data[4];
                    barSource.push(obj);
                }
                barOptions.dataset.source = barSource;
                myChart.setOption(barOptions);
                break;
            case 2:
                //折线图
                myChart = echarts.init(this.refs.lineChart);

                lineOptions.legend.data = options[2].columns;

                lineOptions.xAxis.data = options[2].index;

                let lineSeries = [];
                for(let i = 0; i < 2; i++){
                    let obj = {};
                    obj.name= options[2].columns[i];
                    obj.type= 'line';
                    obj.stack= '总量';
                    obj.data= [];
                    for(let x = 0; x < 12; x++){
                        let value = options[2].data[x][i];
                        obj.data.push(value);
                    }
                    lineSeries.push(obj);
                }
                lineOptions.series = lineSeries;
                myChart.setOption(lineOptions);
                break;
            case 3:
                //饼图
                myChart = echarts.init(this.refs.pieChart);

                pieOptions.legend.data = options[3].index;

                let pie = [];
                options[3].index.forEach(function (el,index) {
                    let obj  = {};
                    obj.name = el;
                    obj.value = options[3].data[index][1];
                    obj.total = options[4].data[0];
                    obj.count = options[3].data[index][0];
                    pie.push(obj);
                })
                pieOptions.series[0].data = pie;
                myChart.setOption(pieOptions);
                break;
        }
    }
    componentDidMount() {
        this.initChart();
    }
    render() {
        const { type } = this.props;
        return (
            <div>
                
                { type == 1 ? (
                        <div ref="barChart" style={{width: "80%", height: "300px"}}></div>
                    ) : (
                        ''
                    )
                }
                {type == 2 ? (
                        <div ref="lineChart" style={{width: "80%", height: "300px"}}></div>
                    ) : (
                        ''
                    )
                }
                {type == 3 ? (
                        <div ref="pieChart" style={{width: "80%", height: "300px"}}></div>
                    ) : (
                        ''
                    )
                }            
            </div>
        )
    }
}

export default Chart;