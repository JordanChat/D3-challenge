 // @TODO: YOUR CODE HERE!
var svgWidth = 900;
var svgHeight = 600;
var margin = { top: 100, right: 60, bottom: 100, left:60};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3
    .select(".scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


var chosenXaxis = "poverty";
var chosenYaxis = "smokes";

//from CSV
var theData = "../data/data.csv"
console.log(d3.csv(theData))
d3.csv(theData).then(successHandle, errorHandle);

function errorHandle(error){
    throw error;
}
    
function successHandle(censusData) {
    // Parse
    censusData.forEach(function(data) {
        data.state = data.state;
        data.abbr = data.abbr;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
    });
    
        var xLinearScale = xScale(censusData, chosenXaxis);
        var yLinearScale = yScale(censusData, chosenYaxis);
    
        // axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
    
        // x axis
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        
        var xLabel = chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + 20})`)
            .attr("x", 0 )
            .attr("y", 20)
            .attr("value", "smokes")
            .attr("class", "axis-text")
            .classed("active", true)
            .classed("inactive", false)
            .text("Smokes (%)");

        // y axis
        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);
        
        var yLabel = chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 -  margin.left + 20)
            .attr("x", 0 - height / 2)
            .attr("value", "poverty")
            .attr("class", "axis-text")
            .classed("active", true)
            .classed("inactive", false)
            .text("In Poverty(%)")
        
        var circleRadius = 15;
    
        // initial circles append
        var circlesGroup = chartGroup.selectAll("circles")
            .data(censusData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXaxis]))
            .attr("cy", d => yLinearScale(d[chosenYaxis]))
            .attr("r", circleRadius)
            .attr("fill", "steelblue")
            .style("stroke", "grey")
            .attr("opacity", ".7")
            .text(function(d) {
                return d.abbr;
            })
    
        // state abbr circles
        var abbrGroup = chartGroup.selectAll("texts")
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXaxis]))
        .attr("y", d => yLinearScale(d[chosenYaxis]))
        .attr("class","stateText")
        .text(function(d) {
            return d.abbr;
        })

// axis labels
var xLabel = "In Poverty (%)"
var yLabel = "Smokes(%)"

//  tooltips
var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([105, 0])
        .html(function(d) {
             return (`<b>${d["state"]}</b><br>${xLabel} <b>${d[chosenXaxis]}</b><br>${yLabel} <b>${d[chosenYaxis]}</b>`)
        });
        
        abbrGroup.call(toolTip);
        abbrGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
        })
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });
        return abbrGroup;

// x-scale function
function xScale(censusData, chosenXaxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXaxis]) * .8,
        d3.max(censusData, d => d[chosenXaxis]) * 1.1])
        .range([0, width]);
    return xLinearScale;
}

// y-scale function
function yScale(censusData, chosenYaxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYaxis]) * 0.8,
        d3.max(censusData, d => d[chosenYaxis]) * 1.1])
        .range([height, 0]);
    return yLinearScale;
}

}

//ya
