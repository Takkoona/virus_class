import { select } from 'd3';
import strainCounts from './strainCounts';
import virusInfo from './data/virusInfo.json';

const virusTypes = new Set();
const minCount = 500;

let abundantVirus = virusInfo.filter(virus => {
  const toKeep = virus['genomeNum'] >= minCount;
  if (toKeep) {
    virusTypes.add(virus['virusClass']);
  }
  return toKeep;
});

console.log(virusTypes);

const outerWidth = 600;
const outerHeight = 500;
const margin = { left: 275, top: 30, right: 30, bottom: 30 }
const barPadding = 0.1

const svg = select('#virusClassPlot')
  .append('svg')
  .attr('width', outerWidth)
  .attr('height', outerHeight)

let data = abundantVirus.filter(virus => {
  return virus['virusClass'] === "dsRNA";
});

let barColor = 'steelblue';

function render() {
  strainCounts(svg, {
    data,
    outerHeight,
    outerWidth,
    margin,
    barPadding,
    barColor
  });
}

render();

setTimeout(() => {
  data = abundantVirus.filter(virus => {
    return virus['virusClass'] === "ssRNA(+)";
  });
  render();
}, 1000);
