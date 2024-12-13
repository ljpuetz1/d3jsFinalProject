// Load and parse dataset
d3.csv('Baidu.csv').then(data => {
    // Parse data (convert strings to numbers)
    data.forEach(d => {
      d["Baidu Core Revenue"] = +d["Baidu Core Revenue"];
      d["iQIYI Revenue"] = +d["iQIYI Revenue"];
      
    });
  
    // Set up SVG canvas
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Define scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.Quarter))
      .range([0, width])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d["Baidu Core Revenue"])]).nice()
      .range([height, 0]);
   // Add axes
   svg.append("g")
   .attr("transform", `translate(0,${height})`)
   .call(d3.axisBottom(x));

 svg.append("g")
   .call(d3.axisLeft(y));

 // Add bars
 svg.selectAll(".bar")
   .data(data)
   .enter()
   .append("rect")
   .attr("class", "bar")
   .attr("x", d => x(d.Quarter))
   .attr("y", d => y(d["Baidu Core Revenue"]))
   .attr("width", x.bandwidth())
   .attr("height", d => height - y(d["Baidu Core Revenue"]))
   .attr("fill", "steelblue");
});
