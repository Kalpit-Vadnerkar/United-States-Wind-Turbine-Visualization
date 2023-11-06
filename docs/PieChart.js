// PieChart.js

/**
 * Generates a pie chart visualization for turbine data in a given state.
 * @param {Object[]} turbineData - Array of turbine data objects.
 * @param {string} state - The state to filter the data by.
 */
async function generateVisualization3(turbineData, state = 'IA') {
    const filteredData = filterDataByState(turbineData, state);
    const topManufacturersData = getTopManufacturersData(filteredData);

    const svg = setupSvg();
    const colorScale = getColorScale(topManufacturersData);

    const radius = 180;

    drawPieChart(svg, topManufacturersData, radius);
    createLegend(svg, colorScale, radius, topManufacturersData);
    addTitle(svg, state, radius);
}

function filterDataByState(turbineData, state) {
    return turbineData.filter(d => d.t_state === state);
}

function getTopManufacturersData(filteredData) {
    const manufacturerCounts = d3.rollup(filteredData, v => v.length, d => d.t_manu);
    let sortedData = Array.from(manufacturerCounts).sort((a, b) => b[1] - a[1]);
    let topFiveData = sortedData.slice(0, 5);
    const othersCount = sortedData.slice(5).reduce((acc, curr) => acc + curr[1], 0);
    if (othersCount > 0) {
        topFiveData.push(['Others', othersCount]);
    }
    return topFiveData.map(([key, value]) => ({ key, value }));
}

function setupSvg() {
    const width = 450,
          height = 450;

    return d3.select("#viz3")
             .attr("width", width)
             .attr("height", height)
             .append("g")
             .attr("transform", `translate(${width / 2}, ${height / 2})`);
}

function drawPieChart(svg, topManufacturersData, radius) {
    const pie = d3.pie()
                  .sort(null)
                  .value(d => d.value)(topManufacturersData);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
    const colorScale = getColorScale(topManufacturersData);

    svg.selectAll('path')
       .data(pie)
       .enter()
       .append('path')
       .attr('d', arcGenerator)
       .attr('fill', d => colorScale(d.data.key))
       .attr("stroke", "white")
       .style("stroke-width", "2px")
       .style("opacity", 0.7);

    addPercentageLabels(svg, pie, arcGenerator, topManufacturersData);
}

function getColorScale(dataReady) {
    return d3.scaleOrdinal()
             .domain(dataReady.map(d => d.key))
             .range(d3.schemeTableau10); // More colorblind-friendly color scheme
}

function addPercentageLabels(svg, pie, arcGenerator, dataReady) {
    svg.selectAll('text')
       .data(pie)
       .enter()
       .append('text')
       .text(d => {
           const percentage = (d.data.value / d3.sum(dataReady, d => d.value) * 100).toFixed(2);
           return `${percentage}%`;
       })
       .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
       .style("text-anchor", "middle")
       .style("font-size", "14px");
}

function createLegend(svg, colorScale, radius, dataReady) {
    // Adjust the legend to use the color scale and dynamic positioning
    const legendBoxSize = 20;
    const legendSpacing = 4;

    const legend = svg.selectAll('.legend')
        .data(colorScale.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => {
            const offset = legendBoxSize * colorScale.domain().length / 2;
            const horz = 2 * radius;
            const vert = i * (legendBoxSize + legendSpacing) - offset;
            return `translate(${horz},${vert})`;
        });

    legend.append('rect')
        .attr('width', legendBoxSize)
        .attr('height', legendBoxSize)
        .style('fill', colorScale)
        .style('stroke', colorScale);

    legend.append('text')
        .attr('x', legendBoxSize + legendSpacing)
        .attr('y', legendBoxSize / 2 + legendSpacing)
        .attr("alignment-baseline","middle")
        .text(d => d);
}

function addTitle(svg, state, radius) {
    svg.append("text")
       .attr("x", 0)
       .attr("y", -radius)
       .attr("text-anchor", "middle")
       .style("font-size", "16px")
       .style("text-decoration", "underline")
       .text(`Market Share by Manufacturer for ${state}`);
}

export { generateVisualization3 };
