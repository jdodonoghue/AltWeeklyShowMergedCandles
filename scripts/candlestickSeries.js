
    sl.series.candlestick = function () {
        
        var xScale = d3.scaleTime(),
            yScale = d3.scaleLinear();

        var rectangleWidth = 3;

        var isUpDay = function(d) {
            return d.close > d.open;
        };
        var isDownDay = function (d) {
            return !isUpDay(d);
        };
        
        var line = d3.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            });
        
        var highLowLines = function (bars) {

            var paths = bars.append('path');
            paths.classed('high-low-line', true)
                .attr('d', function(d) {
                    return line([
                        { x: xScale(d.date), y: yScale(d.high) },
                        { x: xScale(d.date), y: yScale(d.low) }
                    ]);
                });

            paths.classed('high-low-line', true)
                .attr('d', function (d) {
                    return line([
                        { x: xScale(d.date), y: yScale(d.high) },
                        { x: xScale(d.date), y: yScale(d.low) }
                    ]);
                });
        };

        var rectangles = function (bars) {
            
            var rect = bars.append('rect');
            
            rect.attr('x', function (d) {
                return xScale(d.date) - rectangleWidth;
            })
                .attr('y', function(d) {
                    return isUpDay(d) ? yScale(d.close) : yScale(d.open);
                })
                .attr('width', rectangleWidth * 2)
                .attr('height', function(d) {
                    return isUpDay(d) ?
                        yScale(d.open) - yScale(d.close) :
                        yScale(d.close) - yScale(d.open);
                });
        };

        var candlestick = function(selection) {
            var series, bars;
            
            selection.each(function(data) {
                series = d3.select(this).selectAll('.candlestick-series').data([data]);
            
                var candlestickseries = series.enter().append('g')
                    .classed('candlestick-series', true);
                
                var bars = candlestickseries.selectAll("g")
                    .data(data, function(d) {
                       return [d];
                   })
                    .enter().append('g')
                    .classed('bar', true)
                    .classed('up-day', isUpDay)
                    .classed('down-day', isDownDay);
                
            
                highLowLines(bars);
                rectangles(bars);

                bars.exit().remove();
            });
        };

        candlestick.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return candlestick;
        };

        candlestick.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return candlestick;
        };

        candlestick.rectangleWidth = function (value) {
            if (!arguments.length) {
                return rectangleWidth;
            }
            rectangleWidth = value;
            return candlestick;
        };

        return candlestick;

    };
