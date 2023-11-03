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

function generateVisualization1() {
    let element = document.getElementById("viz1");

    var width = element.clientWidth;
    var height = element.clientHeight;


    var svg = d3.select("#viz1").attr("width", width).attr("height", height);

    d3.csv("uswtdb_v6_0_20230531.csv").then(turbineData => {
            d3.json("gz_2010_us_040_00_500k.json").then(mapData => {


                // First, count how many turbines in each state
                countByState = {}
                for (const turbineDatum of turbineData) {

                    let amount = Number(turbineDatum.p_tnum);
                    if (turbineDatum.t_state in countByState) {
                        countByState[stateNameMapping[turbineDatum.t_state]] += amount;

                    } else {
                        countByState[stateNameMapping[turbineDatum.t_state]] = amount;

                    }
                }
                let maxCount = -9999;
                let minCount = 9999;

                for (const state of Object.keys(countByState)) {
                    maxCount = Math.max(countByState[state], maxCount);
                    minCount = Math.min(countByState[state], minCount);

                }


                let projection = d3.geoAlbersUsa().fitWidth(width * 0.7, {type: "Sphere"});

                let pathGenerator = d3.geoPath(projection);
                let path = svg.append("path")
                    .attr("d", pathGenerator({type: "Sphere"}))
                    .attr("stroke", "gray")
                    .attr("fill", "lightblue");


                // let graticule = svg.append("path")
                //     .attr("d", pathGenerator(d3.geoGraticule10()))
                //     .attr("stroke", "gray")
                //     .attr("fill", "none");
                // let colorScale = d3.scaleOrdinal().domain(keys).range(["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"]);
                let colorScale = d3.scaleLinear().domain([minCount, maxCount]).range(["#f3bdb8", "#5bb1ff"]);

                let state = svg.append("g")
                    .selectAll(".state")
                    .data(mapData.features)
                    .enter()
                    .append("path")
                    .attr("class", "state")
                    .attr("stroke", "lightgray")
                    .attr("fill", d => {
                        if (countByState[d.properties.NAME] != null)
                            return colorScale(countByState[d.properties.NAME]);
                        return "darkgray"
                    })
                    .attr("d", d => pathGenerator(d))

                let points = svg.append("g")
                    .selectAll(".point")
                    .data(turbineData)
                    .enter()
                    .append("circle")
                    .attr("r", 2)
                    .attr("fill", "green")
                    .attr("transform", d => {
                        return "translate(" + projection([d.xlong, d.ylat]) + ")";
                    });


            })

        }
    )


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