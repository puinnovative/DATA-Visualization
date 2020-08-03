from flask import Flask, render_template, request
from flask_cors import CORS
import numpy as np
import pandas as pd
import json

app = Flask(__name__)

#解决跨域
CORS(app, supports_credentials=True)


#定义上传接口
@app.route('/transData',methods=['POST'])
def trans_data():

    f = request.files['file']
    f.save('data.csv')
    df=pd.read_csv('data.csv',sep=',')

    #添加月份一栏
    df['DATE'] = pd.to_datetime(df['DATE']) 
    df['MONTH'] = df['DATE'].apply(lambda x: x.strftime('%m'))

    #制作月份-类型-数量图
    group = {}
    for x in range(12): 
        x = x + 1
        if x < 10:
            i = '0' + str(x)
            
        else:
            i = str(x)
        buf = df[['MONTH','TYPE']].loc[df['MONTH'] == i]['TYPE'].value_counts(dropna=False).to_json(orient = "split")
        group[x] = json.loads(buf)

    #制作月份-总额图 
    group2 = df[['COUNT','TOTAL']].groupby(df['MONTH']).sum().to_json(orient = "split")

    #制作车名-总额-总数图
    group3 = df[['COUNT','TOTAL']].groupby(df['NAME']).sum().to_json(orient = "split")

    #制作透析表数据
    group5 = df[['COUNT','PRICE','TYPE','NAME','BRAND','MONTH']].to_json(orient = "split")
    

    #结果整理
    res = {
        1: group,
        2: json.loads(group2),
        3: json.loads(group3),
        4: json.loads(df[['TOTAL']].sum().to_json(orient = "split")),
        5: json.loads(group5)
    }

    #返回结果
    return res

#主程序
if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)