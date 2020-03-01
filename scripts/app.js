function chooseCommodity(obj) {
        
    currentSymbol = obj.value;
    d3.select("#chart").select("svg").remove();
    if (obj.value == 0) return;
    
    var file = "data/" + currentSymbol + "Weekly" + ".csv";
    d3.csv(file).then(function (data) {
        render(data);
    });

    document.getElementById("btnCandleStick").disabled = false;
    document.getElementById("btnOHLC").disabled = false;
    document.getElementById("btnPTOn").disabled = false;

}

function chooseWeekStart(obj) {
    startday = obj.value;
    d3.select("#chart").select("svg").remove();
    if (obj.value == 0) return;
    
    var file = "data/" + currentSymbol + "Weekly" + ".csv";
    d3.csv(file).then(function (data) {
        render(data);
    });
}

function changeChartType(obj) {

    if (obj.id == "btnCandleStick") {
        chartType = "CandleStick";
        d3.select("#chart").select("svg").remove();
    
        var file = "data/" + currentSymbol + "Weekly" + ".csv";
        d3.csv(file).then(function (data) {
            render(data, chartType);
        });
        $("#btnCandleStick").css("background-color", "rgb(69, 140, 161)");
        $("#btnCandleStick").css("color", "white");
        $("#btnOHLC").css("background-color", "");
        $("#btnOHLC").css("color", "");
    }
    if (obj.id == "btnOHLC") {
        chartType = "OHLC";
        d3.select("#chart").select("svg").remove();
    
        var file = "data/" + currentSymbol + "Weekly" + ".csv";
        d3.csv(file).then(function (data) {
            render(data, chartType);
        });
        $("#btnOHLC").css("background-color", "rgb(69, 140, 161)");
        $("#btnOHLC").css("color", "white");
        $("#btnCandleStick").css("background-color", "");
        $("#btnCandleStick").css("color", "");
    }
}

var setBtnStyle = function(obj){

    if (obj.id == "btnOff"){
        $("#btnPTOn").css("background-color", "");
        $("#btnPTOn").css("color", "");
    }
    if (obj.id == "btnPTOn"){
        $("#btnPTOn").css("background-color", "rgb(69, 140, 161)");
        $("#btnPTOn").css("color", "white");
    }

}

var focusOn = function (fn) {
    clearFocus();
    g.on('mouseover', function () { focus.style('display', null); })
    g.on('mouseout', function () { focus.style('display', 'none'); })
    g.on('mousemove', fn);
}

var focusOff = function () {
    clearFocus();
    g.on('mouseover', null);
    g.on('mouseout', null);
    g.on('mousemove', null);
    //$('#dialog').dialog('close');
}

var clearFocus = function () {
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

var showMerged = function(){
    console.log("showMerged");
}

function zoomed() {

    var transform = d3.event.transform;
    var xDomain = xScale.domain();

    var range = moment().range(xDomain[0], xDomain[1]);

    var filteredData = [];
    var g = d3.selectAll('svg').select('g');

    for (var i = 0; i < dataArray.length; i += 1) {
        if (range.contains(dataArray[i].date)) {
            filteredData.push(dataArray[i]);
        }
    }

    g.select('.x.axis')
        .call(xAxis);

    var ymin1 = d3.min(filteredData, function (d) { return d["low"]; });// - 50;
    var ymax1 = d3.max(filteredData, function (d) { return d["high"]; });// + 50;
    var yRangePercent1 = (ymax1 - ymin1) * 0.05;
    var yDomain1 = [ymin1 - yRangePercent1, ymax1 + yRangePercent1];
    yScale1.domain(yDomain1);
    
    var xNewScale = transform.rescaleX(xScale);
    xAxis.scale(xNewScale);
    
    g.select('.x.axis')
        .call(xAxis);

    var yNewScale1 = transform.rescaleY(yScale1);
    
    yAxis1.scale(yNewScale1);
    g.select('.y.axis')
        .call(yAxis1);

    //
    var ymin1 = d3.min(filteredData, function (d) { return d["specnet"]; });
    var ymin2 = d3.min(filteredData, function (d) { return d["noncommnet"]; });
    var ymin3 = d3.min(filteredData, function (d) { return d["commnet"]; });

    var ymax1 = d3.max(filteredData, function (d) { return d["specnet"]; });
    var ymax2 = d3.max(filteredData, function (d) { return d["noncommnet"]; });
    var ymax3 = d3.max(filteredData, function (d) { return d["commnet"]; });

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
    /*
    var yRangePercent2 = (ymax1 - ymin1) * 0.05;
    yDomain2 = [ymin1 - yRangePercent2, ymax2 + yRangePercent2];
    yScale2.domain(yDomain2);
    
    if (showIndicator == true) {
        g.select('#yIndAxis')
            .call(yAxis2);

        g.select(".indicatorline1")
            .attr("d", indicatorline1(filteredData));

        g.select(".indicatorline2")
            .attr("d", indicatorline2(filteredData));

        g.select(".indicatorline3")
            .attr("d", indicatorline3(filteredData));
    }
    */
    if (chartType == "CandleStick") {

        //series = sl.series.candlestick()
        //    .xScale(xScale)
        //    .yScale(yScale1);

    }
    if (chartType == "OHLC") {

        //series = sl.series.ohlc()
        //    .xScale(xScale)
        //    .yScale(yScale1);

        //fromDate = d3.min(filteredData, function (d) { return d["date"]; });
        //toDate = d3.max(filteredData, function (d) { return d["date"]; });

        //series.tickWidth(calculateTickWidth(xScale, fromDate, toDate));

    }

    g.select('.series').attr("transform", "translate(" + transform.x + "," + 0 + ") scale(" + transform.k + ")");
    g.select('.series')
        .call(series);


}

function zoomend() {

}