var margin = { top: 20, right: 20, bottom: 20, left: 50 };
width = width - margin.left - margin.right
height = height - margin.top - margin.bottom;

svg.selectAll("*").remove();

svg.style("fill","black")
// svg.append("rect")
//     .attr("width", "100%")
//     .attr("height", "100%")
//     .attr("fill", "black");



    svg.append("g").attr("class","links")
    svg.append("g").attr("class","nodes")
var x = d3.scaleLinear()
    .domain([0,d3.max(data, function(d) { return d.diameter; })])
    .range([0,150]);
    
var nodes = []
var links = []
// for (let i = 0; i < data.length; i++) {
//   if (i==0) {
//     nodes = []
//     nodes.push({name:data[i].planet})
//     nodes.push({name:data[i].person})
//   }else{
//     nodes.push({name:data[i].person})
//   }
  
// }
console.log(data.length)
data.forEach(function(d) {
  console.log(d.planet)
  console.log(d.person)
  if (nodes.length < 1) {
    nodes.push({name:d.planet})
  }
    nodes.push({name:d.person})
  
});


for (let i = 1; i < nodes.length; i++) {

  links.push({source: 0, target: i})
  
}

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-3000))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', d3.forceLink().links(links))
    .on('tick', ticked);

  function updateLinks() {
   
    var u = svg.select('.links')
      .selectAll('line')
      .data(links)
  
    u.enter()
      .append('line')
      .merge(u)
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
    
  //   var u = svg.select('.nodes')
  //   .selectAll('circle')
  //   .data(nodes)

  // u.enter()
  //   .append('circle')
  //   .attr('r', function(d) {
      
  //     return 10
  //   })
  //   .merge(u)
  //   .attr('cx', function(d) {
  //     return d.x
  //   })
  //   .attr('cy', function(d) {
  //     return d.y
  //   })

  // u.exit().remove()
    var n = svg.select('.nodes')
      .selectAll('text')
      .data(nodes)
  
    n.enter()
      .append('text')
      .text(function(d) {
        
        return d.name
      })
      .merge(n)
      .attr('x', function(d) {
        return d.x
      })
      .attr('y', function(d) {
        return d.y
      })
      .attr('dy', function(d) {
        return 5
      })
  
    n.exit().remove()
  }
  
  function ticked() {
    updateLinks()
    updateNodes()
  }

 svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", margin.top)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .style("fill", "white")
        .text("Known Residents");

