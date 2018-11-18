var margin = { top: 20, right: 100, bottom: 100, left: 100 };
var width = 1500 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;
var colors = ["#3143ea", "#5780f2", "#57a2f2", "#85c9f7", "#c4e7ff", "#fff3b5", "#ffe4a3", "#f9bd63", "#f78b38", "#f71d16", "#840b0b"];
var g = d3.select("#display").append("svg").
attr("width", width + margin.left + margin.right).
attr("height", height + margin.top + margin.bottom).
append("g").
attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div").
attr("class", "tooltip").
attr("id", "tooltip").
style("opacity", 0);
var xLabel = g.append("g").
attr("width", 100).
attr("height", 50).
attr("transform", "translate(" + width / 2 + "," + (height + 50) + ")").
append("text").
text("Year").
attr("font-size", 25);
var yLabel = g.append("g").
attr("width", 100).
attr("height", 50).
attr("transform", "translate(-70," + (height / 2 + 30) + "), rotate(270)").
append("text").
text("Month").
attr("font-size", 25);

var legend = g.append("g").
attr("id", "legend").
attr("width", 500).
attr("height", 25).
attr("transform", "translate(" + width / 4 + "," + (height + 100) + ")").
selectAll("rect").
data(colors).
enter().
append("rect").
attr("x", function (d, i) {return i * 25;}).
attr("y", 0).
attr("width", 25).
attr("height", 25).
attr("fill", function (d) {return d;});




d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").then(function (data) {
  console.log(data);

  // X-Scale
  var years = data.monthlyVariance.map(function (d) {return d.year;});
  var months = data.monthlyVariance.map(function (d) {return d.month;});
  var xMin = new Date(d3.min(years, function (d) {return d;}), 0);
  var xMax = new Date(d3.max(years, function (d) {return d;}), 0);
  console.log(xMin);
  var x = d3.scaleBand().
  domain(data.monthlyVariance.map(function (d) {return d.year;})).
  paddingInner(0).
  paddingOuter(0).
  range([0, width]);
  var x1 = d3.scaleTime().
  domain([xMin, xMax]).
  range([0, width]);

  // Y-Scale
  var y = d3.scaleOrdinal().
  domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).
  range(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
  var y1 = d3.scaleBand().
  domain(data.monthlyVariance.map(function (d) {return d.month - 1;})).
  paddingInner(0).
  paddingOuter(0).
  range([0, height]);

  //X-Axis
  var xAxis = d3.axisBottom(x1).
  tickFormat(d3.timeFormat("%Y")).
  ticks(10);
  g.append("g").
  attr("id", "x-axis").
  attr("transform", "translate(0," + height + ")").
  call(xAxis);
  //Y-Axis
  var yAxis = d3.axisLeft(y1).
  tickFormat(function (tick) {return y(tick);});
  g.append("g").
  attr("id", "y-axis").
  call(yAxis);
  var rectangles = g.selectAll("rect").
  data(data.monthlyVariance);
  var rect =
  rectangles.enter().
  append("rect").
  attr("x", function (d) {return x(d.year);}).
  attr("y", function (d) {return y1(d.month - 1);}).
  attr("height", y1.bandwidth()).
  attr("width", x.bandwidth()).
  attr("data-year", function (d) {return d.year;}).
  attr("data-month", function (d) {return d.month - 1;}).
  attr("data-temp", function (d) {return data.baseTemperature + d.variance;}).
  attr("id", "rect").
  attr("class", "cell").
  attr("fill", function (d) {
    var num = data.baseTemperature + d.variance;
    if (num <= 2.8) {
      return colors[0];
    } else if (num <= 3.9 && num > 2.8) {
      return colors[1];
    } else
    if (num <= 5 && num > 3.9) {
      return colors[2];
    } else if (num <= 6.1 && num > 5) {
      return colors[3];
    } else if (num <= 7.2 && num > 6.1) {
      return colors[4];
    } else if (num <= 8.3 && num > 7.2) {
      return colors[5];
    } else if (num <= 9.5 && num > 8.3) {
      return colors[6];
    } else if (num <= 10.6 && num > 9.5) {
      return colors[7];
    } else if (num <= 11.7 && num > 10.6) {
      return colors[8];
    } else if (num <= 12.8 && num > 11.7) {
      return colors[9];
    } else {
      return colors[10];
    }

  }).
  on("mouseover", function (d) {
    d3.select(undefined);
    div.style("opacity", .9);
    div.attr("data-year", d.year);
    div.html("<div class=\"container\"> " + d.year + ": " + y(d.month) + " <br/>\n                 " +
    (data.baseTemperature + d.variance).toFixed(3) + " &#8451; <br/> " + d.variance.toFixed(3) + " &#8451; </div>").
    style("left", d3.event.pageX + "px").
    style("top", d3.event.pageY - height / 12 - 50 + "px");
  }).on("mouseout", function (d) {
    div.style("opacity", 0);});
  d3.select(undefined);


}).catch(function (err) {return console.log(err);});