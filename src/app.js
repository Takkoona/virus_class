const d3 = require('d3');
const data = require('./data/virusInfo.json');

let scale = d3.scaleLinear().range([1, 100]);
console.log(scale.range());

// let virusClassPlot = d3.select('virusClassPlot')
