import {drawPieChart} from './PieChart.js';
import {drawHistogram} from './Histogram.js';
import {drawTimeSeries} from "./TimeSeries.js";
import {drawMap} from "./Map.js";


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


async function main() {
    // Load data
    var turbineData = await d3.csv("uswtdb_v6_0_20230531.csv");
    var mapData = await d3.json("gz_2010_us_040_00_500k.json");

    generateVisualization1(turbineData, mapData);
    generateVisualization2(turbineData);
    generateVisualization3(turbineData);
    generateVisualization4(turbineData);
}


main();
