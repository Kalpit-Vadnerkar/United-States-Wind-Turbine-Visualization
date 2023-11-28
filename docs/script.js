import {PieChartVisualization} from './PieChart.js';
import {drawHistogram} from './Histogram.js';
import {TimeSeriesVisualization} from "./TimeSeries.js";
import {TurbineMapVisualization} from "./Map.js";
import {ALL_VALUE, EXCLUDED_STATES, STATE_NAME_MAPPING} from "./Constants.js";


var mapViz = null;
var timeViz = null;
var pieViz = null;

function stateSelector_onSelect(e) {
    if (mapViz == null || timeViz == null || pieViz == null) {
        return false;
    }
    let stateSelector = document.getElementById("state-selector");

    mapViz.filterByState(stateSelector.value);
    mapViz.clear();
    mapViz.draw();

    timeViz.filterByState(stateSelector.value);
    timeViz.clear();
    timeViz.draw();

    pieViz.filterByState(stateSelector.value);
    pieViz.clear();
    pieViz.draw();

}

async function generateVisualization1(turbineData, mapData) {
    mapViz = new TurbineMapVisualization(turbineData, mapData);
    mapViz.draw();

}

async function generateVisualization2(turbineData) {
    timeViz = new TimeSeriesVisualization(turbineData);
    timeViz.draw();
}

async function generateVisualization3(turbineData) {
    pieViz = new PieChartVisualization(turbineData);
    pieViz.draw();
}

async function generateVisualization4(turbineData) {
    drawHistogram(turbineData);
}

function populateStateSelector() {
    let stateSelector = document.getElementById("state-selector");
    let allOption = document.createElement("option");

    allOption.text = ALL_VALUE;
    allOption.value = ALL_VALUE;
    allOption.selected = true;
    stateSelector.appendChild(allOption);

    for (const state of Object.keys(STATE_NAME_MAPPING)) {
        if (!EXCLUDED_STATES.includes(state)) {
            let option = document.createElement("option");
            option.text = STATE_NAME_MAPPING[state];
            option.value = state;
            stateSelector.appendChild(option);
        }
    }

    stateSelector.addEventListener("change", stateSelector_onSelect);


}

function populateManufacturerSelector(turbineData) {
    let manufacturerSelector = document.getElementById("manufacturer-selector");
    let allOption = document.createElement("option");
    allOption.text = ALL_VALUE;
    allOption.value = ALL_VALUE;
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
    console.log("Done");
}


main();
