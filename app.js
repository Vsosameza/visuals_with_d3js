var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// LAYOUT ELEMENTS
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


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
        
        // Genreate the X data - DYNAMIC
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(1," + height + ")")
            .call(xAxis) 
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .style("fill", "black")
            .text("HEALTHCARE");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("fill", "black")
            .text("POVERTY")


        svg.selectAll(".stateCircle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 3)
            .attr("cx", d => xScale(d.obesity)) // Need the scaling here
            .attr("cy", d => yScale(d.poverty))
            //.style("fill", function (d) { return color(d.species); });

            .on("mouseover", function (d) {
                div.transition()
                    .duration(1000)
                    .style("opacity", .9);
                div.html(d.healthcare)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    })