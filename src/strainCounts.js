import {
  scaleLinear,
  scaleBand,
  max,
  axisBottom,
  axisLeft,
  format
} from 'd3';

const xValue = d => d.genomeNum;
const yValue = d => d.virusName;

function strainCounts(selection, props) {
  const {
    data,
    outerHeight,
    outerWidth,
    margin,
    barPadding,
    barColor
  } = props;

  const innerWidth = outerWidth - (margin.left + margin.right);
  const innerHeight = outerHeight - (margin.top + margin.bottom);

  const xScale = scaleLinear()
    .domain([0, max(data, d => xValue(d))])
    .range([0, innerWidth]);
  const yScale = scaleBand()
    .domain(data.map(d => yValue(d)))
    .range([0, innerHeight])
    .padding(barPadding);

  const barChartUpdate = selection.selectAll('g').data([null]);
  const barChartG = barChartUpdate.enter()
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .merge(barChartUpdate);
    
  const barChart = barChartG.selectAll("rect").data(data);

  barChart.enter()
    .append("rect")
    .merge(barChart)
    .attr("fill", barColor)
    .attr("y", d => yScale(yValue(d)))
    .attr("height", yScale.bandwidth())
    .transition().duration(1000)
    .attr("width", d => xScale(xValue(d)))
    
  barChart.exit().remove();
    
  const xAxisCall = axisBottom(xScale)
    .tickFormat(format("0.0s"))
    .ticks(5)
    .tickSizeOuter(0);
  const xAxisUpdate = barChartG.selectAll('#xAxis').data([null]);
  const xAxis = xAxisUpdate.enter()
    .append("g")
    .attr("id", "xAxis")
    .attr("transform", "translate(0," + innerHeight + ")");
  xAxis.merge(xAxisUpdate).transition().call(xAxisCall);
    
  const yAxisCall = axisLeft(yScale)
    .tickSizeOuter(0);
  const yAxisUpdate = barChartG.selectAll('#yAxis').data([null]);
  const yAXis = yAxisUpdate.enter()
    .append("g")
    .attr('id', "yAxis");
  yAXis.merge(yAxisUpdate).transition().call(yAxisCall);
}

export default strainCounts;
