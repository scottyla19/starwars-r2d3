var x = d3.scaleLinear()
    .domain([0,100000])
    .range([0,200]);
width = 600
height = 400
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

    
 var planet = svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr("cx",width/2)
    .attr("cy", height/2)
    .attr('r', function(d){ return x(d.diameter/2)})
    .attr('fill', function(d) { return d.color})
    


function transitionNight(){
  planet.transition().style("fill", "black").duration(function(d) { return d.rotation_period*10}).on("end", transitionDay)
  
}

function transitionDay(){
  planet.transition().style("fill", function(d) { return d.color}).duration(function(d) { return d.rotation_period*10}).on("end", transitionNight)
  
}

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