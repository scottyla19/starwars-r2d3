var margin = { top: 20, right: 20, bottom: 20, left: 50 };
width = width - margin.left - margin.right
height = height - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .domain([0,100000])
    .range([5,150]);
/*width = 600
height = 400*/
svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "black");
//Container for the gradient
var defs = svg.append("defs");
//Append a linear horizontal gradient
var linearGradient = defs.append("linearGradient")
    .attr("id","animate-gradient") //unique id for reference
    .attr("x1","0%")
    .attr("y1","0%")
    .attr("x2","100%")
    .attr("y2","0")
  
svg.selectAll("circle").remove()

    
    
var orbit = svg.append("ellipse")
    .attr("cx", width/2 )
    .attr("cy", height/2)
    .attr("rx", 250)
    .attr("ry", 100)
    //.attr("transform", "rotate(-10)")
    .style("fill","none")
    .style("stroke","red")
    
 var planet = svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr("transform", "translate(100,150 )")
    .attr('r', function(d){ return x(d.diameter/2)})
    .attr('fill', function(d) { return d.color})
    


function transition() {
  planet.transition()
      .duration(function(d) { return d.orbital_period*10})
      .ease(d3.easeLinear)
      .attrTween("transform", translateAlong(orbit.node()))
      .on("end", transition);
}

function transitionNight(){
  planet.transition().style("fill", "black").duration(function(d) { return d.rotation_period*10}).on("end", transitionDay)
  
}

function transitionDay(){
  planet.transition().style("fill", "black").duration(function(d) { return d.rotation_period*10}).on("end", transitionNight)
  
}

transition();
//transitionNight();

// Returns an attrTween for translating along the specified path element.
function translateAlong(path) {
  var l = path.getTotalLength();
  return function(d, i, a) {
    return function(t) {
      
      var p = path.getPointAtLength(t * l);
      return "translate(" + (p.x ) + "," + (p.y )+ ")";
    };
  };
}


 svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", margin.top)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .style("fill", "white")
        .text("Orbit");