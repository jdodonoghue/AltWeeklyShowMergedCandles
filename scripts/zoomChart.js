                               
//sl.example.zoomChart = function(zoom, data, xScale, yScale1, yScale2, xAxis, yAxis1, yAxis2, fromDate, toDate) {
sl.example.zoomChart = function(data, fromDate, toDate) {
        //console.log(data);
        //"use strict";
        //var dataArray = [];
        var svg = null;
        var g = null;
        var bisectDate = null;
        //var dataArray = null;
        var xScale = null;
        var yScale1 = null;
        var yScale2 = null;
        var xAxis = null;
        var yAxis1 = null;
        var yAxis2 = null;
        var series = null;
        var showIndicator = false;
        var focus = null;
        var g = null;

        xScale = d3.scaleTime();
        yScale1 = d3.scaleLinear();
        yScale2 = d3.scaleLinear();

        xAxis = d3.axisBottom().scale(xScale).ticks(5);

        yAxis1 = d3.axisLeft().scale(yScale1);
        yAxis2 = d3.axisLeft().scale(yScale2);

        var line = d3.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });

        
        //var dataArray = data.map(function (d) { return d; });

        var zoom = d3.zoom()
            .scaleExtent([0.5, 50])
            .on('zoom', zoomed)
            .on('end', zoomend);
            


        ////    
        var initialScale = d3.scaleLinear();
        
        var xDomain = null;
        var yDomain1 = null;
        var yDomain2 = null;

        var margin = { top: 20, right: 20, bottom: 30, left: 50 };
        var width = 800 - margin.left - margin.right;
        var heightSymbolChart = 400 - margin.top - margin.bottom;
        var heightIndicatorChart = 650 - margin.top - margin.bottom;
        var displayHeight = heightSymbolChart;
        
        var zoomChart = function () {
            
            if (showIndicator === true) {
                displayHeight = heightIndicatorChart;
            }

            margin.left = margin.left + 50;
            // Create svg element
            var svg = d3.select('#chart').classed('chart', true).append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', displayHeight + margin.top + margin.bottom);
            
            // Ceate chart
            g = svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            
            // Create plot area
            var plotArea = g.append('g');

            plotArea.append('clipPath')
                .attr('id', 'plotAreaClip')
                .append('rect')
                .attr('width', width)
                .attr('height', heightSymbolChart);
            
            plotArea.attr('clip-path', 'url(#plotAreaClip)');
            
            // Create zoom pane
            plotArea.append('rect')
                .attr('class', 'zoom-pane')
                .attr('width', width)
                .attr('height', heightSymbolChart)
                .call(zoom);
            /*    
            // text label for the x axis
            svg.append("text")             
                .attr("transform",
                "translate(" + (width/2) + " ," + 
                           (displayHeight + margin.top + 70) + ")")
                .style("text-anchor", "middle")
                .text("Date");
            */
            /*
            // text label for the y axis
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left + 20)
                .attr("x", 0 - (heightSymbolChart / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Value");   
            */
            //console.log("data1");
            //console.log(data);
            // Set scale domains
            xDomain = d3.extent(data, function (d) { return d.date; });
            xScale.domain(xDomain);
            
            var ymin1 = d3.min(data, function(d) { return d["low"]; });// - 50;
            var ymax1 = d3.max(data, function(d) { return d["high"]; });// + 50;
            var yRangePercent1 = (ymax1 - ymin1) * 0.05;
            yDomain1 = [ymin1 - yRangePercent1, ymax1 + yRangePercent1];
            yScale1.domain(yDomain1);
            
            //
            //var ymin1 = d3.min(data, function(d) { return d["specnet"]; });
            var ymin2 = d3.min(data, function(d) { return d["noncommnet"]; });
            var ymin3 = d3.min(data, function(d) { return d["commnet"]; });

            //var ymax1 = d3.max(data, function(d) { return d["specnet"]; });
            var ymax2 = d3.max(data, function(d) { return d["noncommnet"]; });
            var ymax3 = d3.max(data, function(d) { return d["commnet"]; });
            
            if (ymin1 > ymin2) {
                ymin1 = ymin2;
            }
            if (ymin1 > ymin3) {
                ymin1 = ymin3;
            }
            if (ymax1 < ymax2) {
                ymax1 = ymax2;
            }
            if (ymax1 < ymax3) {
                ymax1 = ymax3;
            }

            var yRangePercent2 = (ymax1 - ymin1) * 0.05;
            yDomain2 = [ymin1 - yRangePercent2, ymax2 + yRangePercent2];
            yScale2.domain(yDomain2);
            
            // Set scale ranges
            xScale.range([0, width]);
            yScale1.range([heightSymbolChart, 0]);
            yScale2.range([heightIndicatorChart, heightSymbolChart + 20]);
            
            // Reset zoom.
            //zoom.x(xScale);
            
            chooseChartType(data, plotArea, xScale, fromDate, toDate);
            
            //var series = sl.series.candlestick()
            //    .xScale(xScale)
            //    .yScale(yScale1);

            //series = sl.series.ohlc()
            //        .xScale(xScale)
            //        .yScale(yScale1);

            // Draw series.
            plotArea.append('g')
                .attr('class', 'series')
                .datum(data)
                .call(series);
            
            // Draw axes
            g.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + displayHeight + ')')
                .call(xAxis);
            
            g.append('g')
                .attr('class', 'y axis')
                .call(yAxis1);
            
            if (showIndicator === true) {
                addIndicatorLines(data, g);
            }
            
            addFocusLines(data, g);

            initialScale = yScale1.copy();
            
        };
        
        zoomChart.initialScale = function () {
            return initialScale;
        };

        function chooseChartType(data, plotArea, xScale, fromDate, toDate) {
            if (chartType === "CandleStick") {
                
                series = sl.series.candlestick()
                    .xScale(xScale)
                    .yScale(yScale1);
                
            }
            if (chartType === "OHLC") {
                
                series = sl.series.ohlc()
                    .xScale(xScale)
                    .yScale(yScale1);

                series.tickWidth(calculateTickWidth(xScale, fromDate, toDate));
                
            }
        }
        
    var addIndicatorLines = function (data, g) {
        //console.log(data);
        var indgroup = g.append('g')
            .attr('class', 'indicator group');
        // Define the indicator line
        indicatorline1 = d3.line()
            .x(function (d) { return xScale(d.date); })
            .y(function (d) { return yScale2(d.commnet); });

        indicatorline2 = d3.line()
            .x(function (d) { return xScale(d.date); })
            .y(function (d) { return yScale2(d.specnet); });

        indicatorline3 = d3.line()
            .x(function (d) { return xScale(d.date); })
            .y(function (d) { return yScale2(d.noncommnet); });

        indgroup.append('line')
            .attr("id", "zeroline")
            .attr('x1', xScale(xDomain[0]))
            .attr('y1', yScale2(0))
            .attr('x2', xScale(xDomain[1]))
            .attr('y2', yScale2(0))
            .attr('class', 'zeroline');

        //g.append('rect')
        //    .attr('id', 'rectid')
        //    .attr('class', 'overlay')
        //    .attr('width', width)
        //    .attr('height', heightIndicatorChart);

        //// draw indicator data
        indgroup.append("path")
            .attr("class", "indicatorline1")
            .attr("d", indicatorline1(data));

        indgroup.append("path")
            .attr("class", "indicatorline2")
            .attr("d", indicatorline2(data));

        indgroup.append("path")
            .attr("class", "indicatorline3")
            .attr("d", indicatorline3(data));

        indgroup.append("g")
            .attr("id", "yIndAxis")
            .attr("class", "y axis 2")
            .call(yAxis2);

    };

    var addFocusLines = function (data, g) {
        bisectDate = d3.bisector(function (d) { return d.date; }).left;

        // focus tracking
        focus = g.append('g').style('display', 'none');

        focus.append('line')
            .attr('id', 'focusLineX1')
            .attr('class', 'focusLine');

        focus.append('line')
            .attr('id', 'focusLineX2')
            .attr('class', 'focusLine');

        focus.append('line')
            .attr('id', 'focusLineY')
            .attr('class', 'focusLine');

    };
    
    var VerHor = function () {

        var mouse = d3.mouse(this);
        var mouseDate = xScale.invert(mouse[0]);
                
        var i = bisectDate(dataArray, mouseDate); // returns the index to the current data item
           
        var d0 = dataArray[i - 1];
        var d1 = dataArray[i];

        // work out which date value is closest to the mouse
        try {
            var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;
        } catch (e) { return; }

        var x = xScale(d.date);
        var y = mouse[1];
        //console.log(showIndicator); 
        // vertical line
        if (showIndicator === true) {
            focus.select('#focusLineX1')
                .attr('x1', x).attr('y1', yScale1(yDomain1[0] - 120))
                .attr('x2', x).attr('y2', yScale1(yDomain1[1]));
            focus.select('#focusLineX2')
                .attr('x1', x).attr('y1', yScale2(yDomain2[0]))
                .attr('x2', x).attr('y2', yScale2(yDomain2[1]));
        } else {
            focus.select('#focusLineX1')
                .attr('x1', x).attr('y1', yScale1(yDomain1[0]))
                .attr('x2', x).attr('y2', yScale1(yDomain1[1]));
        }
        
        // horizontal line
        focus.select('#focusLineY')
            .attr('x1', xScale(xDomain[0])).attr('y1', y)
            .attr('x2', xScale(xDomain[1])).attr('y2', y);

        displayData(d);
        renderShowMeDialog(i);
        
    };

    function renderShowMeDialog(i){
        //console.log(i);
        //$('#dialog').dialog('open');
        
    }

    function displayData(d) {
        //console.log(d);
        var message = "";
        var formatTime = d3.timeFormat("%m/%d/%Y");
        var date = formatTime(d.date); // "June 30, 2015"
        //var date = new Date(d.date);
        //console.log(date);
        //var parseDate = d3.timeParse("%");
        //var date = parseDate(d.date);
        //console.log(parseDate(date));
        message = "date: " + date + " open: " + d.open + " high: " + d.high + " low: " + d.low + " close: " + d.close;
        $("#dataheader").html(message);
    }

    var Ver = function () {
        
        var mouse = d3.mouse(this);
        var mouseDate = xScale.invert(mouse[0]);
        
        var i = bisectDate(dataArray, mouseDate); // returns the index to the current data item
        
        var d0 = dataArray[i - 1];
        var d1 = dataArray[i];

        // work out which date value is closest to the mouse
        try {
            var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;
        } catch (e) { return; }

        var x = xScale(d.date);
        var y = mouse[1];
        
        // vertical line
        if (showIndicator === true) {
            focus.select('#focusLineX1')
                .attr('x1', x).attr('y1', yScale1(yDomain1[0] - 120))
                .attr('x2', x).attr('y2', yScale1(yDomain1[1]));
            focus.select('#focusLineX2')
                .attr('x1', x).attr('y1', yScale2(yDomain2[0]))
                .attr('x2', x).attr('y2', yScale2(yDomain2[1]));
        } else {
            focus.select('#focusLineX1')
                .attr('x1', x).attr('y1', yScale1(yDomain1[0]))
                .attr('x2', x).attr('y2', yScale1(yDomain1[1]));
        }
    };

    var Hor = function () {

        var mouse = d3.mouse(this);

        var mouseDate = xScale.invert(mouse[0]);
        var i = bisectDate(dataArray, mouseDate); // returns the index to the current data item

        var d0 = dataArray[i - 1];
        var d1 = dataArray[i];
        // work out which date value is closest to the mouse
        try {
            var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;
        } catch (e) { return; }

        var x = xScale(d.date);
        var y = mouse[1];

        // horizontal line
        focus.select('#focusLineY')
            .attr('x1', xScale(xDomain[0])).attr('y1', y)
            .attr('x2', xScale(xDomain[1])).attr('y2', y);
    };
    
        return zoomChart;
};
