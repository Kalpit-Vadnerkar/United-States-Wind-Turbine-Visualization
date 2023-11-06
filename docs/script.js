import { generateVisualization3 } from './PieChart.js';


const stateNameMapping = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "FL": "Florida",
    "GA": "Georgia",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}

function generateVisualization1(turbineData, mapData) {
    let element = document.getElementById("viz1");

    const width = element.clientWidth;
    const height = element.clientHeight;
    const colors = ["#26440e", "#66ff5b"];

    function drawLegend(svg, range) {
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

        legend.attr("transform", "translate(" + width * 0.7 + "," + ((height / 2) - 90) + ")");
    }


    function drawMapAndTurbines(svg, mapData, turbineData, projection, range) {


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
            .attr("x", width / 3)
            .attr("y", -6)
            .attr("class", "legend-title")
            .attr("font-size", "24px")
            .text("Proliferation of Wind Turbines in the USA");
    }

    var svg = d3.select("#viz1").attr("width", width).attr("height", height);
    var globalGroup = svg.append("g");

    // Create the projection
    let projection = d3.geoAlbersUsa().fitWidth(width * 0.7, {type: "Sphere"});

    // If the point is not within the frame of the projection, filter it out
    // This usually happens when the point is outside the US (in territories)
    turbineData = turbineData.filter(d => {
        let coords = projection([d.xlong, d.ylat]);
        return coords != null;
    });

    // Count how many turbines in each state
    let countByState = {}
    for (const turbineDatum of turbineData) {

        let amount = Number(turbineDatum.p_tnum);
        if (turbineDatum.t_state in countByState) {
            countByState[stateNameMapping[turbineDatum.t_state]] += amount;

        } else {
            countByState[stateNameMapping[turbineDatum.t_state]] = amount;

        }
    }
    let maxCount = Math.max(...Object.values(countByState));
    let minCount = Math.min(...Object.values(countByState));

    let range = [minCount, maxCount];

    // Draw data
    drawMapAndTurbines(globalGroup, mapData, turbineData, projection, range);
    drawLegend(globalGroup, range);

    globalGroup.attr("transform", "translate(0, 30)");


}

function generateVisualization2(turbineData) {


    let element = document.getElementById("viz2");

    const width = element.clientWidth;
    const height = element.clientHeight;
    let dimensions = {
        width: width, height: height, margin: {
            top: 30, bottom: 30, right: 10, left: 50
        }
    };



    var svg = d3.select("#viz2").attr("width", width).attr("height", height);

    var globalGroup = svg.append("g");
    let countByYear = {}
    for (const turbineDatum of turbineData) {
        let year = Number(turbineDatum.p_year);
        if (year == 0) continue; // Year is zero, ignore it
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
        .range([dimensions.margin.left, dimensions.width - dimensions.margin.right]);
    globalGroup.append("g")
        .attr("transform", "translate(0," + (height - dimensions.margin.bottom) + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain(yRange)
        .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);
    globalGroup.append("g")
        .attr("transform", "translate(" + dimensions.margin.left + ",0)")
        .call(d3.axisLeft(y));

    // Add the line
    globalGroup.append("path")
        .data([Object.entries(countByYear)])
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d[0]) + dimensions.margin.left)
            .y(d => y(d[1])));

    // Title
    globalGroup.append("g")
        .attr("transform", `translate(${(dimensions.width / 2) - dimensions.margin.left - 20},  ${dimensions.margin.top - 10})`)
        .append("text")
        .attr("font-size", "24px")
        .data(["Number of new turbine projects per year"])
        .text(d => d);

    globalGroup.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width / 2 + dimensions.margin.left)
        .attr("y", height + 10)
        .text("Year");

    globalGroup.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -dimensions.height / 2 + dimensions.margin.top)
        .attr("y", dimensions.margin.left - 40)
        .attr("transform", "rotate(-90)")
        .text("Amount");

    globalGroup.attr("transform", "translate(10," + dimensions.margin.top + ")");

}

function generateVisualization4() {

}

async function main() {
    // Load data
    var turbineData = await d3.csv("uswtdb_v6_0_20230531.csv");
    var mapData = await d3.json("gz_2010_us_040_00_500k.json");

    generateVisualization1(turbineData, mapData);
    generateVisualization2(turbineData);
    generateVisualization3(turbineData);
    generateVisualization4();
}


main();
