import React from 'react';
import { Upload, Button, Icon, Row, Col } from 'antd';

import linePic from '../../assets/images/line.jpg';
import barPic from '../../assets/images/bar.jpg';
import piePic from '../../assets/images/pie.jpg';
import pivPic from '../../assets/images/pivot.jpg';

import PivotTable from '../../components/PivotTable/index.jsx'
import Chart from '../../components/Echarts/index.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "app",
            linePic: linePic,
            barPic: barPic,
            piePic: piePic,
            pivPic: pivPic,
            selectType: [],
            status: 1,
            mixData: {},
            type1: 0,
            type2: 0,
            type3: 0
        }
        this.drop = this.drop.bind(this);
        this.getData = this.getData.bind(this);
    }
    drag(e) {
        e.dataTransfer.setData("Text",e.target.id);
    }
    drop(e) {
        let _this = this;
        const { selectType, status } = this.state;

        //判断是否上传成功
        if(status == 2) { 

            //存入用户选择的渲染类型
            let dragId = e.dataTransfer.getData("Text");
            let chartIndex = selectType.indexOf(dragId) + 1;
            switch (chartIndex) {
                case 0:
                    selectType.push(dragId);
                    break;
                default:
                    break;
            }

            //判断是否选择了透析表
            let pivIndex = selectType.indexOf("pivotTable") + 1;

            //判断是否选择了两种以上图形
            if( selectType.length >= 2 && pivIndex ) {

                //获取需要渲染的类型
                selectType.forEach( function(item) {
                    if(item.includes('1')) {
                        _this.setState({
                            type1: 1
                        });
                    } else if(item.includes('2')) {
                        _this.setState({
                            type2: 1
                        });

                    } else if(item.includes('3')) {
                        _this.setState({
                            type3: 1
                        });
                    } else {
                        let a;
                    }
                })

                //开始渲染
                this.setState({
                    selectType: selectType,
                    status: 3
                });
            }
        }
    }
    getData(params) {
        let mixData = params.file.response;

        //图形类型初始化
        this.setState({
            selectType: []
        });

        //判断是否上传成功
        if(mixData) {
            this.setState({
                status : 2,
                mixData: mixData
            });
        }
        
    }
    render() {
        const { status, mixData, type1, type2, type3 } = this.state;
        return (
            <div onDragOver={ (ev) => { ev.preventDefault()}} onDrop={this.drop}>
                <Row>
                    <Col span={6}>
                        <ul onDragStart={this.drag} draggable={true} style={{listStyle: 'none'}}>
                            <li style={{fontSize: '20px', color: 'red'}}>
                                Chart Type
                            </li>
                            <li>
                                Line Chart
                                <ul>
                                    <li>
                                    <img  src={linePic} id="line2" />
                                    </li>
                                </ul>  
                            </li>
                            <br/>
                            <li>
                                Histogram
                                <ul>
                                    <li>
                                    <img  src={barPic} id="bar1"/>
                                    </li>
                                </ul>
                            </li>
                            <br/>
                            <li>
                                Pie Chart
                                <ul>
                                    <li>
                                    <img  src={piePic} id="pie3"/>
                                    </li>
                                </ul>
                            </li>
                            <br/>
                            <li>
                                Pivot Table
                                <ul>
                                    <li>
                                    <img  src={pivPic} id="pivotTable"/>
                                    </li>
                                </ul>
                            </li>
                        </ul>  
                    </Col>
                    <Col span={18}>
                        <h1 className="head">数据可视化小工具 ( React版 )</h1>
                        <br/>
                        
                        {/* 上传组件  */}
                        <Upload onChange={this.getData} accept="csv" name="file" action="//localhost:5000/transData">
                            <Button>
                            <Icon type="upload" />Click to Upload
                            </Button>
                        </Upload> 
                        <br/>

                        {/* 操作步骤提示 */}
                        <h3 className="shadow">
                            {status == 1 ? (
                                "请上传数据"
                            ) : ( status ==2 ) ? (
                                "请选择渲染类型"
                            ) : (
                                ""
                            )}
                        </h3>
                        
                        {/* 渲染主题 */}
                        {status == 3 ? (
                            <div>
                                {/* 透析表  */}
                                <PivotTable dataSource={mixData}/><br/>

                                {type1 == 1 ? (
                                    <div><Chart options={mixData} type={1}/><br/></div>
                                    
                                ) : (
                                    ""
                                )}
                                {/* echarts图  */}
                                {type2 == 1 ? (
                                    <div><Chart options={mixData} type={2}/><br/></div>
                                    
                                ) : (
                                    ""
                                )}
                                {type3 == 1 ? (
                                    <div><Chart options={mixData} type={3}/><br/></div>
                                    
                                ) : (
                                    ""
                                )}    
                            </div>
                            
                        ) : (
                            ''
                        )}      
                    </Col>
                </Row>         
            </div>
        )
    }
}

export default App;