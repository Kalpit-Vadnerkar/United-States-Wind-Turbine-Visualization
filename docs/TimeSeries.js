// TimeSeries.js
import {DIMENSIONS_2, VIZ_TITLE_STYLE} from "./Constants.js";
import {Visualization} from "./Visualization.js";

async function drawTimeSeries(turbineData) {

}


class TimeSeriesVisualization extends Visualization {
    constructor(turbineData) {
        super(turbineData);
        this.turbineData = turbineData;
        this.originalTurbineData = turbineData;

        this.visElement = "#viz2";
        this.selectedState = "ALL";
    }

    draw() {

        var svg = d3.select(this.visElement);

        var globalGroup = svg.append("g");
        let countByYear = {}
        for (const turbineDatum of this.turbineData) {
            let year = Number(turbineDatum.p_year);
            if (year === 0) continue; // Year is zero, ignore it
            if (year in countByYear) {
                countByYear[year] += 1;
            } else {
                countByYear[year] = 1;
            }
        }

        let xMin = Math.min(...Object.keys(countByYear));
        let xMax = Math.max(...Object.keys(countByYear));
        let xRange = [xMin, xMax];

        let yMin = Math.min(...Object.values(countByYear));
        let yMax = Math.max(...Object.values(countByYear));
        let yRange = [yMin, yMax];

// Add X axis
        var x = d3.scaleLinear()
            .domain(xRange)
            .range([DIMENSIONS_2.margin.left, DIMENSIONS_2.width - DIMENSIONS_2.margin.right]);
        globalGroup.append("g")
            .attr("transform", "translate(0," + (DIMENSIONS_2.height - DIMENSIONS_2.margin.bottom) + ")")
            .call(d3.axisBottom(x));

// Add Y axis
        var y = d3.scaleLinear()
            .domain(yRange)
            .range([DIMENSIONS_2.height - DIMENSIONS_2.margin.bottom, DIMENSIONS_2.margin.top]);
        globalGroup.append("g")
            .attr("transform", "translate(" + DIMENSIONS_2.margin.left + ",0)")
            .call(d3.axisLeft(y));

// Add the line
        globalGroup.append("path")
            .data([Object.entries(countByYear)])
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d[0]))
                .y(d => y(d[1])));

// Title
        globalGroup.append("text")
            .attr("x", DIMENSIONS_2.width / 2)
            .attr("y", -6)
            .attr("style", VIZ_TITLE_STYLE)
            .attr("text-anchor", "middle")
            .text("Number of new turbine projects per year");

        globalGroup.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "end")
            .attr("x", DIMENSIONS_2.width / 2 + DIMENSIONS_2.margin.left)
            .attr("y", DIMENSIONS_2.height + 10)
            .text("Year");

        globalGroup.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "end")
            .attr("x", -DIMENSIONS_2.height / 2 + DIMENSIONS_2.margin.top)
            .attr("y", DIMENSIONS_2.margin.left - 40)
            .attr("transform", "rotate(-90)")
            .text("Amount");

        globalGroup.attr("transform", "translate(10," + DIMENSIONS_2.margin.top + ")");
    }
}

export {TimeSeriesVisualization};