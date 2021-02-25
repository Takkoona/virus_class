const d3 = require('d3');
let data = require('./data/virusInfo.json')

const xValue = d => d.genomeNum;
const yValue = d => d.virusName;

data = data.filter(virus => xValue(virus) >= 1000).sort((a, b) => {
    return xValue(b) - xValue(a);
});

const outerWidth = 600;
const outerHeight = 500;
const margin = { left: 275, top: 30, right: 30, bottom: 30 }
const barPadding = 0.2

const innerWidth = outerWidth - (margin.left + margin.right);
const innerHeight = outerHeight - (margin.top + margin.bottom);

const svg = d3.select('#virusClassPlot')
    .append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight)

const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => xValue(d))])
    .range([0, innerWidth]);
const yScale = d3.scaleBand()
    .domain(data.map(d => yValue(d)))
    .range([0, innerHeight])
    .padding(barPadding);

const xAxis = d3.axisBottom(xScale)
    .ticks(5)
    .tickSizeOuter(0);
const yAxis = d3.axisLeft(yScale)
    .tickSizeOuter(0);

const barChartG = svg.append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Adjust plot inside the svg

const xAxisG = barChartG.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + innerHeight + ")");
const yAxisG = barChartG.append("g")
    .attr("class", "y axis");

xAxisG.call(xAxis);
yAxisG.call(yAxis);

barChartG.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("fill", "steelblue")
    .attr("y", d => yScale(yValue(d)))
    .attr("width", d => xScale(xValue(d)))
    .attr("height", yScale.bandwidth())
    .exit()
    .remove();
