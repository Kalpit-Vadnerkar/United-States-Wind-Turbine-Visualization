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
    // Define margins, width, and height as required
    const margin = {top: 10, right: 30, bottom: 30, left: 40};
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    drawHistogram(turbineData, margin, width, height);
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
