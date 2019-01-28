var detaileddata;
var values;
var data = [4,7,6,4,2,3];
var occurances = [0,0,0,0,0,0,0,0,0,0,0];
var currentskill;
var stats = ["Information Visualization", "Statistics", "Math", "Artistic", "Computer Usage", "Programming", "Computer Graphics", "HCI", "User Experience", "Communication", "Collaboration", "Code Repository", "Total"];

function tryapi() {
  const url = "https://sheets.googleapis.com/v4/spreadsheets/1LFWZuyPdas493OrPrqLqaFodNstEnt9m0fmTg_4CEls/values/'Form Responses 1'?key=AIzaSyAwCn_KpGPZ2OqFQ66A3VCp4XD8R0k0znA"
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log((myJson));
      //values = myJson.values;
      detaileddata = myJson.values;
      values = condensedata(myJson.values);
      init();
    });
}

function init() {
  getdata("Information Visualization");
  d3.select("#title").html(" Information Visualization" + " Skill Distribution");
  currentskill = "Information Visualization";
  var svg = d3.select("#svgcontainer").append("svg").classed("graph",true).attr("height", 700).attr("width", '50%').attr("y", 0);
  var padding = {top:20, right: 30, left:50, bottom: 30};

  var chartArea = {
    "width":parseInt(svg.style("width")) - padding.left - padding.right,
    "height":parseInt(svg.style("height")) - padding.top - padding.bottom
  };

  var xScale = d3.scaleLinear()
  .domain([0,1,2,3,4,5,6,7,8,9,10,])
  .range([0, chartArea.width/11, 2*chartArea.width/11, 3*chartArea.width/11, 4*chartArea.width/11, 5*chartArea.width/11, 6*chartArea.width/11, 7*chartArea.width/11, 8*chartArea.width/11, 9*chartArea.width/11, 10*chartArea.width/11])

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(occurances, function(d){return d})])
    .range([chartArea.height, 50])


  
  svg.append("g")
    .classed("xAxis", true)
    .attr('transform','translate(' + padding.left + ',' + (chartArea.height + padding.top)+')')
    .call(d3.axisBottom(xScale));
  svg.append("g")
    .classed("yAxis", true)
    .attr('transform','translate(' + padding.left + ','+ padding.top+')')
    .call(d3.axisLeft(yScale));

  var xind=0;
  var yind=0;
  svg.append("g")
    .selectAll("rect")
    .data(occurances)
    .enter().append("g").classed("gbar",true).append("rect")
      .classed("bar", true)
     .attr("x", function(){ var xval = xind*chartArea.width/11 +padding.left -17; xind++; return xval})
     .attr("width", 34)
     .attr("y", function(d) { return  chartArea.height + padding.top - (chartArea.height -50)*d/d3.max(occurances, function(d){return d})})
     .attr("height", function(d) { return (chartArea.height-50)*d/d3.max(occurances, function(d){return d})})
     .attr("onclick", function(){ var val = yind; yind++; return 'getPeople('+ val + ')';})
     .text(function(d) { return d * 15})
     .attr("onmouseenter", 'displayNumber()')
     .attr("onmouseleave", 'hideNumber()');

  svg.append("g").append("text")
    .classed("average", true)
    .attr("x", 20)
    .attr("y", 20)
    .text(function(){return "Average: " + d3.mean(data, function(d){return d}).toFixed(2)});

  d3.select("#svgcontainer").append("div").classed("individual", true).attr("height", 650).attr("width", '50%').attr("y", 0)
}

function update(int) {
  getdata(int);
  d3.select("#title").html(" " +int + " Skill Distribution");
  currentskill = int;
  var svg = d3.select("svg");
  var padding = {top:20, right: 30, left:50, bottom: 30};

  var chartArea = {
    "width":parseInt(svg.style("width")) - padding.left - padding.right,
    "height":parseInt(svg.style("height")) - padding.top - padding.bottom
  };

 var xScale = d3.scaleLinear()
  .domain([0,1,2,3,4,5,6,7,8,9,10,])
  .range([0, chartArea.width/11, 2*chartArea.width/11, 3*chartArea.width/11, 4*chartArea.width/11, 5*chartArea.width/11, 6*chartArea.width/11, 7*chartArea.width/11, 8*chartArea.width/11, 9*chartArea.width/11, 10*chartArea.width/11])

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(occurances, function(d){return d})])
    .range([chartArea.height, 50])

  var yAxisFn = d3.axisLeft(yScale);

  var xind = 0;
  d3.selectAll(".xAxis")
    .transition()
    .duration(200)
    .attr('transform','translate(' + padding.left + ',' + (chartArea.height + padding.top)+')')
    .call(d3.axisBottom(xScale));
  yAxis = d3.select(".yAxis");
  yAxisFn(yAxis);

  d3.selectAll("rect")
    .data(occurances)
    .transition()
    .delay(200)
    .attr("x", function(){var xval = xind*chartArea.width/11 +padding.left -17; xind++; return xval})
    .attr("width", 34)
    .attr("y", function(d) { return chartArea.height + padding.top - (chartArea.height-50)*d/d3.max(occurances, function(d){return d})})
    .attr("height", function(d) { return (chartArea.height-50)*d/d3.max(occurances, function(d){return d})})
    .text(function(d) { return d * 15})
    .attr("onmouseenter", 'displayNumber()')
    .attr("onmouseleave", 'hideNumber()');



  d3.selectAll(".average")
    .text(function(){return  "Average: " + d3.mean(data, function(d){return d}).toFixed(2)});
}

function getdata(input) {
  ind = simplify(input);
  data = [];
  occurances = [0,0,0,0,0,0,0,0,0,0,0];
  for(var i = 0; i < 57; i++){
    occurances[values[i][ind]]++;
    data[i] = values[i][ind];
  }
  var x = 1;
}

function simplify(categoryname){
  return categoryname.toString().toLowerCase().replace(/\s/g, '');
}

function getPeople(number){
  d3.select(".individual").html("");
  var table = d3.select(".individual").append('table').classed('skilltable', true).attr("x", 50).attr('y', 50);
  var curSkill = simplify(ind);
  var people = [];
  var columns = ['Name', currentskill, 'Total'];


  for(var i = 0; i < 57; i++){
    if(values[i][curSkill] == number){
      people.push(values[i]);
    }
  }

  people.sort(dynamicSort(curSkill));

  var thead = table.append('thead');
  var tbody = table.append('tbody');

  thead.append('tr')
    .selectAll('th')
    .data(columns).enter()
    .append('th')
    .style('padding', '0 10px')
    .style('border', ' solid black')
    .text(function (column){ return column; });

  var rows = tbody.selectAll('tr')
    .data(people)
    .enter()
    .append('tr')
    .classed('borderrow', true)
    .attr('onclick', function(person){return 'showPerson(' + person.id + ')'})
    .style('background-color', function(person){return perc2color(person.total)})


var cells = rows.selectAll('td')
      .data(function (row) {
        return columns.map(function (column) {
          return {column: column, value: row[simplify(column)]};
        });
      })
      .enter()
      .append('td')
      .style('text-align', 'center')
      .text(function (d) { return d.value; });
}

function displayNumber(){
  var xind = 0;

  var svg = d3.select("svg");
  var padding = {top:20, right: 30, left:50, bottom: 30};

  var chartArea = {
    "width":parseInt(svg.style("width")) - padding.left - padding.right,
    "height":parseInt(svg.style("height")) - padding.top - padding.bottom
  };
  d3.selectAll(".gbar")
    .append("text")
    .classed("bartext", true)
    .data(occurances)
    .attr("x", function(){ var xval = xind*chartArea.width/11 +padding.left -5; xind++; return xval})
    .attr("y", function(d) { return chartArea.height + padding.top - (chartArea.height-50)*d/d3.max(occurances, function(d){return d}) - 15})
    .text(function(d) { if(d != 0)return d; else return "";})
    .attr("font-weight", 'bold');


}

function hideNumber(){
  d3.selectAll(".bartext").remove();
}

function showPerson(id){
  var person = detaileddata[id+1];
  d3.select(".individual").html("");
  var personcontainer=d3.select(".individual").append('div').classed("personcontainer", true).attr("height", '600px').style('border', 'solid black');

  var info = personcontainer.append("div").classed("info", true);
  //var hobbies = info.append("div").classed("hobbies", true);
  info.append("span").append("h3").text(function(){return  person[1] });
  var info1 = info.append("div").classed("generalinfo", true);
  var major = info1.append("div").classed("major", true);
  var hobbies = info1.append("div").classed("hobbies", true);
  major.append("span").append("h4").text("Major").style("font-weight", 'bold');
  major.append("span").text(function(){return person[2]});
  hobbies.append("span").append("h4").text("Hobbies").style("font-weight", 'bold');
  hobbies.append("span").text(function(){return person[4]});


  var personalstats = personcontainer.append("div").classed("stats", true);
  var statlist = personalstats.append("div").classed("statlist", true);
  statlist.append("ul").attr("style", 'list-style-type:none')
    .selectAll("li")
    .data(stats)
    .enter().append("li").text(function(stats){return stats});

  var statnumberlist = personalstats.append("div").classed("statlist", true);
  statnumberlist.append("ul").attr("style", 'list-style-type:none')
    .selectAll("li")
    .data(stats)
    .enter().append("li")
    .style("background-color", function(stats){return perc2color(values[id][simplify(stats)])})
    .text(function(stats){return values[id][simplify(stats)]});

  /*
  var smallsvg = personalstats.append("svg").attr("width", "60%").attr("height", 300);

  var yind = 0;
  var yind2 = 0;

  smallsvg
    .selectAll("line")
    .data(stats)
    .enter().append("g").append("line")
    .attr("x1", 5)
    .attr("y1", function(){var yval = yind2*300/13; yind2++; return yval})
    .attr("x2", parseInt(smallsvg.style("width"))-10)
    .attr("y2", function(){var yval = yind*300/13; yind++; return yval})
    .attr("stroke-width", 2)
    .attr("stroke", "black");


  yind = 0;
  yind2 = 0;
  smallsvg.selectAll("g")
    .data(stats).enter()
    .append("line")
    .attr("x1", 300*values[id][simplify(stats)])
    .attr("y1", function(){var yval = yind2*300/13; yind2++; return yval})
    .attr("x1", 300*values[id][simplify(stats)])
    .attr("y2", function(){var yval = yind*300/13; yind++; return yval})
    .attr("stroke-width", 2)
    .attr("stroke", "black"); 

  */


}

function condensedata(sheetdata){
  var smallerdata = [];
  for(var i = 0; i < 57; i++){
    var sum = 0;
    for(var j = 6; j < 18; j++){
      sum += Number(sheetdata[i+1][j]);
    }
    var object = {
      name: sheetdata[i+1][1],
      informationvisualization: sheetdata[i+1][6],
      statistics: sheetdata[i+1][7],
      math: sheetdata[i+1][8],
      artistic: sheetdata[i+1][9],
      computerusage: sheetdata[i+1][10],
      programming: sheetdata[i+1][11],
      computergraphics: sheetdata[i+1][12],
      hci: sheetdata[i+1][13],
      userexperience: sheetdata[i+1][14],
      communication: sheetdata[i+1][15],
      collaboration: sheetdata[i+1][16],
      coderepository: sheetdata[i+1][17],
      total: sum,
      id: i
    }
    smallerdata[i] = object;
  }
  return smallerdata;
}

function dynamicSort(property) {
    var sortOrder = -1;
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function perc2color(perc) {
  var r, g, b = 0;
  if(perc <= 10){
    perc *= 10;
  } else {
    perc = ((perc-39)*2);
  }
  if(perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  }
  else {
    g = 255;
    r = Math.round(510 - 5.10 * perc);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  return '#' + ('000000' + h.toString(16)).slice(-6);
}