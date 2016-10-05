
var enbala_app = enbala_app || {};


//in progress
enbala_app.graph = function(config) {
    //var charts = ['price','priceB'];
    var charts = config.charts;
    var num_of_charts = charts.length;

    console.log("enbala_app graph");
    var graph;

    var config = config || {};
    console.log("config:",config);

    var container = config.container;
    console.log("165 container:",container);

    var margin = {top: 10, right: 10, bottom: 100, left: 40},
        margin2 = {top: 400, right: 10, bottom: 20, left: 40},
        width = 1360 - margin.left - margin.right,
        height = 470 - margin.top - margin.bottom,
        height2 = 470 - margin2.top - margin2.bottom;

    //var parseDate = d3.time.format("%b %Y").parse;
    //var parseDateTime = d3.time.format("%I:%M:%S %p").parse;

    var x = d3.time.scale().range([0, width]),
        x2 = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);
        //y2 = d3.scale.linear().range([height2, margin2.top]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("left");
        //yAxis2 = d3.svg.axis().scale(y2).orient("left");

    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", brushed);




    //Generate line functions
    var focus_lines = {};
    var context_lines = {};

    var i;

    for(i=0;i<num_of_charts;i++){
        var chartName = charts[i];
        var lineName = "line_"+chartName;
        console.log("55 lineName:",lineName);

        focus_lines[lineName] = (function(chartname){
            var _chartname = chartname;
            return d3.svg.line()
            .interpolate("linear") // can be basis, bundle, cardinal, linear, monotone
            .x(function(d) { return x(d.datetime); })
            .y(function(d) { return y(d[_chartname]); });
        })(chartName);

        context_lines[lineName] = (function(chartname){
            var _chartname = chartname;
            return d3.svg.line()
            .interpolate("linear") // can be basis, bundle, cardinal, linear, monotone
            .x(function(d) { return x2(d.datetime); })
            .y(function(d) { return y2(d[_chartname]); });
        })(chartName);
    }
 

    var svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg.append("defs").append("clipPath")
    .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    var getMaxExtent = function(charts,data){
        var params = charts;
        var i;
        var length = params.length;
        var lowerBound;
        var upperBound;

        for(i=0;i<length;i++){
            var param = params[i];

            var ext = d3.extent(data.map(function(d){ 
                return d[param]; })

            );

            if(lowerBound === undefined){
                lowerBound = ext[0];
            }
            if(upperBound === undefined){
                upperBound = ext[1];
            }

            if(lowerBound !== undefined && ext[0]<lowerBound){
                lowerBound = ext[0];
            }

            if(upperBound !== undefined && ext[1]>upperBound){
                upperBound = ext[1];
            }
            

            
        }

        console.log("lowerBound:",lowerBound);
        console.log("upperBound:",upperBound);

        return [lowerBound,upperBound];
    }
        

    function brushed() {
        console.log("brushed !!!!!!!!!!!!!!!!!!!");
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.select(".x.axis").call(xAxis);

        for(i=0;i<num_of_charts;i++){
            var chartName = charts[i];
            var lineName = "line_"+chartName;

            focus.select(".focus path#"+lineName).attr("d", focus_lines[lineName])
        }
    }


    graph = {
      //plot: function(container, data) {
      plot: function(data) {  

        console.log("20 plot container:",container);
        console.log("20 data:",data);

        //set x axis domain of 'focus'
        x.domain(d3.extent(data.map(function(d) 
          { return d.datetime; }
          )
        ));


        var maxExtent = getMaxExtent(charts,data);
        y.domain(maxExtent);

        //set x axis domain of 'context'
        x2.domain(x.domain());

        //set y axis domain of 'context'
        y2.domain(y.domain());

        //append group 'g' and attach x-axis
        focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")   //move x-axis to designated position by translation
            .call(xAxis);

        //append group 'g' and attach y-axis
        focus.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        focus.append("text")      // text label for the y axis but should be MW or kW
            .attr("class", "y axis")
            .attr("transform", "rotate(-90)")
            .attr("y", 15)   //shift over a little
            .style("text-anchor", "end")

            .text("MW")
            .call(yAxis);

        //append 'lines' to path    
        var i;
        for(i=0;i<num_of_charts;i++){
            var chartName = charts[i];
            var lineName = "line_"+chartName;
         
            focus.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("id",lineName)
              .attr("d", focus_lines[lineName]);

            context.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("id",lineName)
              .attr("d", context_lines[lineName]);
        }


        context.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height2 + ")")   //move x-axis to designated position by translation
            .call(xAxis2);

        //Note: yAxis2 not needed as we are not display y-axis for 'context' graph    
        context.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
            .attr("y", -6)   //shift down a little
            .attr("height", height2 + 7);  //set height of rectangle
        //============================================

      },//plot

      update: function(data) {  
        console.log("148 plot container:",container);
        console.log("148 data:",data);

        //set x axis domain of 'focus'
        x.domain(d3.extent(data.map(function(d) 
          { return d.datetime; }
          )
        ));

        console.log("x.domain():",x.domain());

        var maxExtent = getMaxExtent(charts,data);
        y.domain(maxExtent);

        console.log("y.domain():",y.domain());

        //set x axis domain of 'context'
        x2.domain(x.domain());
        console.log("x2.domain():",x2.domain());

        y2.domain(y.domain());
        console.log("y2.domain():",y2.domain());

        //============focus========================
        //update x-axis for 'focus' graph
        focus.select("g.x.axis")
            .call(xAxis);
  
        //update y-axis for 'focus' graph
        focus.select('g.y.axis')
          .call(yAxis);

        //update 'lines' at path    
        var i;
        for(i=0;i<num_of_charts;i++){
            var chartName = charts[i];
            var lineName = "line_"+chartName;

            focus.select(".focus path#"+lineName)
                .datum(data)
                .attr("d", focus_lines[lineName]);  

            context.select(".context path#"+lineName)
                .datum(data)
                .attr("d", context_lines[lineName]);              

        }

        //update x-axis for 'context' graph
        context.select("g.x.axis")
            .call(xAxis2);

        context.select("g.x.brush")   
            .call(brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", height2 + 7); 

        brushed();  //update 'focus' graph if 'brush' is in effect    

      }//plot
    };//graph

    console.log("182 graph:",graph);

    return graph;

};

