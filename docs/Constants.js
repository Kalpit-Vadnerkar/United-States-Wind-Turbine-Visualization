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

const STATE_NAME_MAPPING2 = {
   "Alabama":  "AL",
   "Alaska":  "AK",
   "Arizona":  "AZ",
   "Arkansas":  "AR",
   "California":  "CA",
   "Colorado":  "CO",
   "Connecticut":  "CT",
   "Delaware":  "DE",
   "Florida":  "FL",
   "Georgia":  "GA",
   "Hawaii":  "HI",
   "Idaho":  "ID",
   "Illinois":  "IL",
   "Indiana":  "IN",
   "Iowa":  "IA",
   "Kansas":  "KS",
   "Kentucky":  "KY",
   "Louisiana":  "LA",
   "Maine":  "ME",
   "Maryland":  "MD",
   "Massachusetts":  "MA",
   "Michigan":  "MI",
   "Minnesota":  "MN",
   "Mississippi":  "MS",
   "Missouri":  "MO",
   "Montana":  "MT",
   "Nebraska":  "NE",
   "Nevada":  "NV",
   "New Hampshire":  "NH",
   "New Jersey":  "NJ",
   "New Mexico":  "NM",
   "New York":  "NY",
   "North Carolina":  "NC",
   "North Dakota":  "ND",
   "Ohio":  "OH",
   "Oklahoma":  "OK",
   "Oregon":  "OR",
   "Pennsylvania":  "PA",
   "Rhode Island":  "RI",
   "South Carolina":  "SC",
   "South Dakota":  "SD",
   "Tennessee":  "TN",
   "Texas":  "TX",
   "Utah":  "UT",
   "Vermont":  "VT",
   "Virginia":  "VA",
   "Washington":  "WA",
   "West Virginia":  "WV",
   "Wisconsin":  "WI",
   "Wyoming" : "WY"
};

const EXCLUDED_STATES = ["KY", "SC", "FL", "GA", "LA", "AL", "MS", undefined]; // No data for these states

const ALL_VALUE = "---ALL---";

const FIRST_COL_DIMENSIONS = {
    width: 1200, height: 330,
    margin: {
        top: 15, bottom: 15, right: 50, left: 50
    }
};


const SECOND_COL_DIMENSIONS = {
    width: 600, height: 330,
    margin: {
        top: 15, bottom: 15, right: 50, left: 50
    }
};

const VIZ_TITLE_STYLE = "font-size: 20px; text-decoration: underline;";

const NUM_BINS = 60;
export {STATE_NAME_MAPPING,STATE_NAME_MAPPING2, EXCLUDED_STATES, FIRST_COL_DIMENSIONS, SECOND_COL_DIMENSIONS, VIZ_TITLE_STYLE, ALL_VALUE, NUM_BINS};

