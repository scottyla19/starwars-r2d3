var margin = { top: 20, right: 20, bottom: 20, left: 50 };
width = width - margin.left - margin.right
height = height - margin.top - margin.bottom;

svg.style("fill","black")
svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "black");
var x = d3.scaleLinear()
    .domain([0,d3.max(data, function(d) { return d.diameter; })])
    .range([0,150]);
    
var nodes = [{name:data[0].planet}]
var links = []
data.forEach(function(d) {
  nodes.push({name:d.person})
});
console.log(data[0].planet)
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


var simulation = d3.forceSimulation(data)
  .force('charge', d3.forceManyBody().strength(.5))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide().radius(function(d) {
    return x(d.diameter/2)
  }))
  .on('tick', ticked);

    
function ticked() {
  
  var u = svg
    .selectAll('circle')
    .data(data)

  u.enter()
    .append('circle')
    .attr('r', function(d){ return x(d.diameter/2)})
    //.attr('fill', 'blue')
    .attr('fill', function(d) { return d.color})
    .merge(u)
    .attr("d", function(d) { return d.name; })
    .attr('cx', function(d) {
      return d.x
    })
    .attr('cy', function(d) {
      return d.y
    }).on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .9);
       div.html(d.name) //+ "<br/> Weight: "+ d.mass + "<br/> height: "+ d.height)
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       })

  u.exit().remove()
}


 svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", margin.top)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .style("fill", "white")
        .text("Known Residents");