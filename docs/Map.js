// Map.js
import {
    ALL_VALUE, EXCLUDED_STATES, FIRST_COL_DIMENSIONS, STATE_NAME_MAPPING, STATE_NAME_MAPPING2, VIZ_TITLE_STYLE
} from "./Constants.js";
import {Visualization} from "./Visualization.js";
import globalEventManager from "./EventManager.js";

const ZOOM_TURBINE_LEVEL = 8;
const TURBINE_VALID_SELECTION_COLOR = "rgb(231,6,221)";
const TURBINE_INVALID_SELECTION_COLOR = "rgb(172,141,194)";
const PROJECT_VALID_SELECTION_COLOR = "rgb(220, 166, 90)";
const PROJECT_INVALID_SELECTION_COLOR = "rgb(206,188,182)";
const TRANSPARENT_COLOR = "rgba(0,0,0,0)";
const STROKE_COLOR = "rgb(51,35,1)";

function getAvgPosition(datalist) {
    return [d3.mean(datalist, d => d.xlong), d3.mean(datalist, d => d.ylat)];
}

// const colors = ["#0d9d8c", "#e3c03f", "#a18b26", "#96e82c"];
const colors = d3.interpolateReds;


class TurbineMapVisualization extends Visualization {
    constructor(turbineData, mapData) {
        super();
        this.turbineData = turbineData;
        // this.originalTurbineData = turbineData;

        this.mapData = mapData;
        this.visElement = "#viz1";
        this.globalTransform = {k: 1, x: 0, y: 0};
        this.globalTransform = d3.zoomIdentity;
        this.colorScale = null;
        this.calculate();


    }

    drawMapAndTurbines(svg, projection, range) {
        const characterWidth = 9;
        let mapGroup = svg.append("g").attr("id", "map");
        let pathGenerator = d3.geoPath(projection);
        this.pathGenerator = pathGenerator;
        let path = mapGroup.append("path")
            .attr("id", "map-background")
            .attr("d", pathGenerator({type: "Sphere"}))
            .attr("stroke", "gray")
            .attr("fill", "lightblue");
        let mapBounds = pathGenerator.bounds(this.mapData)


        if (typeof colors == 'function') this.colorScale = d3.scaleSequential(colors).domain(range); else this.colorScale = d3.scaleLinear().domain(range).range(colors);


        this.states = mapGroup.append("g")
            .selectAll(".state")
            .data(this.mapData.features)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("id", d => "map-state-" + STATE_NAME_MAPPING2[d.properties.NAME])
            .attr("stroke", "lightgray")
            .attr("stroke-width", 1)
            .attr("fill", d => {

                if (!EXCLUDED_STATES.includes(STATE_NAME_MAPPING2[d.properties.NAME])) {
                    let c = this.colorScale(this.countByState[STATE_NAME_MAPPING2[d.properties.NAME]]);
                    if (this.selectedState === ALL_VALUE || STATE_NAME_MAPPING2[d.properties.NAME] === this.selectedState) {
                        return c;
                    }
                    return c.replace("rbg", "rbga").replace(")", ", 0.5)");
                }
                return "darkgray";
            })
            .attr("d", d => pathGenerator(d));


        // Select the tooltip div
        this.states
            .on("mouseover", (d, i) => {
                let tooltip = d3.select("#tooltip");

                tooltip.transition()
                    .style("opacity", .9);

                tooltip.attr("transform", "translate(" + d.offsetX + "," + d.offsetY + ")");

                let stateLabel = "State: " + i.properties.NAME;
                let quantityLabel = "Turbines: No Data";
                tooltip.selectAll("#map-tooltip-state").text(stateLabel);

                if (!EXCLUDED_STATES.includes(STATE_NAME_MAPPING2[i.properties.NAME])) quantityLabel = "Turbines: " + this.countByState[STATE_NAME_MAPPING2[i.properties.NAME]];
                tooltip.selectAll("#map-tooltip-quantity").text(quantityLabel);

                this.states.select("#map-state-" + STATE_NAME_MAPPING2[i.properties.NAME]).attr("stroke", "black").attr("stroke-width", 1);
                tooltip.select("rect").attr("width", Math.max(stateLabel.length * characterWidth, quantityLabel.length * characterWidth));
            })
            .on("mouseout", (d, i) => {
                let tooltip = d3.select("#tooltip");

                tooltip.transition()
                    .style("opacity", 0);
                this.states.select("#map-state-" + STATE_NAME_MAPPING2[i.properties.NAME]).attr("stroke", "lightgray").attr("stroke-width", 1);
            })
            .on("click", (d, i) => {
                let selectedState = STATE_NAME_MAPPING2[i.properties.NAME];
                globalEventManager.dispatch("stateSelected", {
                    newSelectedState: selectedState, oldSelectedState: this.selectedState
                });
            });


        let turbineSizeScale = d3.scaleSqrt()
            .domain([d3.min(this.turbineData, d => d.p_cap), d3.max(this.turbineData, d => d.p_cap)])
            .range([1, 5]); // min and max size of circles


        this.projectPoints = mapGroup.append("g").attr("id", "project-points")
            .selectAll(".project-point")
            .data(this.projects)
            .enter()
            .append("circle")
            // .attr("class", d => "point point-" + d.t_state)
            .attr("r", d => turbineSizeScale(d[1].length))
            .attr("fill", d => {

                let projects = d[1];
                let states = projects.map(x => x.t_state);
                let manufs = projects.map(x => x.t_manu);

                if (this.globalTransform.k < ZOOM_TURBINE_LEVEL) {
                    if (this.selectedState === ALL_VALUE || states.includes(this.selectedState)) {
                        if (this.selectedManufacturer === ALL_VALUE || manufs.includes(this.selectedManufacturer)) {
                            return PROJECT_VALID_SELECTION_COLOR;
                        }
                    }
                    return PROJECT_INVALID_SELECTION_COLOR;
                }
                return TRANSPARENT_COLOR;
            })
            .attr("stroke", STROKE_COLOR)
            .attr("stroke-width", 1 / this.globalTransform.k)
            .attr('transform', d => {
                let pos = getAvgPosition(d[1]);
                pos = projection(pos);
                return "translate(" + pos + ")";
            });

        this.projectPoints
            .on("mouseover", (d, i) => {
                let projectName = i[0]
                let projects = i[1];
                let tooltip = d3.select("#tooltip");

                tooltip.transition()
                    .style("opacity", .9);

                let projectLabel = "Project Name: " + projectName;
                let numProjectLabel = "No. of Turbines: " + projects.length;
                tooltip.attr("transform", "translate(" + d.offsetX + "," + d.offsetY + ")");

                tooltip.selectAll("#map-tooltip-state").text(projectLabel);
                tooltip.selectAll("#map-tooltip-quantity").text(numProjectLabel);

                tooltip.select("rect").attr("width", projectName.length * characterWidth);
                tooltip.select("rect").attr("width", Math.max(projectLabel.length * characterWidth, numProjectLabel.length * characterWidth));


            })
            .on("mouseout", (d, i) => {
                let tooltip = d3.select("#tooltip");
                tooltip.attr("opacity", 0);

            });


        this.turbinePoints = mapGroup.append("g")
            .attr("id", "turbine-points");

        let title = `Proliferation of ${this.selectedManufacturer === ALL_VALUE ? "" : this.selectedManufacturer} Turbines in ${this.selectedState === ALL_VALUE ? "the USA" : STATE_NAME_MAPPING[this.selectedState]}`;
        mapGroup.append("text").attr("class", "map-title")
            .attr("x", FIRST_COL_DIMENSIONS.width / 2)
            .attr("y", -15)
            .attr("style", VIZ_TITLE_STYLE)
            .attr("text-anchor", "middle")
            .text(title);

        return mapBounds;
    }


    filterByState(state) {
        super.filterByState(state);

        if (this.states != null) this.states.transition()
            .attr("fill", d => {
                if (!EXCLUDED_STATES.includes(STATE_NAME_MAPPING2[d.properties.NAME])) {
                    let c = this.colorScale(this.countByState[STATE_NAME_MAPPING2[d.properties.NAME]]);
                    if (this.selectedState === ALL_VALUE || STATE_NAME_MAPPING2[d.properties.NAME] === this.selectedState) {
                        return c;
                    }
                    return c.replace("rbg", "rbga").replace(")", ", 0.5)");
                }
                return "darkgray";
            });

        if (this.projectPoints != null) this.projectPoints.transition()
            .attr("fill", d => {
                let projects = d[1];
                let states = projects.map(x => x.t_state);
                let manufs = projects.map(x => x.t_manu);
                if (this.globalTransform.k < ZOOM_TURBINE_LEVEL) {
                    if (this.selectedState === ALL_VALUE || states.includes(this.selectedState)) {
                        if (this.selectedManufacturer === ALL_VALUE || manufs.includes(this.selectedManufacturer)) {
                            return PROJECT_VALID_SELECTION_COLOR;
                        }
                    }
                    return PROJECT_INVALID_SELECTION_COLOR;
                }
                return TRANSPARENT_COLOR;
            });

        this.turbinePoints.selectAll("*")
            .transition()
            .attr("fill", d => {
                // console.log(d)
                if (this.selectedState === ALL_VALUE || d.t_state === this.selectedState) {
                    if (this.selectedManufacturer === ALL_VALUE || d.t_manu === this.selectedManufacturer) {
                        return TURBINE_VALID_SELECTION_COLOR;
                    }
                }
                return TURBINE_INVALID_SELECTION_COLOR;

            })
            .attr("r", 1 / this.globalTransform.k);

        let title = `Proliferation of ${this.selectedManufacturer === ALL_VALUE ? "" : this.selectedManufacturer} Turbines in ${this.selectedState === ALL_VALUE ? "the USA" : STATE_NAME_MAPPING[this.selectedState]}`;
        d3.select(".map-title").transition()
            .text(title);
    }

    filterByManufacturer(manufacturer) {
        super.filterByManufacturer(manufacturer);

        if (this.states != null) this.states.transition()
            .attr("fill", d => {
                if (!EXCLUDED_STATES.includes(STATE_NAME_MAPPING2[d.properties.NAME])) {
                    let c = this.colorScale(this.countByState[STATE_NAME_MAPPING2[d.properties.NAME]]);
                    if (this.selectedState === ALL_VALUE || STATE_NAME_MAPPING2[d.properties.NAME] === this.selectedState) {
                        return c;
                    }
                    return c.replace("rbg", "rbga").replace(")", ", 0.5)");
                }
                return "darkgray";
            });

        if (this.projectPoints != null) this.projectPoints.transition()
            .attr("fill", d => {
                let projects = d[1];
                let states = projects.map(x => x.t_state);
                let manufs = projects.map(x => x.t_manu);
                if (this.globalTransform.k < ZOOM_TURBINE_LEVEL) {
                    if (this.selectedState === ALL_VALUE || states.includes(this.selectedState)) {
                        if (this.selectedManufacturer === ALL_VALUE || manufs.includes(this.selectedManufacturer)) {
                            return PROJECT_VALID_SELECTION_COLOR;
                        }
                    }
                    return PROJECT_INVALID_SELECTION_COLOR;
                }
                return TRANSPARENT_COLOR;
            });

        this.turbinePoints.selectAll("*")
            .transition()
            .attr("fill", d => {
                // console.log(d)
                if (this.selectedState === ALL_VALUE || d.t_state === this.selectedState) {
                    if (this.selectedManufacturer === ALL_VALUE || d.t_manu === this.selectedManufacturer) {
                        return TURBINE_VALID_SELECTION_COLOR;
                    }
                }
                return TURBINE_INVALID_SELECTION_COLOR;

            })
            .attr("r", 1 / this.globalTransform.k);

        let title = `Proliferation of ${this.selectedManufacturer === ALL_VALUE ? "" : this.selectedManufacturer} Turbines in ${this.selectedState === ALL_VALUE ? "the USA" : STATE_NAME_MAPPING[this.selectedState]}`;
        d3.select(".map-title").transition()
            .text(title);

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

        const numStops = 5;
        let diff = range[1] - range[0];
        let factor = diff / numStops;
        for (let i = 0; i <= numStops; i++) {
            let offset = i / numStops;
            let c = this.colorScale(i * factor + range[0]);
            gradient.append("svg:stop")
                .attr("offset", offset)
                .attr("stop-color", c)
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
            .attr("height", 240)
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
            .data(["Number of", "Turbines"])
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
        const projectPointLegend = legend
            .append("g")
            .selectAll("circle")
            .data([1])
            .enter()
            .append("circle")
            .attr("class", "legend-project-point")
            .attr("r", 10)
            .attr("fill", PROJECT_VALID_SELECTION_COLOR)
            .attr("stroke", STROKE_COLOR)
            .attr("stroke-width", 3)
            .attr("transform", "translate(58, 165)");

        const projectPointLabel = legend
            .append("text")
            .attr("transform", "translate(63, 155)")
            .selectAll("tspan")
            .data(["Location of", "Turbines Projects"])
            .enter()
            .append("tspan")
            .attr("x", 15)
            .attr("dy", 15)
            .text(d => d);

        const turbinePointLegend = legend
            .append("g")
            .selectAll("circle")
            .data([1])
            .enter()
            .append("circle")
            .attr("class", "legend-turbine-point")
            .attr("r", 7)
            .attr("fill", TURBINE_VALID_SELECTION_COLOR)
            .attr("transform", "translate(58, 205)");

        const turbinePointLabel = legend
            .append("text")
            .attr("transform", "translate(63, 195)")
            .selectAll("tspan")
            .data(["Location of", "Turbines"])
            .enter()
            .append("tspan")
            .attr("x", 15)
            .attr("dy", 15)
            .text(d => d);

        legend.attr("transform", "translate(" + FIRST_COL_DIMENSIONS.width * 0.8 + "," + ((FIRST_COL_DIMENSIONS.height / 2) - 90) + ")");
    }

    drawTooltip(svg) {
        let tooltip = svg.append("g")
            .attr("id", "tooltip")
            .style("opacity", 0);
        tooltip
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 170)
            .attr("height", 50)
            .attr("stroke", "black")
            .attr("fill", "white")
            .attr("opacity", 0.9)
            .attr("rx", "5px")
            .attr("ry", "5px");
        tooltip
            .append("text")
            .attr("id", "map-tooltip-state")
            .attr("x", 5)
            .attr("y", 20);
        tooltip
            .append("text")
            .attr("id", "map-tooltip-quantity")
            .attr("x", 5)
            .attr("y", 45);
    }


    calculate() {

        this.projects = d3.group(this.turbineData, d => d.p_name);
        this.dataByState = d3.group(this.turbineData, d => d.t_state);
        this.countByState = {};
        for (const state of [...this.dataByState.keys()]) {
            this.countByState[state] = this.dataByState.get(state).length;
        }
    }


    zoom() {

        d3.select("#turbine-points").selectAll("*").remove();

        if (this.globalTransform.k > ZOOM_TURBINE_LEVEL) {
            // Filter data based on the spacial location of the current zoom level
            let filtered = this.turbineData.filter(d => {
                let n = d3.select("#map-background").node().getBBox();
                let corner1 = [n.x, n.y];
                let corner2 = [n.x + n.width, n.y + n.height];
                let p_corner1 = this.globalTransform.invert(corner1);
                let p_corner2 = this.globalTransform.invert(corner2);
                let p = this.projection([d.xlong, d.ylat]);
                let inBounds = p[0] >= p_corner1[0] && p[0] <= p_corner2[0] && p[1] >= p_corner1[1] && p[1] <= p_corner2[1];
                return inBounds;
            });

            // Draw points
            d3.select("#turbine-points")
                .selectAll(".turbine")
                .data(filtered)
                .enter()
                .append("circle")
                .attr("fill", d => {
                    if (this.selectedState === ALL_VALUE || d.t_state === this.selectedState) {
                        if (this.selectedManufacturer === ALL_VALUE || d.t_manu === this.selectedManufacturer) {
                            return TURBINE_VALID_SELECTION_COLOR;
                        }
                    }
                    return TURBINE_INVALID_SELECTION_COLOR;
                })
                .attr("r", 1 / this.globalTransform.k)
                .attr('transform', d => {
                    let coord = this.projection([d.xlong, d.ylat]);
                    return "translate(" + coord + ")";
                });


        }
        // Fill legend project point based on zoom level
        d3.selectAll(".legend-project-point")
            .transition()
            .attr("fill", d => {
                if (this.globalTransform.k < ZOOM_TURBINE_LEVEL) {
                    return PROJECT_VALID_SELECTION_COLOR;
                }
                return TRANSPARENT_COLOR;
            });
        // Fill project points based on zoom level
        this.projectPoints.transition()
            .attr("fill", d => {
                let projects = d[1];
                let states = projects.map(x => x.t_state);
                let manufs = projects.map(x => x.t_manu);

                if (this.globalTransform.k < ZOOM_TURBINE_LEVEL) {
                    if (this.selectedState === ALL_VALUE || states.includes(this.selectedState)) {
                        if (this.selectedManufacturer === ALL_VALUE || manufs.includes(this.selectedManufacturer)) {
                            return PROJECT_VALID_SELECTION_COLOR;
                        }
                    }
                    return PROJECT_INVALID_SELECTION_COLOR;
                }
                return TRANSPARENT_COLOR;
            })
            .attr("stroke-width", 1 / this.globalTransform.k);
    }

    draw() {

        const width = FIRST_COL_DIMENSIONS.width;

        // Define zoom behavior
        let zoom = d3.zoom()
            .scaleExtent([1, 15])  // Set min and max scale extent
            .translateExtent([[0, 0], [width, FIRST_COL_DIMENSIONS.height]])
            .on("zoom", (event) => {
                this.globalTransform = event.transform;
                d3.select("#map").attr("transform", this.globalTransform);
                this.zoom();
            });

        // Apply zoom behavior to the SVG
        let svg = d3.select(this.visElement).call(zoom);
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

        this.projection = projection;

        let maxCount = Math.max(...Object.values(this.countByState));
        let minCount = Math.min(...Object.values(this.countByState));

        let maxNumDigits = Math.floor(Math.log10(maxCount));
        let maxRoundedDown = maxCount / (10 ** maxNumDigits);
        let maxRounded = (Math.floor(maxRoundedDown) + 1) * (10 ** maxNumDigits);

        let minNumDigits = Math.floor(Math.log10(minCount));
        let minRoundedDown = minCount / (10 ** minNumDigits);
        let minRounded = (Math.floor(minRoundedDown)) * (10 ** minNumDigits);

        let range = [minRounded, maxRounded];

        // Draw data
        let mapBounds = this.drawMapAndTurbines(globalGroup, projection, range);
        this.drawLegend(globalGroup, range, mapBounds);
        this.drawTooltip(globalGroup);

        globalGroup.attr("transform", "translate(0, 30)");
    }


}

export {
    TurbineMapVisualization
};
