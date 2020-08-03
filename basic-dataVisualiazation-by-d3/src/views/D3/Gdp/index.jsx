import React, { Component } from "react";
import datz from '../../../../assets/data/rankingGdp.json'
import * as d3 from 'd3'
var _ = require('lodash');

class Gdp extends Component {
  constructor() {
    super();
    this.state = {
      id: "d3"
    }
    this.handleData = this.handleData.bind(this);
    this.initPaiting = this.initPaiting.bind(this)
    this.update = this.update.bind(this);
  }
  componentDidMount() {
    let data = _.cloneDeep(datz)
    this.handleData(data)
  }
  handleData(data) {
    data.forEach(d => {
      d.population = d.population * 1000;
      d.gdp == null ? d.gdp = 0 : d.gdp = d.gdp * d.population;
    });
    let newData = data.filter( (d) => {
      return d.gdp != 0
    })
    newData.forEach( d => {
      d.population = d.population * 1000
    });
    let countrySet = Array.from(new Set(newData.map(d => d.country)))
    newData.forEach(d => {
        countrySet.find((d1, i1) => {
            if(d1 == d.country) {
                d.id = i1
            }
        })
    })
    let timeLine = Array.from(new Set(newData.map(d => d.year))).sort()
    for(let i = 0;i < timeLine.length;i++) {
        let singleEverySet = newData.filter(d => {
            return d.year == timeLine[i]
        })
    
        let countryWithGdp = singleEverySet.map(d => {
            return [d.country, d.gdp, d.id]
        })
        timeLine[i] = [timeLine[i],countryWithGdp]
    }
    for(let j = 0;j < timeLine.length;j++) {
        let yearGdpSort = Array.from(timeLine[j][1])
        yearGdpSort.sort((a, b) => {
            return (b[1] - a[1])
        })
        timeLine[j][1] = yearGdpSort.slice(0,10)
        timeLine[j][1].forEach((d, i) => {
            timeLine[j][1][i][3] = i
        })
    }
    timeLine.shift()
    timeLine.shift()
    timeLine.shift()
    
    this.initPaiting(timeLine)
  }
  initPaiting(timeLine) {
    const testData = timeLine.slice(16, 66)
    const svg = d3.select("#svg").attr("viewBox", [0, 0, 1200, 500]).attr("transform",`translate(50,10)`)
    const xScale = d3.scaleLog().domain([testData[0][1][9][1],17255477340000]).range([100,1200])
    const yScale = d3.scaleBand().domain(testData[0][1].map(d => d[0])).range([0,500]).padding(0.2)
    const colorScale = d3.scaleLinear().domain([0, 169]).range(['skyblue','red'])
    const ySort = d3.scaleLinear().domain(testData[0][1].map(d => d[3])).range([0, 50])

    const yAxis = d3.axisLeft(yScale)//.tickPadding(20).tickSize(-960)
    const g = svg.append("g").call(yAxis)

    g.attr("transform",`translate(120,0)`).selectAll('.domain').remove() 
    g.attr("opacity",1).transition().duration(1000).attr("opacity",0)

    svg.selectAll("rect").data(testData[0][1]).join("rect")
            .attr("height", yScale.bandwidth())
            .attr("fill", d => colorScale(d[2]))
            .attr("y", d => ySort(d[3]))
            .attr("width", d => xScale(d[1]))
    this.update(testData, 1, svg)
  }

  update(datx, count, svg) {  
    const that = this;
      let data = _.cloneDeep(datx)
      if(count < 50 ) {
          const xScale = d3.scaleLog().domain([data[0][1][9][1],17255477340000]).range([100,1200])
          const yScale = d3.scaleBand().domain(data[count][1].map(d => d[0])).range([0,500]).padding(0.2)
          const colorScale = d3.scaleLinear().domain([0, 169]).range(['skyblue','red'])
          const ySort = d3.scaleLinear().domain(data[0][1].map(d => d[3])).range([0, 50])

          const yAxis = d3.axisLeft(yScale)
          const g = svg.append("g").call(yAxis)

          g.attr("transform",`translate(120,0)`)
          g.attr("opacity",1).transition().duration(1000).attr("opacity",0).selectAll('.domain').remove() 

          let preCountryGroup = data[count-1][1].map(d => d[0])
          let lastCountryGroup = data[count][1].map(d => d[[0]])

          let sameCountryCount = 0
          let needData;
          let addData = []

          preCountryGroup.forEach((d, i) => {
              lastCountryGroup.forEach((d2, i2) => {
                  if(d == d2){
                      sameCountryCount = sameCountryCount + 1
                      
                  }
              })
          })
          
          data[count-1][1].forEach((d, i) => {
              data[count][1].forEach((d3, i3) => {
                  if(d[2] == d3[2]) {  
                      d[4] = d3[3]
                      d[5] = d3[1]
                  }
              })
          })
          data[count-1][1].forEach((d, i) => {
              if(d[4] == undefined) {
                  d[4] = 12
                  d[5] = d[1]
              }
          })

          data[count][1].forEach(d => {
              data[count-1][1].forEach(d3 => {
                  if(d[2] == d3[2]) {  
                      d[4] = 88               
                  }
              })
          })
          data[count][1].forEach((d, i) => {
              if(d[4] == undefined) {
                  let nowRank = d[3]   
                  data[count][1][i][3] = 12
                  data[count][1][i][4] = nowRank
                  data[count][1][i][5] = data[count][1][i][1]
              }
          })    
        
          for(let i = 0;i < 10;i++) {
              if(data[count][1][i][4] != 88){
                  addData.push(data[count][1][i])
              }
          }
          
          needData = [data[count][0], data[count-1][1].concat(addData)]   

          svg.selectAll("rect")
          .data(needData[1]).join("rect")
          .attr("y", d => ySort(d[3]))
          .attr("height", yScale.bandwidth())
          .attr("width", (d, i) => {
              return xScale(d[1])
          })  
          .attr("fill", d => colorScale(d[2]))
          .transition().duration(1000).ease(d3.easeLinear)
          .attr("y", d => ySort(d[4]))
          .attr("width", (d,i) => {
              return xScale(d[5])
          })  
          .on("end", function(){that.update(datx, count + 1, svg)})
        }    
  }
  
  render() {
    return (
        <svg id="svg">
        </svg>
    )
  }
}

export default Gdp;