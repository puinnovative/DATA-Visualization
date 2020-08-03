var width = window.innerWidth,
    height = window.innerHeight;

    var projection = d3.geo.mercator().center([110, 20]) 
    .scale([8000]) 
    .translate([width/4,height])
    .precision([.1]);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)

var path = d3.geo.path()
    .projection(projection);
var color = d3.scale.linear().domain([1,20]).range(["yellow","red"]);

queue()
    .defer(d3.json, "gd.json") // mainland
    .defer(d3.json, "cities.json") // mainland
    .await(drawMap); // function that uses files

function drawMap(error,gd,cities) {
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(gd, gd.objects.gd).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", function(d) {
            return color(d.properties.childrenNum)
        })
        .attr("stroke", "black")
        .attr("stroke-width", "0.35");



        svg.append("g").selectAll("circle")
        .data(cities.features)
        .enter()
      .append("circle") 
        .attr("cx", function(d) {
                return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
        })
        .attr("cy", function(d) {
                return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
        })
        .attr("r", 3.5) 
       .style("fill", "black")

       svg.selectAll("text")
       .data(cities.features)
       .enter()
     .append("text") // append text
       .attr("x", function(d) {
            return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
       })
       .attr("y", function(d) {
        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
       })
       .attr("dy", -7) // set y position of bottom of text
      .style("fill", "black") // fill the text with the colour black
      .attr("text-anchor", "middle") // set anchor y justification
      .text(function(d) {return d.properties.name;}); // define the text to display
}