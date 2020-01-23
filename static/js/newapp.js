// var path = "samples.json"
// var dataSamples = JSON.parse(path)
// console.log(dataSamples)

// See if the data is loading correctly
var data = d3.json("samples.json").then((importedData) => {
    console.log(importedData);
    return importedData;
});
console.log(data);

// Add options to the drop down menue
function addOptions() {
    var grab = d3.select("#selDataset");
    d3.json("samples.json").then((options) => {
        var samplenames = options.names;
        console.log(samplenames);
        samplenames.forEach((sample) => {
            grab.append("option")
                .text(sample)
                .property("value", sample)
        });
    });
};

// Run addOptions function
addOptions();

// Add a function to build the visuals for the page
function buildVisuals(sample) {
    d3.json("samples.json").then((data) => {
        // Slice and filer the data from Samples
        var allSamples = data.samples;
        var sampleArray = allSamples.filter(sampleObject => sampleObject.id == sample);
        var sampleData = sampleArray[0];

        var otu_ids = sampleData.otu_ids.slice(0,10).reverse();
        var otu_labels = sampleData.otu_labels.slice(0,10).reverse();
        var sample_values = sampleData.sample_values.slice(0,10).reverse();

        console.log(otu_ids);
        console.log(otu_labels);
        console.log(sample_values);

        // Add the horizontal bar chart
        var y_ticks = otu_ids.map(elem => 'OTU ' + elem)
        console.log(y_ticks)
        var barTrace = {
            y: y_ticks,
            x: sample_values,
            text: otu_labels,
            type: "bar",
            orientation: "h"
        };
        var barData = [barTrace];
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 50, l: 150}
        };
        Plotly.newPlot("bar", barData, barLayout);

        // Add the bubble chart
        var bubbleLayout = {
            tite: "Bacteria Cultures per Sample",
            margin: {t:0}, 
            hovermode: "closest",
            x_axis: {title: "OTU ID"},
            margin: {t:40} 
        };
        var bubbleTrace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Picnic"
            }};
        var bubbleData = [bubbleTrace];
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // Add the Metedata for the sample selected
        var Panel = d3.select("#sample-metadata")
        Panel.html("");
        var Allmetadata = data.metadata;
        var metadataArray = Allmetadata.filter(sampleObject => sampleObject.id == sample);
        var sampleMetadata = metadataArray[0];
        console.log(sampleMetadata);
        Object.entries(sampleMetadata).forEach(([key, value]) => {
            Panel.append("h6").text(`${key.toUpperCase()}: ${value}`)});
    });
};


// Initialize the page to show plots based on first sample
function init() {
    d3.json("samples.json").then((options) => {
        var samplenames = options.names;
        var initSample = samplenames[0];
        buildVisuals(initSample);
});
};

function optionChanged(newSample) {
    console.log(newSample)
    buildVisuals(newSample)
};


init();