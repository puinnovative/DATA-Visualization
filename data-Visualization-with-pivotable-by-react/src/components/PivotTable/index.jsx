import React from 'react';
import { PivotViewComponent, FieldList, Inject, GroupingBar } from '@syncfusion/ej2-react-pivotview';

class PivotTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "PivotTable",
            editSettings: {
                allowAdding: true, 
                allowDeleting: true, 
                allowEditing: true, 
                mode: 'Normal'
            },
            dataSourceSettings: {
                columns: [{ name: 'MONTH'}],
                values: [{ name: 'PRICE'}, { name: 'COUNT'}],
                rows: [{ name: 'BRAND'}, { name: 'TYPE'}, { name: 'NAME'}],
                formatSettings: [{ name: 'PRICE', format: '$'}],
                dataSource: [],
                expandAll: false,
                filters: [],
                showGrandTotals: false,
                showSubTotals: false
            }
        }
    }
    init() {
        const { dataSource } = this.props;
        const { dataSourceSettings } = this.state;

        //透析表配置
        let source = [];
        for(let i = 0; i < dataSource[5].data.length; i ++){
            let obj = {};
            for(let j = 0; j < dataSource[5].columns.length; j ++){
                obj[dataSource[5].columns[j]] = dataSource[5].data[i][j];
            }
            source.push(obj);   
        }
        dataSourceSettings.dataSource = source;

        this.setState({
            dataSourceSettings: dataSourceSettings
        });
    }
    componentDidMount() {
        this.init();
    }
    render() {
        const { editSettings, dataSourceSettings } = this.state;
        return (
            <div>
                {dataSourceSettings.dataSource.length != 0 ? (
                    <PivotViewComponent 
                    id='pivotView' 
                    height={650} 
                    dataSourceSettings={dataSourceSettings}
                    editSettings={editSettings}
                    showFieldList={true}
                    showGroupingBar={true}
                    >
                        <Inject services={[FieldList, GroupingBar]}/>
                    </PivotViewComponent>
                ) : (
                    ""
                )}
                
            </div>
        )
    }
}

export default PivotTable;