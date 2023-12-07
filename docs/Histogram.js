// Histogram.js

import {ALL_VALUE, FIRST_COL_DIMENSIONS, STATE_NAME_MAPPING, VIZ_TITLE_STYLE, NUM_BINS} from "./Constants.js";
import {Visualization} from "./Visualization.js";

class HistogramVisualization extends Visualization {
    constructor(turbineData) {
        super(turbineData);
        this.visElement = "#viz3";
    }


    createXScale(data) {
        return d3.scaleLinear()
            .domain(d3.extent(data, d => +d.t_cap)) // Use the extent of turbine capacities
            .range([FIRST_COL_DIMENSIONS.margin.left, FIRST_COL_DIMENSIONS.width - FIRST_COL_DIMENSIONS.margin.right]);
    }


    createYScale(bins) {
        // Set the y-scale to the count of entries in each bin
        return d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([FIRST_COL_DIMENSIONS.height - FIRST_COL_DIMENSIONS.margin.top, FIRST_COL_DIMENSIONS.margin.bottom]);
    }


    drawBars(chartGroup, bins, xScale, yScale, height) {
        let color = "#0d9d8c";
        chartGroup.selectAll(".bar")
            .data(bins)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.x0)) // x0 is the lower bound of each bin
            .attr("y", d => yScale(d.length))
            .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1)) // x1 is the upper bound of each bin
            .attr("height", d => height - yScale(d.length) - (FIRST_COL_DIMENSIONS.margin.bottom))
            .attr("fill", color)
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("stroke-width", 3);
            })
            .on("mouseout", function (d, i) {
                d3.select(this)
                    .attr("stroke-width", 1);
            });

    }


    drawXAxis(chartGroup, xScale) {
        chartGroup.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + (FIRST_COL_DIMENSIONS.height - FIRST_COL_DIMENSIONS.margin.bottom) + ")")
            .call(d3.axisBottom(xScale));
    }


    drawYAxis(chartGroup, yScale) {
        chartGroup.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(" + FIRST_COL_DIMENSIONS.margin.left + ",0)")
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
            .attr("x", FIRST_COL_DIMENSIONS.width / 2 + FIRST_COL_DIMENSIONS.margin.left)
            .attr("y", FIRST_COL_DIMENSIONS.height + 15)
            .text("Turbine Capacity (kW)");

        // Y label
        svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "end")
            .attr("x", -FIRST_COL_DIMENSIONS.height / 2 + FIRST_COL_DIMENSIONS.margin.top)
            .attr("y", FIRST_COL_DIMENSIONS.margin.left - 40)
            .attr("transform", "rotate(-90)")
            .text("Number of Turbines");
    }


    draw() {

        const svg = d3.select(this.visElement)
            .attr("width", FIRST_COL_DIMENSIONS.width + FIRST_COL_DIMENSIONS.margin.left + FIRST_COL_DIMENSIONS.margin.right)
            .attr("height", FIRST_COL_DIMENSIONS.height + FIRST_COL_DIMENSIONS.margin.top + FIRST_COL_DIMENSIONS.margin.bottom);
        var globalGroup = svg.append("g");


        const chartGroup = globalGroup.append("g")

        let data = this.turbineData;
        if (this.selectedState !== ALL_VALUE) {
            data = data.filter(d => d.state === this.selectedState);
        }
        if (this.selectedManufacturer !== ALL_VALUE) {
            data = data.filter(d => d.t_manu === this.selectedManufacturer);
        }
        // Create the bin generator
        const xScale = this.createXScale(data);
        const histogram = d3.histogram(data)
            .value(d => +d.t_cap)
            .domain(xScale.domain())
            .thresholds(xScale.ticks(NUM_BINS)); // Adjust number of bins

        const bins = histogram(this.turbineData);

        const yScale = this.createYScale(bins);

        this.drawBars(chartGroup, bins, xScale, yScale, FIRST_COL_DIMENSIONS.height);
        this.drawXAxis(chartGroup, xScale, FIRST_COL_DIMENSIONS.height);
        this.drawYAxis(chartGroup, yScale);
        this.drawTitle(globalGroup, FIRST_COL_DIMENSIONS.width, FIRST_COL_DIMENSIONS.margin);
        this.drawLabels(globalGroup, FIRST_COL_DIMENSIONS.width, FIRST_COL_DIMENSIONS.height, FIRST_COL_DIMENSIONS.margin);
        globalGroup.attr("transform", "translate(10," + FIRST_COL_DIMENSIONS.margin.top + ")");
    }

}

// Export the main
export {HistogramVisualization};
