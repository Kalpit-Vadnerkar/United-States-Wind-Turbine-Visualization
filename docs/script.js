import {drawPieChart} from './PieChart.js';
import {drawHistogram} from './Histogram.js';
import {drawTimeSeries} from "./TimeSeries.js";
import {drawMap} from "./Map.js";
import {STATE_NAME_MAPPING} from "./Constants.js";


function generateVisualization1(turbineData, mapData) {
    drawMap(turbineData, mapData);

}

function generateVisualization2(turbineData) {
    drawTimeSeries(turbineData);
}

function generateVisualization3(turbineData) {
    drawPieChart(turbineData);
}

function generateVisualization4(turbineData) {
    drawHistogram(turbineData);
}

function populateStateSelector() {
    let stateSelector = document.getElementById("state-selector");
    let allOption = document.createElement("option");

    allOption.text = "---All---";
    allOption.value = "ALL";
    allOption.selected = true;
    stateSelector.appendChild(allOption);

    for (const state of Object.keys(STATE_NAME_MAPPING)) {
        let option = document.createElement("option");
        option.text = STATE_NAME_MAPPING[state];
        option.value = state;
        stateSelector.appendChild(option);
    }
}

function populateManufacturerSelector(turbineData) {
    let manufacturerSelector = document.getElementById("manufacturer-selector");
    let allOption = document.createElement("option");
    allOption.text = "---All---";
    allOption.value = "ALL";
    allOption.selected = true;
    manufacturerSelector.appendChild(allOption);

    let manufacturerCount = {};
    for (const datum of turbineData) {
        if (datum.t_manu === null || datum.t_manu.trim() === "") {
            continue;
        }
        if (datum.t_manu in manufacturerCount) {
            manufacturerCount[datum.t_manu] += 1;
        } else {
            manufacturerCount[datum.t_manu] = 1;
        }
    }

    for (const manufacturer of Object.keys(manufacturerCount)) {
        let option = document.createElement("option");
        option.text = manufacturer;
        option.value = manufacturer;
        manufacturerSelector.appendChild(option);
    }
}

async function main() {
    // Load data
    console.log("Loading data");
    var turbineData = await d3.csv("uswtdb_v6_0_20230531.csv");
    var mapData = await d3.json("gz_2010_us_040_00_500k.json");

    console.log("Setting up");
    populateStateSelector();
    populateManufacturerSelector(turbineData);


    console.log("Visualizing");
    generateVisualization1(turbineData, mapData);
    generateVisualization2(turbineData);
    generateVisualization3(turbineData);
    generateVisualization4(turbineData);
}


main();
