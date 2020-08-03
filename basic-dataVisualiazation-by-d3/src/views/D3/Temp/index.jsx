import React, { Component } from "react";
import data from '../../../../assets/data/temp.json'
import { 
    select,
    line,
    area,
    scaleLinear,
    extent,
    max,
    min,
    axisLeft,
    axisBottom,
    format,
    curveBasis,
    scaleTime
} from 'd3'

class Temp extends Component {
  constructor() {
    super();
    this.state = {
      id: "temperature"
    }
  }
  componentDidMount() {
    this.initPaiting(data)
  }
  initPaiting(data) {
    const margin = {
        left: 100,
        right: 20,
        top: 10,
        bottom: 20
    }
    const g = select("#svg3").attr("viewBox", [0, 0, 1200, 500]).append("g").attr("fill","red").attr("transform",`translate(${margin.left},${margin.top})`)
    
    const xScale = scaleTime().domain(extent(data,d => new Date(d.day))).range([0,960]).nice()
    const yScale = scaleLinear().domain([max(data, d => d.temperature),min(data, d => d.temperature)]).range([0,420]).nice()
    const xAxis = axisBottom(xScale).tickPadding(15).tickSize(-430)
    const yAxis = axisLeft(yScale).tickPadding(20).tickSize(-960)
    
    
    g.append("g").call(xAxis).attr("transform",`translate(0,420)`).selectAll('.domain')	
    .remove(); 
    g.append("g").call(yAxis).attr("transform",`translate(0,0)`).selectAll('.domain')	
    .remove(); 
    
    const areaGenerator = area()
            .x( d => xScale(new Date(d.day)))
            .y0( d => 418)
            .y1(d => yScale(d.temperature))
            .curve(curveBasis)
    
    g.append('path')
        .attr('class', 'line-path')
        .attr('d', areaGenerator(data))
        
    g.append('text')
            .attr('class','axis-label')
            .attr('y',465)
            .attr('x',480) 
            .attr('text-anchor','middle')
            .attr('fill','#b4b4af')
            .text("time");
            
    const yLabel= g.append('g')
    .call(yAxis);
    yLabel.append('text')
            .attr('class','axis-label')
            .attr('y',-50)
            .attr('x',-140) 
            .attr('text-anchor','middle')
            .attr('fill','#b4b4af')
            .attr('transform','rotate(-90)')
            .text("temperature");
  }
  
  render() {
    return (
        <svg id="svg3">
        </svg>
    )
  }
}

export default Temp;