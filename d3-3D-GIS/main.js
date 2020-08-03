var width = window.innerWidth,
    height = window.innerHeight;


    var projection = d3.geo.orthographic()
    .scale(245)
    .translate([width/2, height/2])
    .precision(0.1)
    .rotate([52.8, -49.6])
    .clipAngle(90);

// scales for fading/sizing labels/points
var opacityScale = d3.scale.linear()
    .domain([200, 150])
    .range([1,0]);

var ptSizeScale = d3.scale.linear()
    .domain([500, 150])
    .range([12,7]);

var path = d3.geo.path().projection(projection).pointRadius(2);

var graticule = d3.geo.graticule();

d3.select(window)
    .on("mousemove", mouseMove)
    .on("mouseup", mouseUp);

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("mousedown", mouseDown)
    .call(d3.behavior.zoom()
        .translate(projection.translate())
        .scale(projection.scale())
        .scaleExtent([50,500])
        .on("zoom", function() {
            reZoom();
        })
    );
    
// queue for loading topojson and places data
queue()
    .defer(d3.json, "world-110m.json")
    .defer(d3.json, "world-places.json")
    .defer(d3.tsv, "world-country-names.tsv")
    .await(ready);

function ready(error, world, places, names,) {
    var countries = topojson.object(world, world.objects.countries).geometries;
    countries = countries.filter(function(d) {
      return names.some(function(n) {
        if (d.id == n.id) return d.name = n.name;
      });
    }).sort(function(a, b) {
      return a.name.localeCompare(b.name);
    })
    
    // shading def
    var globe_shading = svg.append("defs")
        .append("radialGradient")
        .attr("id", "globe_shading")
        .attr("cx", "50%")
        .attr("cy", "40%");
    globe_shading.append("stop")
        .attr("offset","50%")
        .attr("stop-color", "#fff")
        .attr("stop-opacity","0.2");
    globe_shading.append("stop")
        .attr("offset","100%")
        .attr("stop-color", "#253d56")
        .attr("stop-opacity","0.4");

    // water sphere
    svg.append("path")
        .datum({type: "Sphere"})
        .attr("class", "water noclick")
        .attr("d", path);
    
    // graticule
    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule noclick")
        .attr("d", path);

    // land shape
    svg.append("path")
        .datum(topojson.object(world, world.objects.land))
        .attr("class", "land noclick")
        .attr("d", path);

    // shading sphere
    svg.append("path")
        .datum({type: "Sphere"})
        .attr("class","noclick")
        .style("fill", "url(#globe_shading)");
        
    // country shapes    
    svg.append("g").attr("class", "countries")
        .selectAll("path")
        .data(countries)
        .enter().append("path")
        .attr("class", "countries")
        .attr("d", path)
        .on("click", function(d) {
            console.log(d);
        }); 

    // place points
    svg.append("g").attr("class","points noclick")
        .selectAll("text")
        .data(places.features)
        .enter().append("path")
        .attr("fill", (d) => {
            switch (d.properties.labelrank) {
                case 9:
                    return "cyan"
                    break;
                case 10:
                    return "blue"
                    break;      
                case 1:
                        return "green"
                        break;     
                case 8:
                        return "yellow"
                        break;   
                case 7:
                        return "red"
                        break;   
                case 2:
                        return "white"
                        break; 
                default:
                    return "black"
                    break;
            }
        })
        .attr("d", path);

    // place labels
    svg.append("g").attr("class","labels noclick")
        .selectAll("text")
        .data(places.features)
        .enter().append("text")
        .attr("class", "label")
        .text(function(d) { 
            return d.properties.name;
        });
    reDraw();

}

function positionLabels() {

    var centerPos = projection.invert([width/2,height/2]);
    var arc = d3.geo.greatArc();
    var s = projection.scale();
    
    // labels
    svg.selectAll(".label")
        .attr("text-anchor",function(d) {
            var x = projection(d.geometry.coordinates)[0];
            if (x < (width/2) - 20) {
                return "end"; 
            } else if (x < (width/2) + 20) {
                return "middle";
            } else {
                return "start";
            }
        })
        .attr("transform", function(d) {
            var loc = projection(d.geometry.coordinates),
            x = loc[0],
            y = loc[1],
            xoffset = 6,
            yoffset = -3;
            if (x < width/2) {
                xoffset = -6;
            }
            if (x < (width/2) - 20) {
                yoffset = -1;
            } else if (x < (width/2) + 20) {
                yoffset = -6;
            } else {
                yoffset = -1;
            }
            return "translate(" + (x + xoffset) + "," + (y + yoffset) + ")";
    })
    .style("opacity", function() {
        return opacityScale(s);
    })
    .style("font-size", function() {
        return ptSizeScale(s);
    })
    .style("display",function(d) {
        var dist = arc.distance({source: d.geometry.coordinates, target: centerPos});
        if (dist > 1.57) {
            return 'none';
        } else {
            return 'inline';
        }
    });

    // points
    svg.selectAll(".point")
    .style("opacity", function() {
        return opacityScale(s);
    });
    
}

function reDraw() {
    svg.selectAll("path").attr("d", path);
    positionLabels();
    // console.log("Map center: ", -projection.rotate()[1], -projection.rotate()[0]);
}

function reZoom() {
    if (d3.event) { projection.scale(d3.event.scale); }
    svg.selectAll("*").attr("d", path);
    positionLabels();
    // console.log("Map scale: ", d3.event.scale);
}

// window mousemove
function mouseMove() {
    if (m0) {
        // limit vertical rotation between 55 & -55
        var m1 = [d3.event.pageX, d3.event.pageY],
        o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
        if (o1[1] > 55) {
            o1[1] = 55;
        }
        if (o1[1] < -55) {
            o1[1] = -55;
        }
        projection.rotate(o1);
        reDraw();
    }
}

// window mouseup
function mouseUp() {
    if (m0) {
        mouseMove();
        m0 = null;
    }
}

// svg mousedown
var m0, o0;
function mouseDown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = projection.rotate();
    d3.event.preventDefault();
}
queue()
    .defer(d3.json, "company-data.json")
    .defer(d3.json, "person-data.json")
    .await(read);
function read(error, companys, persons) {
    if (error) throw error;
    svg.append("g").attr("class","points noclick")
        .selectAll("text")
        .data(companys.features)
        .enter().append("path")
        .attr("fill", (d) => {
            switch (d.properties.labelrank) {
                case 9:
                    return "cyan"
                    break;
                case 10:
                    return "blue"
                    break;      
                case 1:
                        return "green"
                        break;     
                case 8:
                        return "yellow"
                        break;   
                case 7:
                        return "red"
                        break;   
                case 2:
                        return "white"
                        break; 
                default:
                    return "black"
                    break;
            }
        })
        .attr("d", path);

    svg.append("g").attr("class","labels noclick")
        .selectAll("text")
        .data(companys.features)
        .enter().append("text")
        .attr("class", "label")
        .text(function(d) { 
            return d.properties.name;
    });

    svg.append("g").attr("class","points noclick")
        .selectAll("text")
        .data(persons.features)
        .enter().append("path")
        .attr("fill", (d) => {
            switch (d.properties.labelrank) {
                case 100:
                    return "#ffd700"
                    break;    
                default:
                    break;
            }
        })
        .attr("d", path);


svg.append("g").attr("class","labels noclick")
    .selectAll("text")
    .data(persons.features)
    .enter().append("text")
    .attr("class", "label")
    .text(function(d) { 
            return d.properties.name;
    });
  };

  
