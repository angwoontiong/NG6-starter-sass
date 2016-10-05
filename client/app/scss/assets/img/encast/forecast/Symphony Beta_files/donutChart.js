var enbala_app = enbala_app || {};

enbala_app.donutChart = (function() {
 var donutChart;

var w = 140,
 h = 140,
 r = 70,
 innerRadius = 60,
 transitionsDuration = 1500,
 transitionsDelay = 600,
 percentageTextSize = '2.0rem';

// This is the scale to avoid using gradiant for the angles.
var rScale = d3.scale.linear().domain([0, 100]).range([0, 2 * Math.PI]);

// Here we use the helper function of d3 to draw arcs easier
var arc = d3.svg.arc()
  .outerRadius(r + 0.8)
  .innerRadius(innerRadius);

// Another helper function of d3 to bind the data to the arcs
var pie = d3.layout.pie()
  .value(function(d) {
    return d.value; 
});

donutChart = {
  /**
   * A d3 function that draws a donut chart.
   */
  draw: function(container, data) {

    var svg = d3.select(container)
      .append('svg');

    createBigCircle(svg);
    var vis = createChartContainer(svg, data);
    drawChartArcs(vis, data);
    createSmallCircle(vis);
    drawPercentageText(vis, data);
    //drawInformativeText(vis, data);

  }
};

// Here we create the big circle (the outer one)
function createBigCircle(svg) {
  svg.append('circle')
    .attr('cx', r)
    .attr('cy', r)
    .attr('r', r)
    .attr('class', 'donut-big-arc');
}

// Here we give dimensions to the svg and create a g container
function createChartContainer(svg, data) {
  return svg
    .data([data])
    .attr('width', w)
    .attr('height', h)
    .append('g')
    .attr('transform', 'translate(' + r + ',' + r + ')');
}

// We draw the arc in here, give it an smooth transition and the correct color depending on the data.
function drawChartArcs(visualization, data) {
  var arcs = visualization.selectAll('g')
    .data(pie)
    .enter()
    .append('g');

  arcs.append('path')
  /*.attr('transform', function(d){return 'rotate('+rotationAngle(d.value)+')' })*/
  .attr('fill', function(d, i) {
    return data[i].color;
  })
    .each(function(d) {
      d.endAngle = 0;
    })
    .attr('d', arc)
    .transition()
    .duration(transitionsDuration)
    .delay(transitionsDelay)
    .ease('elastic')
    .call(arcTween, this);
}

// This help us achieve the arcs transitions.
function arcTween(transition, newAngle) {

  transition.attrTween("d", function(d) {

    var interpolate = d3.interpolate(0, 360 * (d.value / 100) * Math.PI / 180);

    return function(t) {

      d.endAngle = interpolate(t);

      return arc(d);
    };
  });
}

// This is the small circle, the one with the text in the middle.
function createSmallCircle(visualization) {
  visualization.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', innerRadius)
    .attr("fill", "#0d223f")
    .attr('class', 'donut-small-arc');
}

// This is the percentage text, it appears with the same transition as the path/arcs
function drawPercentageText(visualization, data) {
  visualization.append('text')
    .data(data)
    .attr("font-family", "Helvetica, Arial, sans-serif")
    .attr("font-size", "0px")
    .attr("font-weight", "bold")
    .attr("fill", "white")
    .attr('text-anchor', 'middle')
    .attr('y', '10px')
    .text(function(d) {
      return d.value + "%";
    })
    .transition()
    .attr('font-size', percentageTextSize)
    .duration(transitionsDuration)
    .delay(transitionsDelay)
    .ease('elastic');
}

return donutChart;
})();