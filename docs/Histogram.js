// Histogram.js

function createXScale(data, width) {
    return d3.scaleLinear()
        .domain(d3.extent(data, d => +d.t_cap)) // Use the extent of turbine capacities
        .range([0, width]);
}

function createYScale(bins, height) {
    // Set the y-scale to the count of entries in each bin
    return d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height, 0]);
}

function drawBars(chartGroup, bins, xScale, yScale, height) {
    chartGroup.selectAll(".bar")
        .data(bins)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.x0)) // x0 is the lower bound of each bin
        .attr("y", d => yScale(d.length))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1)) // x1 is the upper bound of each bin
        .attr("height", d => height - yScale(d.length));
}

function drawXAxis(chartGroup, xScale, height) {
    chartGroup.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));
}

function drawYAxis(chartGroup, yScale) {
    chartGroup.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));
}

function drawTitle(svg, width, margin) {
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", margin.top - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Turbine Capacity Distribution Histogram");
}

function drawLabels(svg, width, height, margin) {
    // X label
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width / 2 + margin.left)
        .attr("y", height + margin.top + 20)
        .text("Turbine Capacity (kW)");

    // Y label
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left)
        .attr("x", -margin.top)
        .text("Number of Turbines");
}


function drawHistogram(data, margin, width, height) {
    const svg = d3.select("#viz4")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create the bin generator
    const xScale = createXScale(data, width);
    const histogram = d3.histogram()
        .value(d => +d.t_cap)
        .domain(xScale.domain())
        .thresholds(xScale.ticks(40)); // Adjust number of bins

    const bins = histogram(data);

    const yScale = createYScale(bins, height);

    drawBars(chartGroup, bins, xScale, yScale, height);
    drawXAxis(chartGroup, xScale, height);
    drawYAxis(chartGroup, yScale);
    drawTitle(svg, width, margin);
    drawLabels(svg, width, height, margin);
}


// Export the main function
export { drawHistogram };
