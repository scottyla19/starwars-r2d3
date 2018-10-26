var margin = { top: 20, right: 20, bottom: 20, left: 50 };
width = width - margin.left - margin.right
height = height - margin.top - margin.bottom;

svg.selectAll("*").remove();

//svg.style("fill","black")
 svg.append("rect")
     .attr("width", "100%")
     .attr("height", "100%")
     .attr("fill", "black");



var x = d3.scaleLinear()
    .domain([0,100000])
    .range([5,100]);
    
var z = d3.scaleOrdinal()
    .domain(d3.extent(data, function(d){return d.gender}))
    .range(["#d5d5d5","#89cff0","#f4c2c2","#ffd900"]);
    
    
    
var nodes = []
var links = []

//console.log(data.length)
data.forEach(function(d) {
  /*console.log(d.planet)
  console.log(d.person)*/
  if (nodes.length < 1) {
    nodes.push({name:d.planet, diameter: d.diameter, color:d.color})
  }
    nodes.push({name:d.person, diameter:d.height, color:z(d.gender)})
  
});


for (let i = 1; i < nodes.length; i++) {

  links.push({source: 0, target: i})
  
}


    var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-1000))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', d3.forceLink().links(links).distance(120))
    .on('tick', ticked);

  function updateLinks() {
   svg.selectAll(".links").remove()
    var u = svg.append("g")
      .attr("class", "links")
      .selectAll("g")
      
      .data(links)
      .enter()
      .append('line')
      .attr("stroke", "white")
      .attr('x1', function(d) {
        
        return d.source.x
      })
      .attr('y1', function(d) {
        return d.source.y
      })
      .attr('x2', function(d) {
        
        return d.target.x
      })
      .attr('y2', function(d) {
        return d.target.y
      })
  
    u.exit().remove()
  }
  
  
  
  function updateNodes() {
    
   svg.selectAll(".nodes").remove()
   
   var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter().append("g")
    .attr("diameter",function(d) { return d.diameter; })
    .attr("color",function(d) { return d.color; })
    
   var circles = node
     .append('circle')
     .attr('r', function(d) {
      
      return x(d.diameter/2)
     })
     
     .attr('cx', function(d) {
       return d.x
     })
     .attr('cy', function(d) {
       return d.y
     })
     .attr("fill", function(d) {return d.color})
     
  var lables = node.append("text")
      .text(function(d) {
        return d.name;
      })
      .attr('x', function(d) {
       return d.x - 10
     })
      .attr('y', function(d) {
       return d.y + x(d.diameter/2) + 10
     })
     
     .attr("fill", "white")
  }
  
  function ticked() {
    updateNodes()
    updateLinks()
    
  }

 svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", margin.top)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .style("fill", "white")
        .text("Known Residents");

