// Map.js
import {STATE_NAME_MAPPING, DIMENSIONS, VIZ_TITLE_STYLE, ALL_VALUE} from "./Constants.js";
import {Visualization} from "./Visualization.js";

const colors = ["#26440e", "#66ff5b"];


class TurbineMapVisualization extends Visualization {
    constructor(turbineData, mapData) {
        super();
        this.turbineData = turbineData;
        this.originalTurbineData = turbineData;

        this.mapData = mapData;
        this.visElement = "#viz1";
        this.selectedState = "ALL";
    }

    drawMapAndTurbines(svg, mapData, turbineData, projection, range, countByState) {


        let pathGenerator = d3.geoPath(projection);
        let path = svg.append("path")
            .attr("d", pathGenerator({type: "Sphere"}))
            .attr("stroke", "gray")
            .attr("fill", "lightblue");


        let colorScale = d3.scaleLinear().domain(range).range(colors);

        let states = svg.append("g")
            .selectAll(".state")
            .data(mapData.features)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("stroke", "lightgray")
            .attr("stroke-width", 1)
            .attr("fill", d => {
                if (countByState[d.properties.NAME] != null) return colorScale(countByState[d.properties.NAME]);
                return "darkgray"
            })
            .attr("d", d => pathGenerator(d))

        let points = svg.append("g")
            .selectAll(".point")
            .data(turbineData)
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("fill", "#63b7b7")
            .attr("stroke", "#153b3b")
            .attr("stroke-width", 1)
            .attr('transform', d => {
                let coords = projection([d.xlong, d.ylat]);
                return "translate(" + projection([d.xlong, d.ylat]) + ")";
            });

        svg.append("text")
            .attr("x", DIMENSIONS.width / 3)
            .attr("y", -6)
            .attr("style", VIZ_TITLE_STYLE)
            .attr("text-anchor", "middle")
            .text("Proliferation of Wind Turbines in the USA");
    }

    drawLegend(svg, range) {
        // Create the gradient first
        var gradient = svg.append("svg:defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad")
            .attr("gradientTransform", "rotate(45)");
        gradient.append("svg:stop")
            .attr("offset", "0%")
            .attr("stop-color", colors[0])
            .attr("stop-opacity", 1);

        gradient.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", colors[1])
            .attr("stop-opacity", 1);


        // Start the legend
        const legend = svg
            .append("g")
            .attr("class", "legend")
        legend.append("rect")
            .attr("fill", "rgba(155,155,155,0.8)")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 300)
            .attr("height", 200)
            .attr("stroke", "lightgray")
            .attr("stroke-width", 1);

        // Legend title
        legend.append("text")
            .attr("x", 120)
            .attr("y", 20)
            .attr("class", "legend-title")
            .attr("font-size", "24px")
            .text("Legend");

        // Color gradient
        const gradientLegend = legend
            .append("g")
            .selectAll("rect")
            .data([1])
            .enter()
            .append("rect")
            .attr("fill", "url(#gradient)")
            .attr("x", 40)
            .attr("y", 30)
            .attr("width", 30)
            .attr("height", 120)
            .attr("stroke", "lightgray")
            .attr("stroke-width", 1);

        const gradientLabel = legend.append("text")
            .attr("transform", "translate(65, 80)")
            .selectAll("tspan")
            .data(["Number of", "Turbine Projects"])
            .enter()
            .append("tspan")
            .attr("x", 15)
            .attr("dy", 15)
            .text(d => d);


        const gradientLabels = legend
            .append("g")
            .selectAll("text")
            .data(range)
            .enter()
            .append("text")
            .attr("x", 33 + 40)
            .attr("y", d => {
                return range.indexOf(d) * 100 + 50
            })
            .text(d => d);

        // Point key
        const pointLegend = legend
            .append("g")
            .selectAll("circle")
            .data([1])
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("fill", "#63b7b7")
            .attr("stroke", "#153b3b")
            .attr("stroke-width", 1)
            .attr("transform", "translate(58, 165)");

        const pointLabel = legend
            .append("text")
            .attr("transform", "translate(63, 155)")
            .selectAll("tspan")
            .data(["Location of", "Turbine Projects"])
            .enter()
            .append("tspan")
            .attr("x", 15)
            .attr("dy", 15)
            .text(d => d);

        legend.attr("transform", "translate(" + DIMENSIONS.width * 0.7 + "," + ((DIMENSIONS.height / 2) - 90) + ")");
    }

    draw() {
        let element = document.getElementById("viz1");

        const width = element.clientWidth;
        const height = element.clientHeight;

// var svg = d3.select("#viz1").attr("width", width).attr("height", height);
        var svg = d3.select(this.visElement);
        var globalGroup = svg.append("g");

        // Create the projection
        let projection = d3.geoAlbersUsa().fitWidth(width * 0.7, {type: "Sphere"});

        // If the point is not within the frame of the projection, filter it out
        // This usually happens when the point is outside the US (in territories)
        this.turbineData = this.turbineData.filter(d => {
            let coords = projection([d.xlong, d.ylat]);
            return coords != null;
        });

        // Count how many turbines in each state
        let countByState = {}
        for (const turbineDatum of this.turbineData) {

            let amount = Number(turbineDatum.p_tnum);
            if (STATE_NAME_MAPPING[turbineDatum.t_state] in countByState) {
                countByState[STATE_NAME_MAPPING[turbineDatum.t_state]] += 1;

            } else {
                countByState[STATE_NAME_MAPPING[turbineDatum.t_state]] = 1;
            }
        }

        let maxCount = Math.max(...Object.values(countByState));
        let minCount = Math.min(...Object.values(countByState));

        let range = [minCount, maxCount];

        // Draw data
        this.drawMapAndTurbines(globalGroup, this.mapData, this.turbineData, projection, range, countByState);
        this.drawLegend(globalGroup, range);

        globalGroup.attr("transform", "translate(0, 30)");
    }


    clear() {
        d3.select(this.visElement).selectAll("*").remove();
    }

    filterByState(state) {
        this.turbineData = this.originalTurbineData;

        if (state !== ALL_VALUE) {
            this.turbineData = this.turbineData.filter(d => {
                return d.t_state === state;
            });
        }
    }
}

export {TurbineMapVisualization};