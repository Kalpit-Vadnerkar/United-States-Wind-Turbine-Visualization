// TimeSeries.js
function drawTimeSeries(turbineData) {

    let element = document.getElementById("viz2");

    const width = element.clientWidth;
    const height = element.clientHeight;
    let dimensions = {
        width: width, height: 500,
        margin: {
            top: 30, bottom: 30, right: 10, left: 50
        }
    };


    var svg = d3.select("#viz2");

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
        .attr("transform", "translate(0," + (dimensions.height - dimensions.margin.bottom) + ")")
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
        .attr("x", dimensions.width / 2 + dimensions.margin.left)
        .attr("y", dimensions.height + 10)
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

export {drawTimeSeries};