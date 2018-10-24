
var margin = { top: 20, right: 20, bottom: 20, left: 50 };
width = width - margin.left - margin.right
height = height - margin.top - margin.bottom;
svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "black");


var x = d3.scaleLinear()
    .domain([0,d3.max(data, function(d) { return d.mass; })])
    .range([0,width]);

var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){return d.height})])
    .range([height,0]);
    
var z = d3.scaleOrdinal()
    .domain(d3.extent(data, function(d){return d.gender}))
    .range(["#d5d5d5","#89cff0","#f4c2c2","#ffd900"]);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    
/*var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);*/
/*
var zoom = d3.zoom()
    .scaleExtent([.5, 20])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomFunction);*/

/*svg.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("fill", "none")
   // .call(zoom);*/


var group = svg.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.bottom + ")")
  


// Inner Drawing Space
/*var innerSpace = svg.append("g")
    .attr("class", "inner_space")
    .style("fill", "none")
    .style("pointer-events", "zoom")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);*/
     
// Draw Axis
/*var gX = svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate("+margin.left +"," + height + ")")
    .call(xAxis);

var gY = svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis);*/

// append zoom area
/*var view = svg.append("rect")
  .attr("class", "zoom")
  .attr("width", width)
  .attr("height", height)
  .call(zoom)*/

function zoomFunction(){
  // create new scale ojects based on event
  var new_xScale = d3.event.transform.rescaleX(x)
  var new_yScale = d3.event.transform.rescaleY(y)
  

  // update axes
  gX.call(xAxis.scale(new_xScale));
  gY.call(yAxis.scale(new_yScale));

  // update circle
  points.data(data)
     .attr('cx', function(d) {return new_xScale(d.mass)})
     .attr('cy', function(d) {return new_yScale(d.height)});
}

var points = group.selectAll('circle')
    .data(data)
    .enter()
      .append('circle')
      .attr('cx', function(d) { return x(d.mass) })
      .attr('cy', function(d) { return  y(d.height)})
      .attr('r', 5)
      .attr('fill', function(d) { return z(d.gender)})
      .attr('stroke', function(d) {  if (d.gender === "hermaphrodite") {return "#7901ab"} else { return z(d.gender)}})
      .attr("d", function(d) { return d.person; })
      .on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .9);
       div.html(d.person + "<br/> Weight: "+ d.mass + "<br/> height: "+ d.height)
         .style("left", (d3.event.pageX+20) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       }).on("click", function(){
         console.log( d3.select(this).attr("d"))
      Shiny.setInputValue(
        "People", 
        d3.select(this).attr("d"),
        {priority: "event"}
        );
    });
   
 var xAxis = group.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "axisWhite")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  var yAxis =  group.append("g")
  .attr("class", "axisWhite")
      .call(d3.axisLeft(y));

xAxis.selectAll("line")
    .style("stroke", "white");

  xAxis.selectAll("path")
    .style("stroke", "white");

  xAxis.selectAll("text")
    .style("stroke", "white");


yAxis.selectAll("line")
    .style("stroke", "white");

  yAxis.selectAll("path")
    .style("stroke", "white");

  yAxis.selectAll("text")
    .style("stroke", "white");
    
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", margin.top)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .style("fill", "white")
        .text("People by Height and Mass");

