
var barHeight = Math.floor(height / data.length);
var margin = { top: 20, right: 20, bottom: 20, left: 50 };
width = width - margin.left - margin.right
height = height - margin.top - margin.bottom;

/*var bars = svg.selectAll('rect')
    .data(data);
    
bars.enter()
    .append('rect')
      .attr('width', function(d) { return d * width; })
      .attr('height', barHeight)
      .attr('y', function(d, i) { return i * barHeight; })
      .attr('fill', 'steelblue');

bars.exit().remove();

bars.transition()
  .duration(100)
  .attr("width", function(d) { return d * width; });*/

/*var ex = d3.extent(data);


var y = d3.scaleLinear()
    .domain(ex)
    .range([height/2,0]);
    
var points = svg.selectAll('circle')
    .data(data);

points.enter()
    .append('circle')
      .attr('cx', width/2)
      .attr('cy', height/2)
      .attr('r', function(d) { return y(d)})
      .attr('fill', 'steelblue');*/
      
/*data.forEach(function(d) {
  
  data.mass = +d.mass;
  data.height = +d.height;
  
});
*/
var c20 = d3.schemeCategory20

var x = d3.scaleLinear()
    .domain([0,d3.max(data, function(d) { return d.mass; })])
    .range([0,width]);

var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){return d.height})])
    .range([height,0]);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

svg.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)


var group = svg.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.bottom + ")");
          
group.selectAll('circle')
    .data(data)
    .enter()
      .append('circle')
      .attr('cx', function(d) { return x(d.mass) })
      .attr('cy', function(d) { return  y(d.height)})
      .attr('r', 5)
      .attr('fill', function(d) { return d.skin_color})
      .attr("d", function(d) { return d.name; })
      .on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .9);
       div.html(d.name + "<br/> Weight: "+ d.mass + "<br/> height: "+ d.height)
         .style("left", (d3.event.pageX) + "px")
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
    });
      
 group.append("g")
    .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  group.append("g")
      .call(d3.axisLeft(y));



