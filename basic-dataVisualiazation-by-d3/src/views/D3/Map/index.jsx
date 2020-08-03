import React, { Component } from "react";
import data from '../../../../assets/data/map.json'
import * as d3 from 'd3'

class Map extends Component {
  constructor() {
    super();
    this.state = {
      id: "map"
    }
  }
  componentDidMount() {
    this.initPaiting(data)
  }
  initPaiting(data) {
    var width = 900;
    var height = 600;
    var projection = d3.geoAlbers();
    var mexico = void 0;
    var geoID = function (d) {
        return "c" + d.properties.OBJECTID_1
    }
    var click = function (d) {
        d3.selectAll("path").attr("fill-opacity",0.2)
        d3.select("#"+geoID(d)).attr("fill-opacity",1)
    }
    var path = d3.geoPath().projection(projection);
    var svg = d3.select("#map").append("svg").attr("width",width).attr("height",height)
   projection.scale(1).translate([0,0])
   var b = path.bounds(data)
   var s = 0.95/Math.max((b[1][0]-b[0][0])/width,(b[1][1]-b[0][1])/height)
   var t = [(width-s*(b[1][0]+b[0][0]))/2,(height-s*(b[1][1]+b[0][1]))/2]
   
   projection.scale(s).translate(t)
   var map = svg.append("g").attr("class","boundary")
   mexico = map.selectAll("path").data(data.features)
   var color = d3.scaleLinear().domain([0,33]).range(['green','blue'])
   mexico.enter().append("path").attr("d",path)
   .attr("id",geoID).on("click",click)
   .attr("stroke","black").attr("fill",function(d,i){
       return color(i)
   })
   

   let cities = [{
       name: "cancun",
       lat: 21.1606,
       lon: -88.8475,
       tequila: 15
   },{
       name: "mexicocity",
       lat: 19.4333,
       lon: -99.1333,
       tequila: 49
   },{
       name: "monterrey",
       lat: 25.6667,
       lon: -100.3000,
       tequila: 70
   },{
       name: "hermosillo",
       lat: 29.0989,
       lon: -110.9542,
       tequila: 80
   }]
   var citiesPoint = svg.selectAll("circle").data(cities)
   var cityText = svg.selectAll("text").data(cities)
   
   
   
   cityText.enter().append("text").attr("x",function(d){
       return projection([d.lon,d.lat])[0]
   }).attr("y",function(d){
       return projection([d.lon,d.lat])[1]
   }).attr("dx",5).attr("dy",3).text(function(d){
       return d.name
   }).attr("fill","white")
   
   var radius = d3.scaleLinear().domain([0,100]).range([5,30])
   
   citiesPoint.enter().append("circle").attr("cx",function(d){
       return projection([d.lon,d.lat])[0]
   }).attr("cy",function(d){
       return projection([d.lon,d.lat])[1]
   }).attr("r",d => radius(d.tequila))
   .attr("fill","white")
   
   
  }
  
  render() {
    return (
        <div id="map"></div>
    )
  }
}

export default Map;