// TimeSeries.js
import {ALL_VALUE, SECOND_COL_DIMENSIONS, STATE_NAME_MAPPING, VIZ_TITLE_STYLE} from "./Constants.js";
import {Visualization} from "./Visualization.js";


class TimeSeriesVisualization extends Visualization {
    constructor(turbineData) {
        super(turbineData);
        this.turbineData = turbineData;
        this.originalTurbineData = turbineData;

        this.visElement = "#viz2";
    }

    draw() {
        let color = "#0d9d8c";

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
            .range([SECOND_COL_DIMENSIONS.margin.left, SECOND_COL_DIMENSIONS.width - SECOND_COL_DIMENSIONS.margin.right]);
        globalGroup.append("g")
            .attr("transform", "translate(0," + (SECOND_COL_DIMENSIONS.height - SECOND_COL_DIMENSIONS.margin.bottom) + ")")
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

// Add Y axis
        var y = d3.scaleLinear()
            .domain(yRange)
            .range([SECOND_COL_DIMENSIONS.height - SECOND_COL_DIMENSIONS.margin.bottom, SECOND_COL_DIMENSIONS.margin.top]);
        globalGroup.append("g")
            .attr("transform", "translate(" + SECOND_COL_DIMENSIONS.margin.left + ",0)")
            .call(d3.axisLeft(y));

// Add the line
        globalGroup.append("path")
            .data([Object.entries(countByYear)])
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d[0]))
                .y(d => y(d[1])));

// Title
        let title = `Number of new ${this.selectedManufacturer === ALL_VALUE ? "" : this.selectedManufacturer} Turbine Projects per year ${this.selectedState === ALL_VALUE ? "in the USA" : "in " + STATE_NAME_MAPPING[this.selectedState]}`;

        globalGroup.append("text")
            .attr("x", SECOND_COL_DIMENSIONS.width / 2)
            .attr("y", 10)
            .attr("style", VIZ_TITLE_STYLE)
            .attr("text-anchor", "middle")
            .text(title);

        globalGroup.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "end")
            .attr("x", SECOND_COL_DIMENSIONS.width / 2 + SECOND_COL_DIMENSIONS.margin.left)
            .attr("y", SECOND_COL_DIMENSIONS.height + 20)
            .text("Year");

        globalGroup.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "end")
            .attr("x", -SECOND_COL_DIMENSIONS.height / 2 + SECOND_COL_DIMENSIONS.margin.top)
            .attr("y", SECOND_COL_DIMENSIONS.margin.left - 40)
            .attr("transform", "rotate(-90)")
            .text("Amount");

        globalGroup.attr("transform", "translate(10," + SECOND_COL_DIMENSIONS.margin.top + ")");
    }
}

export {TimeSeriesVisualization};
