import React, { Component } from "react";
import data from '../../../../assets/data/line.json'
import * as d3 from 'd3'
var _ = require('lodash');

class Line extends Component {
  constructor() {
    super();
    this.state = {
      id: "line"
    }
  }
  componentDidMount() {
      
    this.handleData(data)
  }
  handleData(data) {
    data.x = "Miles per person per year";
    data.y = "Cost per gallon";
    this.initPaiting(data)
  }
  halo(text) {
      //添加到节点，并且设置一些样式
    text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 4)
        .attr("stroke-linejoin", "round");
    }
    length(path) {
        return d3.create("svg:path").attr("d", path).node().getTotalLength();
    }
  initPaiting(data) {
      const that = this;
    let width = 800
    let height = 420
    let margin = ({top: 20, right: 30, bottom: 30, left: 40})
    
    let svg = d3.select("#svg5").attr("viewBox", [0, 0, width, height]);

    //设置x轴范围
    let x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.x)).nice()
        .range([margin.left, width - margin.right])
    
    //设置y轴范围
    let y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.y)).nice()
        .range([height - margin.bottom, margin.top])
    
    //设置X轴
    let xAxis = g => g
        //移一下
        .attr("transform", `translate(0,${height - margin.bottom})`)
        //设置xz坐标的样式
        .call(d3.axisBottom(x).ticks(width / 80))
        //去掉一些线
        .call(g => g.select(".domain").remove())
        //添加一些线
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", -height)
            .attr("stroke-opacity", 0.1))
        //添加一些文本
        .call(g => g.append("text")
            .attr("x", width - 4)
            .attr("y", -4)
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("fill", "black")
            .text(data.x)
            .call(this.halo))
    
    //设置Y轴
    let yAxis = g => g
        //位置移动以下
        .attr("transform", `translate(${margin.left},0)`)
        //设置y轴的样式
        .call(d3.axisLeft(y).ticks(null, "$.2f"))
        //去掉一些线
        .call(g => g.select(".domain").remove())
        //添加一些线
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width)
            .attr("stroke-opacity", 0.1))
        //添加一些标价
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 4)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text(data.y)
            .call(this.halo))
    
    //将x轴添加到svg元素上
    svg.append("g")
        .call(xAxis);
    
    //将y轴添加到svg元素上
    svg.append("g")
        .call(yAxis);
    
    let line = d3.line().curve(d3.curveCatmullRom)
        .x(d => x(d.x))
        .y(d => y(d.y))

    const l = this.length(line(data));
    
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", `0,${l}`)
        .attr("d", line)
        .transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attr("stroke-dasharray", `${l},${l}`);
    
    svg.append("g")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.x))
        .attr("cy", d => y(d.y))
        .attr("r", 3);
    
    const label = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        //绑定数据
        .selectAll("g")
        .data(data)
        .join("g")
        //做移动
        .attr("transform", d => `translate(${x(d.x)},${y(d.y)})`)
        .attr("opacity", 0);
    
    label.append("text")
        .text(d => d.name)
        .each(function(d) {
            const t = d3.select(this);
            switch (d.orient) {
            case "top": t.attr("text-anchor", "middle").attr("dy", "-0.7em"); break;
            case "right": t.attr("dx", "0.5em").attr("dy", "0.32em").attr("text-anchor", "start"); break;
            case "bottom": t.attr("text-anchor", "middle").attr("dy", "1.4em"); break;
            case "left": t.attr("dx", "-0.5em").attr("dy", "0.32em").attr("text-anchor", "end"); break;
            }
        })
        .call(that.halo);
    
    label.transition()
        .delay((d, i) => this.length(line(data.slice(0, i + 1))) / l * (5000 - 125))
        .attr("opacity", 1);
  }
  
  render() {
    return (
        <svg id="svg5">
        </svg>
    )
  }
}

export default Line ;