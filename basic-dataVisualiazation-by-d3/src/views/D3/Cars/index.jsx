import React, { Component } from "react";
import data from '../../../../assets/data/cars.json'
import * as d3 from 'd3'

class Cars extends Component {
  constructor() {
    super();
    this.state = {
      id: "cars"
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
    const g = d3.select("#svg2").attr("viewBox", [0, 0, 1200, 500]).append("g").attr("fill","steelblue").attr("transform",`translate(${margin.left},${margin.top})`)
    
    
    const xScale = d3.scaleLinear().domain(d3.extent(data,d => d.weight)).range([0,960]).nice()
    const yScale = d3.scaleLinear().domain(d3.extent(data,d => d.acceleration)).range([0,420]).nice()

    const xAxis = d3.axisBottom(xScale).tickPadding(15).tickSize(-430)
    const yAxis = d3.axisLeft(yScale).tickPadding(20).tickSize(-960)
    
    const labelX = "weight"
    const labelY = "acc"
    
    g.append("g").call(xAxis).attr("transform",`translate(0,420)`).selectAll('.domain')	
    .remove(); 
    g.append("g").call(yAxis).attr("transform",`translate(0,0)`).selectAll('.domain')	
    .remove(); 
    
    const xLabel= g.append('g')
    .call(xAxis);
    xLabel.append('text')
            .attr('class','axis-label')
            .attr('y',465)
            .attr('x',480) 
            .attr('text-anchor','middle')
            .attr('fill','#b4b4af')
            //.attr('transform','rotate(-90)')
            .text(labelX);

    const yLabel= g.append('g')
    .call(yAxis);
    yLabel.append('text')
            .attr('class','axis-label')
            .attr('y',-50)
            .attr('x',-140) 
            .attr('text-anchor','middle')
            .attr('fill','#b4b4af')
            .attr('transform','rotate(-90)')
            .text(labelY);

    g
    .selectAll("circle")
    .data(data)
    .join("circle")
        .attr("cy",d => yScale(d.acceleration))
        .attr("cx",d => xScale(d.weight))
        .attr("r",7)
        .attr("opacity",0.3)
        .attr("fill","red")
  }
  
  render() {
    return (
        <svg id="svg2">
        </svg>
    )
  }
}

export default Cars ;