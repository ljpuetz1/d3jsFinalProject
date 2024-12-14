// combined the js for differnet charts
d3.csv('data/Baidu.csv').then(data => {
    // Parse data
    console.log("Raw Data",data)
    data.forEach(d => {
        d["Baidu Core Revenue"] = +d["Baidu Core Revenue"] || 0; // fix csv issues
    console.log(d["Baidu Core Revenue"]); // logged for bug fixing
      d["iQIYI Revenue"] = +d["iQIYI Revenue"] || 0;
      d["Baidu Core total cost and expenses"] = +d["Baidu Core total cost and expenses"] || 0;
      d["iQIYI total cost and expenses"] = +d["iQIYI total cost and expenses"] || 0;
      d["Operating Income Baidu Core"] = +d["Opearting Income Baidu Core"] || 0;
      d["iQIYI Operating Income"] = +d["iQIYI Opearting Income"] || 0;
    });
  
   // Dimensions
const margin = { top: 20, right: 350, bottom: 80, left: 50 }; // right has to be much longer for hte line chart legend
const width = 900 - margin.left - margin.right; 
const height = 400 - margin.top - margin.bottom;

// line chart container
const lineChartSvg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// line scale
const xLine = d3.scalePoint()
  .domain(data.map(d => d["Quarter Report Date"]))
  .range([0, width]);

const yLine = d3.scaleLinear()
  .domain([-2500, d3.max(data, d => Math.max(
    d["Baidu Core Revenue"],
    d["iQIYI Revenue"],
    d["Baidu Core total cost and expenses"],
    d["iQIYI total cost and expenses"],
    d["Operating Income Baidu Core"],
    d["iQIYI Operating Income"]
  ))]).nice()
  .range([height, 0]);

// line aces
lineChartSvg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xLine))
  .selectAll("text")
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "end");

lineChartSvg.append("g")
  .call(d3.axisLeft(yLine));

// line functions 
const createLine = key => d3.line()
  .x(d => xLine(d["Quarter Report Date"]))
  .y(d => yLine(d[key]));

const keys = [
  "Baidu Core Revenue",
  "iQIYI Revenue",
  "Baidu Core total cost and expenses",
  "iQIYI total cost and expenses",
  "Operating Income Baidu Core",
  "iQIYI Operating Income"
];

const colors = d3.scaleOrdinal()
  .domain(keys)
  .range(["steelblue", "orange", "green", "red", "purple", "brown"]);

keys.forEach(key => {
  lineChartSvg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", colors(key))
    .attr("stroke-width", 2)
    .attr("d", createLine(key));

  // interactive for line chart
  lineChartSvg.selectAll(`.point-${key}`)
    .data(data)
    .enter()
    .append("circle")
    .attr("class", `point-${key}`)
    .attr("cx", d => xLine(d["Quarter Report Date"]))
    .attr("cy", d => yLine(d[key]))
    .attr("r", 4)
    .attr("fill", colors(key))
    .on("mouseover", function (event, d) {
      d3.select(this).transition().attr("r", 8);
      lineChartSvg.append("text")
        .attr("class", "tooltip")
        .attr("x", xLine(d["Quarter Report Date"]) + 10)
        .attr("y", yLine(d[key]) - 10)
        .style("background", "white")
        .style("padding", "2px")
        .style("border-radius", "3px")
        .text(`${key}: ${d[key]}`);
    })
    .on("mouseout", function () {
      d3.select(this).transition().attr("r", 4);
      lineChartSvg.selectAll(".tooltip").remove();
    });

  // legend
  lineChartSvg.append("text")
    .attr("x", width + 20)
    .attr("y", 20 + keys.indexOf(key) * 20)
    .attr("fill", colors(key))
    .text(key);
});

// bar container
const barChartSvg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// scales
const xBar = d3.scaleBand()
  .domain(data.map(d => d["Quarter Report Date"]))
  .range([0, width])
  .padding(0.1);

const yBar = d3.scaleLinear()
  .domain([0, d3.max(data, d => d["Baidu Core Revenue"])]).nice()
  .range([height, 0]);

// axes
barChartSvg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xBar))
  .selectAll("text")
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "end");

barChartSvg.append("g")
  .call(d3.axisLeft(yBar));

// bar to chart
barChartSvg.selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", d => xBar(d["Quarter Report Date"]))
  .attr("y", d => yBar(d["Baidu Core Revenue"]))
  .attr("width", xBar.bandwidth())
  .attr("height", d => height - yBar(d["Baidu Core Revenue"]))
  .attr("fill", "steelblue");


const pieChartSvg = d3.select("#chart")
  .append("svg")
  .attr("width", 400)
  .attr("height", 400)
  .append("g")
  .attr("transform", `translate(200,200)`);

  const totals = {
    "Baidu Core Revenue": d3.sum(data, d => d["Baidu Core Revenue"]),
    "iQIYI Revenue": d3.sum(data, d => d["iQIYI Revenue"]),
    "Baidu Core total cost and expenses": d3.sum(data, d => d["Baidu Core total cost and expenses"]),
    "iQIYI total cost and expenses": d3.sum(data, d => d["iQIYI total cost and expenses"]),
    "Operating Income Baidu Core": d3.sum(data, d => d["Operating Income Baidu Core"]),
    "iQIYI Operating Income": d3.sum(data, d => d["iQIYI Operating Income"]),
  };
  
  // Format Data for Pie Chart
  const pieData = Object.keys(totals).map(key => ({
    category: key,
    value: totals[key],
  }));
  
  const pie = d3.pie().value(d => d.value);
  
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(150);
  
  const color = d3.scaleOrdinal()
    .domain(pieData.map(d => d.category))
    .range(d3.schemeCategory10);
  
  // Draw Pie Slices with Interactivity
  pieChartSvg.selectAll("path")
    .data(pie(pieData))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.category))
    .on("mouseover", function(event, d) {
      const total = d3.sum(pieData, d => d.value);
      const percentage = ((d.data.value / total) * 100).toFixed(2);
  
      pieChartSvg.append("text")
        .attr("class", "tooltip")
        .attr("transform", `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(`${percentage}%`);
    })
    .on("mouseout", function() {
      pieChartSvg.selectAll(".tooltip").remove();
    });

// removing the pie chart text too big and not easy to read
pieChartSvg.selectAll("text").remove();

// pie chart legend
const legend = d3.select("#chart")
  .append("div")
  .attr("class", "pie-legend");

// add legend text
pieData.forEach((d, i) => {
  const legendItem = legend.append("div")
    .attr("class", "pie-legend-item");

  // add color box
  legendItem.append("div")
    .attr("class", "pie-legend-color")
    .style("background-color", color(d.category));

  // add text
  legendItem.append("span")
    .text(`${d.category}: ${d.value}`);
});

})