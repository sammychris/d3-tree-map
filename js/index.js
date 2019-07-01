const DATASETS = {
  videogames:{
    TITLE: "Video Game Sales",
    DESCRIPTION: "Top 100 Most Sold Video Games Grouped by Platform",
    FILE_PATH:"https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json"
},
  movies:{
    TITLE: "Movie Sales",
    DESCRIPTION: "Top 100 Highest Grossing Movies Grouped By Genre",
    FILE_PATH:"https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json"
},
  kickstarter:{
    TITLE: "Kickstarter Pledges",
    DESCRIPTION: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
    FILE_PATH:"https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json"
}}

const SELECT = document.getElementsByTagName('span');
const width = 900, height = 550;
const treeMap = d3.treemap()
    .size([width, height])
    .paddingInner(1);

const color = d3.scaleOrdinal(d3.schemeCategory10.map(color => d3.interpolateRgb(color, "#fff")(0.2)));

const tooltip = d3.select('body')
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

const MapData = (set) => {

  const element = document.getElementById('main');
  const child1 = document.getElementById('map');
  const child2 = document.getElementById('legend');
  if(child1) {
    element.removeChild(child1)
    element.removeChild(child2);
  }
  
  const svg = d3.select('#main')
    .append('svg')
    .attr('id', 'map')
    .attr('width', width)
    .attr('height', height);
    
    fetch(set.FILE_PATH).then(a => a.json())
      .then(data => {
        document.getElementById('title').innerText = set.TITLE;
        document.getElementById('description').innerText = set.DESCRIPTION;
      
        const root = d3.hierarchy(data)
            .sum((d) => d.value)
            .sort((a, b) => b.height - a.height || b.value - a.value);

        treeMap(root);
        const category = root.leaves().map(a => a.data.category).filter((a,b,c) => c.indexOf(a) === b);
      
        const cell = svg.selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        cell.append("rect")
            .attr("id", d => d.data.id)
            .classed('tile', true)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("data-name", d => d.data.name)
            .attr("data-category", d => d.data.category)
            .attr("data-value", d => d.data.value)
            .attr("fill", d => color(d.data.category))
            .on("mousemove", function(d) {   
              tooltip.style("opacity", .9); 
              tooltip.html(
                'Name: ' + d.data.name + 
                '<br>Category: ' + d.data.category + 
                '<br>Value: ' + d.data.value
              )
              .attr("data-value", d.data.value)
              .style("left", (d3.event.pageX + 10) + "px") 
              .style("top", (d3.event.pageY - 28) + "px"); 
            })    
            .on("mouseout", function(d) { 
              tooltip.style("opacity", 0); 
            })
      
        cell.append("text")
            .selectAll("tspan")
            .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
            .enter().append("tspan")
            .attr("x", 4)
            .attr("y", (d, i) => 13 + i * 10)
            .text(d => d);
      
      
      const legend = d3.select('#main')
          .append('svg')
          .attr('width', 315)
          .attr('height', 180)
          .attr('id', 'legend');
      
      legend.selectAll('g')
          .data(category)
          .enter().append('g')
          .attr('transform', (d, i) => `translate(${12 * ((i * 10) % 30)},${26 * Math.floor(i/3)})`)
          .append('rect')
          .classed('legend-item', true)
          .attr('fill', d => color(d))
          .attr('width', 18)
          .attr('height', 18)
          
      legend.selectAll('g')
          .append('text')
          .text(d => d)
          .attr('x', 20)
          .attr('y', 13);
    })
}

for ( let i = 0; i < SELECT.length; i++ ) {
  SELECT[i].onclick = (e) => {
   MapData( DATASETS[e.target.id] );
  }
}

MapData( DATASETS['videogames']) ;