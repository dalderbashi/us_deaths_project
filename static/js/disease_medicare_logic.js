//diseases map
// Creating map object
var diseaseMap = L.map("disease_map", {
    center: [39.8283, -98.5795],

    zoom: 3
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
}).addTo(diseaseMap);



// Load in geojson map data
var url = "./output/natural_deaths_medicare.json";

const state = {
    selectedYear: 2017,
    selectedCause: "All causes",
    data: null,
    activeLayer: null,
    activeLegend: null,
    selectedYearMedicare: 2014,
    activeLayerMedicare: null,
    activeLegendMedicare: null
}

function createLayer() {
    const filteredData = {
        ...state.data,
        features: state.data.features.filter(feature =>
            feature.properties.Year === state.selectedYear &&
            feature.properties["Cause Name"] === state.selectedCause)
    }

    console.log(filteredData);


    // Create a new choropleth layer
    let mapLayer = L.choropleth(filteredData, {

        // Define what  property in the features to use
        valueProperty: "normalized_deaths",

        // Set color scale

        scale: ["#FCE4EC", "#880E4F"],

        // Number of breaks in step range
        steps: 20,

        // q for quartile, e for equidistant, k for k-means
        mode: "k",
        style: {
            // Border color
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8
        },

        onEachFeature: function(feature, layer) {
            layer.bindPopup("State: " + feature.properties.State + "<br> Total Deaths:<br>" +
                +feature.properties.Deaths);

        }

    });

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = mapLayer.options.limits;
        var colors = mapLayer.options.colors;
        var labels = [];

        // Add min & max
        var legendInfo = "<h6>Deaths per 100,000 people</h6>" +
            "<div class=\"labels\">" +

            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    mapLayer.addTo(diseaseMap);
    legend.addTo(diseaseMap);
    state.activeLayer = mapLayer;
    state.activeLegend = legend;
}


// Grab data with d3
d3.json(url, function(data) {
    console.log(data)
    state.data = data
    createLayer();
    createLayerMedicare();
});

d3.select("#sel-year")
    .on("change", function() {
        let newYear = parseInt(d3.event.target.value)
        state.selectedYear = newYear
        state.activeLayer.remove()
        state.activeLegend.remove()
        createLayer()
    });

d3.select("#sel-cause")
    .on("change", function() {
        let newCause = d3.event.target.value
        state.selectedCause = newCause
        state.activeLayer.remove()
        state.activeLegend.remove()
        createLayer()
    });

//medicare map  

// Creating map object
var medicareMap = L.map("medicare_map", {
    center: [39.8283, -98.5795],

    zoom: 3
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
}).addTo(medicareMap);


function createLayerMedicare() {
    const stateSet = new Set()
    const filteredData = {
        ...state.data,
        features: state.data.features.filter(feature => {
            if (stateSet.has(feature.properties.State + feature.properties.Year)) {
                return false
            }
            stateSet.add(feature.properties.State + feature.properties.Year)
            return feature.properties.Year === state.selectedYearMedicare
        })
    };

    console.log(filteredData);

    // Create a new choropleth layer
    let mapLayer = L.choropleth(filteredData, {

        // Define what  property in the features to use
        valueProperty: "normalized_medicare_spending",

        // Set color scale

        scale: ["#EDE7F6", "#311B92"],

        // Number of breaks in step range
        steps: 20,

        // q for quartile, e for equidistant, k for k-means
        mode: "k",
        style: {
            // Border color
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8
        },

        onEachFeature: function(feature, layer) {
            layer.bindPopup("State: " + feature.properties.State + "<br> Medicare Spending (Millions):<br>" +
                +feature.properties["Total Medicare Spending by Residence"]);

        }

    });

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = mapLayer.options.limits;
        var colors = mapLayer.options.colors;
        var labels = [];

        // Add min & max
        var legendInfo = "<h6> Medicare Spending (Millions) per 100,000 people</h6>" +
            "<div class=\"labels\">" +

            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    mapLayer.addTo(medicareMap);
    legend.addTo(medicareMap);
    state.activeLayerMedicare = mapLayer;
    state.activeLegendMedicare = legend;
}


d3.select("#sel-year-medicare")
    .on("change", function() {
        let newYear = parseInt(d3.event.target.value)
        state.selectedYearMedicare = newYear
        state.activeLayerMedicare.remove()
        state.activeLegendMedicare.remove()
        createLayerMedicare()

    });