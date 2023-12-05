// Map.js
import {ALL_VALUE, FIRST_COL_DIMENSIONS, STATE_NAME_MAPPING, VIZ_TITLE_STYLE} from "./Constants.js";
import {Visualization} from "./Visualization.js";

const colors = ["#0d9d8c", "#e3c03f", "#a18b26", "#96e82c"];


class TurbineMapVisualization extends Visualization {
    constructor(turbineData, mapData) {
        super();
        this.turbineData = turbineData;
        this.originalTurbineData = turbineData;

        this.mapData = mapData;
        this.visElement = "#viz1";
    }

    drawMapAndTurbines(svg, mapData, turbineData, projection, range, countByState) {
        let pathGenerator = d3.geoPath(projection);
        // console.log(pathGenerator.bounds());
        let path = svg.append("path")
            .attr("d", pathGenerator({type: "Sphere"}))
            .attr("stroke", "gray")
            .attr("fill", "lightblue");
        let mapBounds = pathGenerator.bounds(mapData)


        let intervalRange = [];
        let factor = (range[1] - range[0]) / (colors.length - 1);

        for (let i = 0; i < colors.length; i++) {
            intervalRange.push(range[0] + factor * i);
        }

        let colorScale = d3.scaleLinear().domain(intervalRange).range(colors);

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
            .on("mouseenter", (d, i) => {
                let count = countByState[i.properties.NAME]
                console.log(i.properties.NAME, count);
            })
            .on("click", (d, i) => {
                let count = countByState[i.properties.NAME]
                console.log(i.properties.NAME, count);
            });

        let points = svg.append("g")
            .selectAll(".point")
            .data(turbineData)
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("fill", "#dca65a")
            .attr("stroke", "#332301")
            .attr("stroke-width", 1)
            .attr('transform', d => {
                let coords = projection([d.xlong, d.ylat]);
                return "translate(" + projection([d.xlong, d.ylat]) + ")";
            });

        let title = `Proliferation of ${this.selectedManufacturer === ALL_VALUE ? "" : this.selectedManufacturer} Turbines in ${this.selectedState === ALL_VALUE ? "the USA" : STATE_NAME_MAPPING[this.selectedState]}`;
        svg.append("text")
            .attr("x", FIRST_COL_DIMENSIONS.width / 2)
            .attr("y", -15)
            .attr("style", VIZ_TITLE_STYLE)
            .attr("text-anchor", "middle")
            .text(title);

        return mapBounds;
    }

    drawLegend(svg, range, mapBounds) {
        // Create the gradient first
        var gradient = svg.append("svg:defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0")
            .attr("y1", "0")
            .attr("x2", "0")
            .attr("y2", "1")
            .attr("spreadMethod", "pad");


        for (let i = 0; i < colors.length; i++) {
            let offset = (i / (colors.length - 1));
            gradient.append("svg:stop")
                .attr("offset", `${offset}`)
                .attr("stop-color", colors[i])
                .attr("stop-opacity", 1);
        }


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
            .attr("fill", "#dca65a")
            .attr("stroke", "#332301")
            .attr("stroke-width", 1)
            .attr("transform", "translate(58, 165)");

        const pointLabel = legend
            .append("text")
            .attr("transform", "translate(63, 155)")
            .selectAll("tspan")
            .data(["Location of", "Turbines"])
            .enter()
            .append("tspan")
            .attr("x", 15)
            .attr("dy", 15)
            .text(d => d);

        legend.attr("transform", "translate(" + FIRST_COL_DIMENSIONS.width * 0.8 + "," + ((FIRST_COL_DIMENSIONS.height / 2) - 90) + ")");
    }

    draw() {

        const width = FIRST_COL_DIMENSIONS.width;

        var svg = d3.select(this.visElement);
        var globalGroup = svg.append("g");

        // Create the projection
        // let projection = d3.geoAlbersUsa().fitWidth(width * 0.7, {type: "Sphere"});
        // let projection = d3.geoAlbersUsa().fitHeight(FIRST_COL_DIMENSIONS.height, {type: "Sphere"});
        let projection = d3.geoAlbersUsa().fitSize([FIRST_COL_DIMENSIONS.width, FIRST_COL_DIMENSIONS.height], this.mapData);

        // If the point is not within the frame of the projection, filter it out
        // This usually happens when the point is outside the US (in territories)
        this.turbineData = this.turbineData.filter(d => {
            let coords = projection([d.xlong, d.ylat]);
            return coords != null;
        });

        // Count how many turbines in each state
        let countByState = {}
        for (const turbineDatum of this.turbineData) {

            if (STATE_NAME_MAPPING[turbineDatum.t_state] in countByState) {
                countByState[STATE_NAME_MAPPING[turbineDatum.t_state]] += 1;

            } else {
                countByState[STATE_NAME_MAPPING[turbineDatum.t_state]] = 1;
            }
        }

        let maxCount = Math.max(...Object.values(countByState));
        let minCount = Math.min(...Object.values(countByState));

        let maxNumDigits = Math.floor(Math.log10(maxCount));
        let maxRoundedDown = maxCount / (10 ** maxNumDigits);
        let maxRounded = (Math.floor(maxRoundedDown) + 1) * (10 ** maxNumDigits);

        let minNumDigits = Math.floor(Math.log10(minCount));
        let minRoundedDown = minCount / (10 ** minNumDigits);
        let minRounded = (Math.floor(minRoundedDown)) * (10 ** minNumDigits);

        let range = [minRounded, maxRounded];

        // Draw data
        let mapBounds = this.drawMapAndTurbines(globalGroup, this.mapData, this.turbineData, projection, range, countByState);
        this.drawLegend(globalGroup, range, mapBounds);

        globalGroup.attr("transform", "translate(0, 30)");
    }


}

export {TurbineMapVisualization};
