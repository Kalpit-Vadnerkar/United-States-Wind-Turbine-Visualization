// Constants.js
const STATE_NAME_MAPPING = {
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
};
const EXCLUDED_STATES = ["KY", "SC", "FL", "GA", "LA", "AL", "MS"]; // No data for these states

const ALL_VALUE = "---ALL---";

const FIRST_COL_DIMENSIONS = {
    width: 1200, height: 370,
    margin: {
        top: 30, bottom: 30, right: 50, left: 50
    }
};


const SECOND_COL_DIMENSIONS = {
    width: 600, height: 370,
    margin: {
        top: 30, bottom: 30, right: 50, left: 50
    }
};

const VIZ_TITLE_STYLE = "font-size: 20px; text-decoration: underline;";


export {STATE_NAME_MAPPING, EXCLUDED_STATES, FIRST_COL_DIMENSIONS, SECOND_COL_DIMENSIONS, VIZ_TITLE_STYLE, ALL_VALUE};

