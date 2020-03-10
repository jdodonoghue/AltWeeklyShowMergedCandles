
function createChart(data) {

    var myChart = {};

    "use strict";
    myChart.Name = null;
    myChart.focus = null;
    myChart.svg = null;
    myChart.g = null;
    myChart.bisectDate = null;
    myChart.element = null;
    myChart.xScale = null;
    myChart.yScale1 = null;
    myChart.yScale2 = null;
    myChart.xAxis = null;
    myChart.yAxis1 = null;
    //myChart.yAxis2 = null;
    myChart.series = null;
    myChart.inputwidth = "";
    myChart.inputheight = "";
    myChart.xDomain = null;
    myChart.yDomain1 = null;
    myChart.yDomain2 = null;
    myChart.line = null;
    myChart.margin = null;
    myChart.width = null;;
    myChart.displayHeight = null;
    myChart.initialScale = null;
    myChart.date = null;
    myChart.id = null;
    myChart.dataArray = data;

    myChart.Chart = function () {
        
        xScale = d3.scaleTime();
        yScale1 = d3.scaleLinear();

        xAxis = d3.axisBottom().scale(xScale).ticks(5);

        yAxis1 = d3.axisLeft().scale(yScale1);

        line = d3.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });

        initialScale = d3.scaleLinear();
        
        var margin = { top: 20, right: 20, bottom: 30, left: 50 };
        var width = myChart.inputwidth - margin.left - margin.right;
        var heightSymbolChart = myChart.inputheight - margin.top - margin.bottom;
        displayHeight = heightSymbolChart;

        margin.left = margin.left + 50;
        
        // Create svg element
        svg = d3.select(myChart.element).classed('chart', true).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', displayHeight + margin.top + margin.bottom);
            
        // Ceate chart
        g = svg.append('g')
            .attr('id', 'g' + myChart.Name)
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            
        // Create plot area
        var plotArea = g.append('g');
        
        plotArea.append('rect')
            .attr('class', 'zoom-pane')
            .attr('width', width)
            .attr('height', heightSymbolChart);
        
        // Set scale domains
        xDomain = d3.extent(data, function (d) { return d.date; });
        xScale.domain(xDomain);
    
        var ymin1 = d3.min(data, function(d) { return d["low"]; });// - 50;
        var ymax1 = d3.max(data, function(d) { return d["high"]; });// + 50;
        var yRangePercent1 = (ymax1 - ymin1) * 0.05;
        yDomain1 = [ymin1 - yRangePercent1, ymax1 + yRangePercent1];
        yScale1.domain(yDomain1);
            
        var ymin2 = d3.min(data, function(d) { return d["noncommnet"]; });
        var ymin3 = d3.min(data, function(d) { return d["commnet"]; });

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
            
        // Set scale ranges
        xScale.range([0, width]);
        yScale1.range([heightSymbolChart, 0]);

        if (chartType === "CandleStick") {
            var series = candlestickSeries()
                .xScale(xScale)
                .yScale(yScale1);
        }
        if (chartType === "OHLC") {
            var series = ohlcSeries()
                .xScale(xScale)
                .yScale(yScale1);
            series.tickWidth(calculateTickWidth(xScale, fromDate, toDate));
        }

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
        
        if (myChart.Name == "chart1") {
            myChart.addFocusLines(data, g);
        }
        initialScale = yScale1.copy();
        
    };


    myChart.addFocusLines = function (data, g) {
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
       
    myChart.Chart.initialScale = function () {
        return initialScale;
    };


    myChart.focusOn = function (fn) {
        if (myChart.Name == "chart1") {
            myChart.clearFocus();
            g.on('mouseover', function () { focus.style('display', null); });
            g.on('mouseout', function () { focus.style('display', 'none'); })
            g.on('mousemove', fn);
            
        }
        
    }

    myChart.Ver = function () {
            
        var mouse = d3.mouse(this);
        var mouseDate = xScale.invert(mouse[0]);
        
        var i = bisectDate(data, mouseDate); // returns the index to the current data item
        
        var d0 = data[i - 1];
        var d1 = data[i];

        // work out which date value is closest to the mouse
        try {
            var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;
        } catch (e) { return; }

        var x = xScale(d.date);
        var y = mouse[1];
        
        // vertical line
        focus.select('#focusLineX1')
            .attr('x1', x).attr('y1', yScale1(yDomain1[0]))
            .attr('x2', x).attr('y2', yScale1(yDomain1[1]));
        
    };

    myChart.Hor = function () {

        var mouse = d3.mouse(this);

        var mouseDate = xScale.invert(mouse[0]);
        var i = bisectDate(data, mouseDate); // returns the index to the current data item

        var d0 = data[i - 1];
        var d1 = data[i];
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

    myChart.VerHor = function () {
        //console.log(data);
            
        var mouse = d3.mouse(this);
        var mouseDate = xScale.invert(mouse[0]);
                
        var i = bisectDate(data, mouseDate); // returns the index to the current data item
        
        var d0 = data[i - 1];
        var d1 = data[i];
        //console.log(d1);
        // work out which date value is closest to the mouse
        try {
            var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;
        } catch (e) { return; }

        var x = xScale(d.date);
        var y = mouse[1];

        // vertical line
        focus.select('#focusLineX1')
            .attr('x1', x).attr('y1', yScale1(yDomain1[0]))
            .attr('x2', x).attr('y2', yScale1(yDomain1[1]));
        
        // horizontal line
        focus.select('#focusLineY')
            .attr('x1', xScale(xDomain[0])).attr('y1', y)
            .attr('x2', xScale(xDomain[1])).attr('y2', y);
        //console.log(d.id);
        displayData(d, data);
    };

    myChart.VerHorMergedDialog = function () {
        //console.log(data);
            
        var mouse = d3.mouse(this);
        var mouseDate = xScale.invert(mouse[0]);
                
        var i = bisectDate(data, mouseDate); // returns the index to the current data item
        
        var d0 = data[i - 1];
        var d1 = data[i];
        
        // work out which date value is closest to the mouse
        try {
            var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;
        } catch (e) { return; }

        var x = xScale(d.date);
        var y = mouse[1];

        
        myChart.date = d.date;
        myChart.id = d.id;
        
        // vertical line
        focus.select('#focusLineX1')
            .attr('x1', x).attr('y1', yScale1(yDomain1[0]))
            .attr('x2', x).attr('y2', yScale1(yDomain1[1]));
        
        // horizontal line
        focus.select('#focusLineY')
            .attr('x1', xScale(xDomain[0])).attr('y1', y)
            .attr('x2', xScale(xDomain[1])).attr('y2', y);
        //console.log(data);
        loadMergedDialog(d.id, data);
        displayData(d, data);
    };

    


    myChart.VerHorInsideDialog = function () {
        //console.log(data);
            
        var mouse = d3.mouse(this);
        var mouseDate = xScale.invert(mouse[0]);
                
        var i = bisectDate(data, mouseDate); // returns the index to the current data item
        
        var d0 = data[i - 1];
        var d1 = data[i];
        
        // work out which date value is closest to the mouse
        try {
            var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;
        } catch (e) { return; }

        var x = xScale(d.date);

        var y = mouse[1];
        
        // vertical line
        focus.select('#focusLineX1')
            .attr('x1', x).attr('y1', yScale1(yDomain1[0]))
            .attr('x2', x).attr('y2', yScale1(yDomain1[1]));
        
        // horizontal line
        focus.select('#focusLineY')
            .attr('x1', xScale(xDomain[0])).attr('y1', y)
            .attr('x2', xScale(xDomain[1])).attr('y2', y);

        loadInsideDialog(d.id, data);
        displayData(d);
    };

    myChart.clearFocus = function () {
        focus.select('#focusLineX1')
            .attr('x1', 0).attr('y1', 0)
            .attr('x2', 0).attr('y2', 0);
        focus.select('#focusLineX2')
            .attr('x1', 0).attr('y1', 0)
            .attr('x2', 0).attr('y2', 0);
        focus.select('#focusLineY')
            .attr('x1', 0).attr('y1', 0)
            .attr('x2', 0).attr('y2', 0);
    }

    myChart.focusOff = function () {
        myChart.clearFocus();
        g.on('mouseover', null);
        g.on('mouseout', null);
        g.on('mousemove', null);
        displayDataOff();
    }

    return myChart;
}
