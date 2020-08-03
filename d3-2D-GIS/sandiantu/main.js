var width = window.innerWidth,
    height = window.innerHeight;

    var projection = d3.geo.mercator().center([40, 20]) 
    .scale([250]) 
    .translate([1400,600])
    .precision([.1]);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)

var path = d3.geo.path()
    .projection(projection);

queue()
    .defer(d3.json, "world.json") // mainland
    .defer(d3.json, "cities.json") // mainland
    .await(drawMap); // function that uses files

function drawMap(error,world,cities) {
    console.log(world)
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "0.35");


    svg.append("g").selectAll("circle")
        .data(cities)
        .enter()
      .append("circle") 
        .attr("cx", function(d) {
                return projection([d.lng, d.lat])[0];
        })
        .attr("cy", function(d) {
                return projection([d.lng, d.lat])[1];
        })
        .attr("r", 1) 
       .style("fill", "yellow")
       .attr("opacity",0.1)

}