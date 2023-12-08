import {ALL_VALUE} from "./Constants.js";
import globalEventManager from "./EventManager.js";

class Visualization {
    constructor(turbineData) {
        this.visElement = "";
        this.turbineData = turbineData;
        // this.originalTurbineData = turbineData;
        this.selectedState = ALL_VALUE;
        this.selectedManufacturer = ALL_VALUE;

        globalEventManager.subscribe("stateSelected", (event, data) => {
            this.filterByState(data.newSelectedState);
            // this.clear();
            // this.draw();
        });
        globalEventManager.subscribe("manufacturerSelected", (event, data) => {
            this.filterByManufacturer(data.newSelectedManufacturer);
            // this.clear();
            // this.draw();
        });
    }


    draw() {

    }

    clear() {
        d3.select(this.visElement).selectAll("*").remove();
    }

    filterByState(state) {
        this.selectedState = state;
        // this.turbineData = this.originalTurbineData;
        // this.selectedState = state;
        //
        // if (this.selectedManufacturer !== ALL_VALUE) {
        //     this.turbineData = this.turbineData.filter(d => {
        //         return d.t_manu === this.selectedManufacturer;
        //     });
        // }
        //
        // if (state !== ALL_VALUE) {
        //     this.turbineData = this.turbineData.filter(d => {
        //         return d.t_state === state;
        //     });
        // }
    }

    filterByManufacturer(manufacturer) {
        // this.turbineData = this.originalTurbineData;
        // this.selectedManufacturer = manufacturer;
        //
        // if (this.selectedState !== ALL_VALUE) {
        //     this.turbineData = this.turbineData.filter(d => {
        //         return d.t_state === this.selectedState;
        //     });
        // }
        // if (manufacturer !== ALL_VALUE) {
        //     this.turbineData = this.turbineData.filter(d => {
        //         return d.t_manu === manufacturer;
        //     });
        // }

        this.selectedManufacturer = manufacturer;
    }


}

export {Visualization};
