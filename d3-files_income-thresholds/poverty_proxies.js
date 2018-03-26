(function() {
    var margin = { top: 30, left: 100, right: 30, bottom: 20},
    height = 320 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var indicators = ["No_internet", "Get_together", "No_meat", "Replace_clothes", "No_holidays", "Replace_furniture"]

  var distancefromtop = 0

  var xPositionScale = d3.scaleLinear().domain([0,70]).range([0,width])

  var yPositionScale = d3.scalePoint().domain(indicators).range([height,15])

  var colorScale = d3.scaleOrdinal().domain(["Northern Europe", "Western Europe", "Eastern Europe", "Southern Europe", "none"]).range(['#009BFF','#82B905','#EB6E14','#DC0F6E','#8F8474'])

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return d.country + ": " + d.value + "%" ;
      })

  d3.queue()
    .defer(d3.csv, "QE_poverty_proxies.csv", function(d){
      // console.log(d)
      d.country = d.GEO
      d.indicator = d.indicator
      d.region = d.region
      d.value = +d.Value_parsed
      return d
    })
    .await(ready)

  function ready(error, datapoints) {
    // console.log(datapoints)

    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("r", function(d){
        if (d.country == "EU")
          return 7
        // if (d.country == "Germany")
        //   return 7
        else
          return 5
      })
      .attr("cx", function(d){
        if (d.value > 10)
          return xPositionScale(d.value)
        else
          return xPositionScale(0)
      })
      .attr("cy", function(d){
        return yPositionScale(d.indicator)
      })
      .attr("fill", function(d){
          return colorScale(d.region)
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    svg.call(tip)

    // Add your axes
    var xAxis = d3.axisTop(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0,"+distancefromtop+")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .attr("transform", "translate(0,"+distancefromtop+")")
      .call(yAxis);

  
  }

})();
