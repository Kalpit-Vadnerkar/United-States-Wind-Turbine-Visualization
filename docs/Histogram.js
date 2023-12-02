// Histogram.js

import {ALL_VALUE, SECOND_COL_DIMENSIONS, STATE_NAME_MAPPING, VIZ_TITLE_STYLE} from "./Constants.js";
import {Visualization} from "./Visualization.js";

class HistogramVisualization extends Visualization {
    constructor(turbineData) {
        super(turbineData);
        this.visElement = "#viz3";
    }


    createXScale(data) {
        return d3.scaleLinear()
            .domain(d3.extent(data, d => +d.t_cap)) // Use the extent of turbine capacities
            .range([SECOND_COL_DIMENSIONS.margin.left, SECOND_COL_DIMENSIONS.width - SECOND_COL_DIMENSIONS.margin.right]);
    }


    createYScale(bins) {
        // Set the y-scale to the count of entries in each bin
        return d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([SECOND_COL_DIMENSIONS.height - SECOND_COL_DIMENSIONS.margin.top, SECOND_COL_DIMENSIONS.margin.bottom]);
    }


    drawBars(chartGroup, bins, xScale, yScale, height) {
        chartGroup.selectAll(".bar")
            .data(bins)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.x0)) // x0 is the lower bound of each bin
            .attr("y", d => yScale(d.length))
            .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1)) // x1 is the upper bound of each bin
            .attr("height", d => height - yScale(d.length) - (SECOND_COL_DIMENSIONS.margin.bottom));
    }


    drawXAxis(chartGroup, xScale) {
        chartGroup.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + (SECOND_COL_DIMENSIONS.height - SECOND_COL_DIMENSIONS.margin.bottom) + ")")
            .call(d3.axisBottom(xScale));
    }


    drawYAxis(chartGroup, yScale) {
        chartGroup.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(" + SECOND_COL_DIMENSIONS.margin.left + ",0)")
            .call(d3.axisLeft(yScale));
    }


    drawTitle(svg, width, margin) {
        let title = `${this.selectedManufacturer === ALL_VALUE ? "" : this.selectedManufacturer} Turbine Capacity Distribution in ${this.selectedState === ALL_VALUE ? "the USA" : STATE_NAME_MAPPING[this.selectedState]}`;
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", margin.top - 10)
            .attr("style", VIZ_TITLE_STYLE)
            .attr("text-anchor", "middle")
            .text(title);
    }


    drawLabels(svg) {
        // X label
        svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "end")
            .attr("x", SECOND_COL_DIMENSIONS.width / 2 + SECOND_COL_DIMENSIONS.margin.left)
            .attr("y", SECOND_COL_DIMENSIONS.height + 15)
            .text("Turbine Capacity (kW)");

        // Y label
        svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "end")
            .attr("x", -SECOND_COL_DIMENSIONS.height / 2 + SECOND_COL_DIMENSIONS.margin.top)
            .attr("y", SECOND_COL_DIMENSIONS.margin.left - 40)
            .attr("transform", "rotate(-90)")
            .text("Number of Turbines");
    }


    draw() {

        const svg = d3.select(this.visElement)
            .attr("width", SECOND_COL_DIMENSIONS.width + SECOND_COL_DIMENSIONS.margin.left + SECOND_COL_DIMENSIONS.margin.right)
            .attr("height", SECOND_COL_DIMENSIONS.height + SECOND_COL_DIMENSIONS.margin.top + SECOND_COL_DIMENSIONS.margin.bottom);
        var globalGroup = svg.append("g");


        const chartGroup = globalGroup.append("g")

        // Create the bin generator
        const xScale = this.createXScale(this.turbineData);
        const histogram = d3.histogram()
            .value(d => +d.t_cap)
            .domain(xScale.domain())
            .thresholds(xScale.ticks(40)); // Adjust number of bins

        const bins = histogram(this.turbineData);

        const yScale = this.createYScale(bins);

        this.drawBars(chartGroup, bins, xScale, yScale, SECOND_COL_DIMENSIONS.height);
        this.drawXAxis(chartGroup, xScale, SECOND_COL_DIMENSIONS.height);
        this.drawYAxis(chartGroup, yScale);
        this.drawTitle(globalGroup, SECOND_COL_DIMENSIONS.width, SECOND_COL_DIMENSIONS.margin);
        this.drawLabels(globalGroup, SECOND_COL_DIMENSIONS.width, SECOND_COL_DIMENSIONS.height, SECOND_COL_DIMENSIONS.margin);
        globalGroup.attr("transform", "translate(10," + SECOND_COL_DIMENSIONS.margin.top + ")");
    }

}

// Export the main
export {HistogramVisualization};
