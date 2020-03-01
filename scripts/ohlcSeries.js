
    sl.series.ohlc = function () {

        var xScale = d3.scaleTime(),
            yScale = d3.scaleLinear();

        var isUpDay = function(d) {
            return d.close > d.open;
        };
        var isDownDay = function (d) {
            return !isUpDay(d);
        };

        var tickWidth = 5;

        var line = d3.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            });

        var highLowLines = function(bars) {

            var paths = bars.append('path');

            paths.classed('high-low-line', true)
                .attr('d', function (d) {
                    return line([
                        { x: xScale(d.date), y: yScale(d.high) },
                        { x: xScale(d.date), y: yScale(d.low) }
                    ]);
                });

        };

        var openCloseTicks = function (bars) {

            var open = bars.append('path');
            var close = bars.append('path');

            open.classed('open-tick', true)
                .attr('d', function (d) {
                    return line([
                        { x: xScale(d.date) - tickWidth, y: yScale(d.open) },
                        { x: xScale(d.date), y: yScale(d.open) }
                    ]);
                });

            close.classed('close-tick', true)
                .attr('d', function (d) {
                    return line([
                        { x: xScale(d.date), y: yScale(d.close) },
                        { x: xScale(d.date) + tickWidth, y: yScale(d.close) }
                    ]);
                });

            open.exit().remove();
            close.exit().remove();
            
        };

        var ohlc = function(selection) {
            var series, bars;
            
            selection.each(function(data) {
                
                series = d3.select(this);

                series.enter().append('g').classed('ohlc-series', true);

                var ohlcseries = series.append('g')
                    .classed('ohlc-series', true);

                bars = ohlcseries.selectAll("g")
                    .data(data, function (d) {
                        return [d];
                    })
                    .enter().append('g')
                    .classed('bar', true)
                    .classed('up-day', isUpDay)
                    .classed('down-day', isDownDay);

                highLowLines(bars);
                openCloseTicks(bars);

                bars.exit().remove();

            });
        };


        ohlc.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return ohlc;
        };

        ohlc.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return ohlc;
        };

        ohlc.tickWidth = function (value) {
            if (!arguments.length) {
                return tickWidth;
            }
            tickWidth = value;
            return ohlc;
        };

        return ohlc;

    };
