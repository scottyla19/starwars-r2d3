
var margin = { top: 20, right: 20, bottom: 20, left: 50 };
width = width - margin.left - margin.right
height = height - margin.top - margin.bottom;
svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "black");


var xScale = d3.scaleOrdinal()
    .domain(d3.extent(data, function(d){return d.classification}))
    .range([width/8, width/4, 3*width/8, width/2,5*width/8, 3*width/4, 7*width/8]);

var sizeScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){return d.height})])
    .range([4,20]);
    
var colorScale = d3.scaleOrdinal()
    .domain(d3.extent(data, function(d){return d.classification}))
    .range(["#456447","white","#A0522D","#21D7BF", "#caccce", "#9400D3", "#dbdc6e"]);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);



var group = svg.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + height/2 + ")")
  
          var simulation = d3.forceSimulation(data)
          .force('charge', d3.forceManyBody().strength(5))
          .force('x', d3.forceX().x(function(d) {
            return xScale(d.classification);
          }))
          
          .force('collision', d3.forceCollide().radius(function(d) {
            return sizeScale(d.height)
          }))
          .on('tick', ticked);

function ticked() {
    var u = group
        .selectAll('circle')
        .data(data);

    u.enter()
        .append('circle')
        .attr('r', function(d) {
        return sizeScale(d.height)
        })
        .style('fill', function(d) {
            
        return colorScale(d.classification);
        }).attr("d", function(d) { return d.person; })
        .on("mouseover", function(d) {
         div.transition()
           .duration(200)
           .style("opacity", .9);
         div.html(d.person + "<br/> Classification: "+ d.classification + "<br/> height: "+ d.height)
           .style("left", (d3.event.pageX+20) + "px")
           .style("top", (d3.event.pageY - 28) + "px");
         })
       .on("mouseout", function(d) {
         div.transition()
           .duration(500)
           .style("opacity", 0);
         }).on("click", function(){
          
        Shiny.setInputValue(
          "People", 
          d3.select(this).attr("d"),
          {priority: "event"}
          );
      })
        .merge(u)
        .attr('cx', function(d) {
        return d.x;
        })
        .attr('cy', function(d) {
        return d.y;
        })

    u.exit().remove();
}
// var points = group.selectAll('circle')
//     .data(data)
//     .enter()
//       .append('circle')
//       .attr('cx', function(d) { return x(d.mass) })
//       .attr('cy', function(d) { return  y(d.height)})
//       .attr('r', 5)
//       .attr('fill', function(d) { return z(d.gender)})
//       .attr('stroke', function(d) {  if (d.gender === "hermaphrodite") {return "#7901ab"} else { return z(d.gender)}})
//       .attr("d", function(d) { return d.person; })
//       .on("mouseover", function(d) {
//        div.transition()
//          .duration(200)
//          .style("opacity", .9);
//        div.html(d.person + "<br/> Weight: "+ d.mass + "<br/> height: "+ d.height)
//          .style("left", (d3.event.pageX+20) + "px")
//          .style("top", (d3.event.pageY - 28) + "px");
//        })
//      .on("mouseout", function(d) {
//        div.transition()
//          .duration(500)
//          .style("opacity", 0);
//        }).on("click", function(){
//          
//       Shiny.setInputValue(
//         "People", 
//         d3.select(this).attr("d"),
//         {priority: "event"}
//         );
//     });


    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", margin.top)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .style("fill", "white")
        .text("Classification Clusters");

