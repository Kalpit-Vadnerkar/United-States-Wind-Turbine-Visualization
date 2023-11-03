function generateVisualization1() {
    var width = 975;
    var height = 610;
    var size = 800;

    var svg = d3.select("#viz1")
        // .attr("width", width)
        .attr("height", height);

    d3.json("gz_2010_us_040_00_500k.json").then(mapdata => {

        let projection = d3.geoAlbersUsa().fitWidth(size, {type: "Sphere"});

        let pathGenerator = d3.geoPath(projection);
        let path = svg.append("path")
            .attr("d", pathGenerator({type: "Sphere"}))
            .attr("stroke", "gray")
            .attr("fill", "lightblue");


        let graticule = svg.append("path")
            .attr("d", pathGenerator(d3.geoGraticule10()))
            .attr("stroke", "gray")
            .attr("fill", "none");

        let state = svg.append("g")
            .selectAll(".state")
            .data(mapdata.features)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("d", d => pathGenerator(d))

    })


}

function generateVisualization2() {

}

function generateVisualization3() {

}

function generateVisualization4() {

}

// document.addEventListener('DOMContentLoaded', function () {
//
// });
generateVisualization1();
generateVisualization2();
generateVisualization3();
generateVisualization4();