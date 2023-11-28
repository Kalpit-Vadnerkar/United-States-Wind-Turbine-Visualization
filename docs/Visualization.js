import {ALL_VALUE} from "./Constants.js";

class Visualization {
    constructor(turbineData) {
        this.visElement = "";
        this.turbineData = turbineData;
        this.originalTurbineData = turbineData;
        this.selectedState = ALL_VALUE;
        this.selectedManufacturer = ALL_VALUE;
    }

    draw() {

    }

    clear() {
        d3.select(this.visElement).selectAll("*").remove();
    }

    filterByState(state) {
        this.turbineData = this.originalTurbineData;
        this.selectedState = state;

        if (this.selectedManufacturer !== ALL_VALUE) {
            this.turbineData = this.turbineData.filter(d => {
                return d.t_manu === this.selectedManufacturer;
            });
        }

        if (state !== ALL_VALUE) {
            this.turbineData = this.turbineData.filter(d => {
                return d.t_state === state;
            });
        }
    }

    filterByManufacturer(manufacturer) {
        this.turbineData = this.originalTurbineData;
        this.selectedManufacturer = manufacturer;

        if (this.selectedState !== ALL_VALUE) {
            this.turbineData = this.turbineData.filter(d => {
                return d.t_state === this.selectedState;
            });
        }
        if (manufacturer !== ALL_VALUE) {
            this.turbineData = this.turbineData.filter(d => {
                return d.t_manu === manufacturer;
            });
        }
    }
}

export {Visualization};