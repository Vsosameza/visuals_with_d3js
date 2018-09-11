makeResponsive();


function makeResponsive(){
// svg container dimension set-up
  var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {svgArea.remove();}



var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    //nonworking tooltip option 
    // var tooltip = d3
    // .tip()
    // .attr("class", "tooltip")
    // .offset([60, -80])
    // .html((d) => {
    //   var stateName = d.state;
    //   var povertyPerc = d.poverty;
    //   var columnPerc = d[currentAxisLabelY];

    //   return "<strong>" + stateName + "</strong>" + "<br>Selection: " + columnPerc + "%<br>Poverty: " + povertyPerc + "%";
    // })
    

d3.csv("data.csv")
    .then(data => {
        // Healthcre vs Poverty
        data.forEach(function (d) {
            d.healthcare = +d.healthcare;
            d.poverty = +d.poverty;
            d.income = +d.income;
            d.obesity = +d.obesity;
        })
    
        let obesity_stats = data.map(x => x.obesity)
        let poverty_stats = data.map(x => x.poverty)

        var xScale = d3.scaleLinear()
            .domain(d3.extent(obesity_stats))
            .range([0, width])
        let xAxis = d3.axisBottom(xScale)
        
        
        var yScale = d3.scaleLinear()
            .domain(d3.extent(poverty_stats))
            .range([width, 0])
        let yAxis = d3.axisLeft(yScale)
        
        // Genreate the X data 
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(1," + height + ")")
            .call(xAxis) 
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .style("fill", "red")
            .text("healthcare");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("fill", "blue")
            .text("poverty")


        svg.selectAll(".stateCircle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 3)
            .attr("cx", d => xScale(d.obesity)) 
            .attr("cy", d => yScale(d.poverty))
            //.style("fill", function (d) { return color(d.species); });


        //     var node = chart.selectAll(".dot")
        //     .data(data).enter();

        //   node
        //     .append("circle")
        //       .attr("class", "dot")
        //       .attr("r", 15)
        //       .attr("cx", xMap)
        //       .attr("cy", yMap)

        //     node
        //     .append("text")
        //       .attr("class", "state")
        //       .attr("x", (d) => {return xScale(d.poverty)})
        //       .attr("y", (d) => {return yScale(d[currentAxisLabelY])})
        //       .text(fValue)
        //       .on("mouseover", (d) => {
        //         tooltip.show(d)})
        //       .on("mouseout", (d) => {
        //           tooltip.hide(d)});

            .on("mouseover", function (d) {
                div.transition()
                    .duration(1000)
                    .style("opacity", .5);
                div.html(d.healthcare)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    })}