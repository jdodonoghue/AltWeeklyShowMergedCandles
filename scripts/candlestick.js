    
    function render(data){
        
        // display date format
        var parseDate = d3.timeFormat("%d-%b-%y");
        
        data.forEach(function (d) {
            
            if (d.id === 0) {
                d.date = new Date(d.date);
                d.open = +0;
                d.high = +0;
                d.low = +0;
                d.close = +0;
                
                d.id = d.id;
            } else {
                d.date = new Date(d.date);
                d.open = +d.open;
                d.high = +d.high;
                d.low = +d.low;
                d.close = +d.close;
                
                d.id = d.id;
            }
        });
        
        var margin = { top: 30, right: 20, bottom: 30, left: 50 },
            width = 600 - margin.left - margin.right,
            height = 470 - margin.top - margin.bottom;
                
        var xScaleTime = d3.scaleTime(),
            xScaleNum = d3.scaleLinear(),
            yScale = d3.scaleLinear(),
            yScaleInd = d3.scaleLinear();
            
        // x scale
        xScaleTime.domain(d3.extent(data, function (d) { return d.date; }));

        //xScaleNum.domain(d3.extent(data, function (d) { return d.id; }));
        
        var xMin = d3.min(data, function (d) { return d.id; });// - 50;
        var xMax = d3.max(data, function (d) { return d.id; });// + 50;
        
        xScaleNum.domain(xMin - 10, xMax);

        //yScale.domain([500, 10000]);
        yScale.domain(yScale);
        //yScaleInd.domain([500, 10000]);

        // x axis
        var xAxisTime = d3.axisBottom().scale(xScaleTime).ticks(15);
        var xAxisNum = d3.axisBottom().scale(xScaleNum).ticks(15);
        var yAxis = d3.axisLeft().scale(yScale);
        var yAxisInd = d3.axisLeft().scale(yScaleInd);
            
        var series = sl.series.candlestick()
            .xScale(xScaleNum)
            .yScale(yScale);
        //console.log(series);

        // Create svg element
        var svg = d3.select('#chart').classed('chart', true).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom + 250);
        
        // Ceate chart
        var plotArea = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        
        //plotArea.append('clipPath')
        //    .attr('id', 'plotAreaClip')
        //    .append('rect')
        //    .attr({ width: width, height: height });

        //plotArea.attr('clip-path', 'url(#plotAreaClip)');

        //var g = svg.append('g')
        //    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        
        // Set scale ranges
        xScaleTime.range([0, width]);
        xScaleNum.range([0, width]);
        //yScale.range([height, 0]);
        yScale.range([350, 0]);
        yScaleInd.range([height + 140, height + 10]);

        // y scale
        var ymin = d3.min(data, function (d) { return d["low"]; });// - 50;
        var ymax = d3.max(data, function (d) { return d["high"]; });// + 50;
        
        var yRangePercent = (ymax - ymin) * 0.05;
        yScale.domain([ymin - yRangePercent, ymax + yRangePercent]);
        
        // Draw axes
        height = height + 150;
        svg.append('g')
           .attr('class', 'x axis')
           .attr('transform', 'translate(0,' + height + ')')
           .call(xAxisNum);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        //g.append('g')
        //    .attr('class', 'y axis')
        //    .call(yAxisInd);
                //.append('text')
                //.attr('transform', 'rotate(-90)')
                //.attr('y', 6)
                //.attr('height', 100)
                ////.attr('transform', 'translate(0, ' + height + ')')
                //.attr('dy', '.71em')
                //.attr('text-anchor', 'start')
                //.text(yLabelInd);


        //var rectangleWidth = Math.floor((1 / Math.sqrt(maxId) * 50)) - 2;
        var rectangleWidth = 1;
        //console.log(rectangleWidth);
        series.rectangleWidth(rectangleWidth);
        
        //var line = d3.line()
        //    .x(function (d) { return xScaleNum(d.id); })
        //    .y(function (d) { return yScaleInd(d.commnet); });

        //var lineSN = d3.line()
        //    .x(function (d) { return xScaleNum(d.id); })
        //    .y(function (d) { return yScaleInd(d.specnet); });

        //g.append("g")
        //    .datum(data)
        //    .attr('class', 'line')
        //    .attr('d', line);

        //plotArea.append("g")
        //    .attr("class", "series")
        //    .attr("d", lineSN(data));

        //plotArea.append("g")
        //    .attr("class", "series")
        //    .datum(data)
        //    .call(lineSN);
        //    //.attr("d", lineSN(data))
        
        // Draw series.
        plotArea.append('g')
            .attr('class', 'series')
            //.attr({ width: width, height: height })
            .datum(data)
            .call(series);
        
    }
    
