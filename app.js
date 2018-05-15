// Define SVG area dimensions
let svgWidth = 960;
let svgHeight = 600;

// Define the chart's margins as an object
let chartMargin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 80
};

// Define dimensions of the chart area
let chartWidth = svgWidth - chartMargin.left - chartMargin.right;
let chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
let svg = d3.select("body")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

// Append a group to the SVG area
// and shift ("translate") it to the right and to the bottom
let chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from data.csv
d3.csv("data/data.csv", function(error, povData) {
    // Throw an error if one occurs
    if (error) throw error;
    // Print the povData
    console.log(povData);

    // Cast poverty and tobacco values to numbers
    povData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.tobaccoUse = +data.tobaccoUse;
    });

    // Create linear scale for x axis
    let xScale = d3.scaleLinear()
        .domain([6, d3.max(povData, data => data.poverty)])
        .range([0, chartWidth]);

    // Create linear scale for y axis
    let yScale = d3.scaleLinear()
        .domain([8, d3.max(povData, data => data.tobaccoUse)])
        .range([chartHeight, 0]);

    // Create two functions passing the scales in as arguments
    // (Used to create the chart's axes)
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    // Append a SVG group element to the chartGroup
    // and create x axis inside of it
    chartGroup.append("g")
        .classed("axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);
        
    // Append a SVG group element to the chartGroup
    // and create y axis inside of it
    chartGroup.append("g")
        .classed("axis", true)
        .call(yAxis);
    
    // Create plots
    let plotsGroup = chartGroup.selectAll("circle")
        .data(povData)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("r", "20")
        .attr("cx", data => xScale(data.poverty))
        .attr("cy", data => yScale(data.tobaccoUse))
        .attr("fill", "lightblue")
        .attr("opacity", ".75");

    // Initialize tool tip
    let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(data => (`State: ${data.state}<br> Poverty: ${data.poverty}%<br> Tobacco Use: ${data.tobaccoUse}%`))
    
    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listener to display and hide the tooltip
    plotsGroup.on("mouseover", data => toolTip.show(data))
        .on("mouseout", (data, index) => toolTip.hide(data));
    
    // Add state labels to scatter points
    chartGroup.append("text")
        .selectAll("tspan")
        .data(povData)
        .enter()
        .append("tspan")
        .attr("x", (data, index) => xScale(data.poverty))
        .attr("y", (data, index)  => yScale(data.tobaccoUse))
        .attr("class", "state-abbr")
        .text((data) => data.abbr)

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 40)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axis-text")
        .text("Tobacco Use (%)");
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight + chartMargin.top + 30})`)
        .attr("class", "axis-text")
        .text("In Poverty (%)");
    
});
