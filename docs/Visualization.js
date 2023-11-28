import {ALL_VALUE} from "./Constants.js";

class Visualization {
    constructor(turbineData) {
        this.visElement = "";
        this.turbineData = turbineData;
        this.originalTurbineData = turbineData;
    }

    draw() {

    }

    clear() {
        d3.select(this.visElement).selectAll("*").remove();
    }

    filterByState(state) {
        this.turbineData = this.originalTurbineData;

        if (state !== ALL_VALUE) {
            this.turbineData = this.turbineData.filter(d => {
                return d.t_state === state;
            });
        }
    }
}

export {Visualization};