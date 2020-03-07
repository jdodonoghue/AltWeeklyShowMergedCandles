
    var countDays = function (range) {
        return range / (1000 * 60 * 60 * 24);
    };
    var countWeeks = function(range) {
        return range / ((1000 * 60 * 60 * 24) /7);
    };

    function calculateTickWidth(scale, fromDate, toDate) {
        var scaleRange = scale.range(),
            dayRange = moment().range(fromDate, toDate);
        return (scaleRange[1] - scaleRange[0]) / ((countDays(dayRange) * 2.5) / 7);
    };

