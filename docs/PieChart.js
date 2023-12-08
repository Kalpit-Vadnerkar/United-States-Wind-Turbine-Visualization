// PieChart.js

import {Visualization} from "./Visualization.js";
import {ALL_VALUE, SECOND_COL_DIMENSIONS, STATE_NAME_MAPPING, VIZ_TITLE_STYLE} from "./Constants.js";
import globalEventManager from "./EventManager.js";

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


class PieChartVisualization extends Visualization {
    constructor(turbineData) {
        super(turbineData);
        this.visElement = "#viz4";

    }


    filterByManufacturer(manufacturer) {
        super.filterByManufacturer(manufacturer);
        this.clear();
        this.draw();
    }

    filterByState(state) {
        super.filterByState(state);
        this.clear();
        this.draw();
    }

    getTopManufacturersData() {
        let data = this.turbineData;
        if (this.selectedState !== ALL_VALUE) {
            data = data.filter(d => d.t_state === this.selectedState);
        }
        if (this.selectedManufacturer !== ALL_VALUE) {
            data = data.filter(d => d.t_manu === this.selectedManufacturer);
        }
        const manufacturerCounts = d3.rollup(data, v => v.length, d => d.t_manu);
        let sortedData = Array.from(manufacturerCounts).sort((a, b) => b[1] - a[1]);
        let topFiveData = sortedData.slice(0, 5);
        const othersCount = sortedData.slice(5).reduce((acc, curr) => acc + curr[1], 0);
        if (othersCount > 0) {
            topFiveData.push(['Others', othersCount]);
        }
        return topFiveData.map(([key, value]) => ({key, value}));
    }


    addTitle(svg, radius) {

        let title = `Market Share by Manufacturer in ${this.selectedState === ALL_VALUE ? "the USA" : STATE_NAME_MAPPING[this.selectedState]} ${this.selectedManufacturer === ALL_VALUE ? "" : "(Only " + this.selectedManufacturer + ")"}`;

        svg.append("text")
            .attr("x", 0)
            .attr("y", -radius - 10)
            .attr("text-anchor", "middle")
            .attr("style", VIZ_TITLE_STYLE)
            .text(title);
    }

    createLegend(svg, colorScale, radius) {
        const legendBoxSize = 20; // Size of the color box
        const legendSpacing = 4; // Spacing between boxes
        const legendHeight = legendBoxSize + legendSpacing; // Height of one legend item

        // Create group elements for each legend item
        const legend = svg.selectAll('.legend') // selecting elements with class 'legend'
            .data(colorScale.domain()) // use the unique categories as data
            .enter()
            .append('g') // create a g element for each category
            .attr('class', 'legend') // class for styling
            .attr('transform', function (d, i) {
                const height = legendHeight;
                const offset = height * colorScale.domain().length / 2;
                const horz = 2 * legendBoxSize;
                const vert = i * height - offset;
                return `translate(${radius + horz},${vert})`;
            });

        // Add the colored boxes to the legend
        legend.append('rect')
            .attr('width', legendBoxSize)
            .attr('height', legendBoxSize)
            .style('fill', colorScale)
            .style('stroke', colorScale);

        // Add the category text to the legend
        legend.append('text')
            .attr('x', legendBoxSize + legendSpacing)
            .attr('y', legendBoxSize - legendSpacing)
            //.attr("alignment-baseline","middle")
            .text(d => {
                return d !== "" ? d : "Unknown";
            });
    }

    drawPie(svg, topManufacturersData, radius) {
        const pie = d3.pie()
            .sort(null)
            .value(d => d.value)(topManufacturersData);
        const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
        const colorScale = getColorScale(topManufacturersData);

        svg.selectAll('path')
            .data(pie)
            .enter()
            .append('path')
            .attr("id", d => "slice-" + d.index)
            .attr('d', arcGenerator)
            .attr('fill', d => colorScale(d.data.key))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", .9)
            .on("mouseover", (d, i) => {
                svg.selectAll("#slice-" + i.index).style(
                    "stroke-width", 5);
            })
            .on("mouseout", (d, i) => {
                svg.selectAll("#slice-" + i.index).style("stroke-width", 2);

            })
            .on("click", (d, i) => {
                let manu = i.data.key;
                if (manu === "" || manu === "Others") {
                    // Do not filter by Unknown and Others
                    return;
                }
                globalEventManager.dispatch("manufacturerSelected", {
                    "newSelectedManufacturer": manu,
                    oldSelectedManufacturer: this.selectedManufacturer
                });
            });

        addPercentageLabels(svg, pie, arcGenerator, topManufacturersData);
    }


    draw() {
        const topManufacturersData = this.getTopManufacturersData();

        const svg = d3.select(this.visElement)
            .attr("width", SECOND_COL_DIMENSIONS.width)
            .attr("height", SECOND_COL_DIMENSIONS.height)
            .append("g")
            .attr("transform", `translate(${SECOND_COL_DIMENSIONS.width / 2}, ${SECOND_COL_DIMENSIONS.height / 1.6})`);
        const colorScale = getColorScale(topManufacturersData);

        const radius = 160;

        this.drawPie(svg, topManufacturersData, radius);
        this.createLegend(svg, colorScale, radius, topManufacturersData);
        this.addTitle(svg, radius);
    }

}

export {PieChartVisualization};
