
function preRender(){
    
    var symbol = document.getElementById("selCommidity").value;
    var startDay = document.getElementById("selWeekStart").value;
    
    d3.select("#chart").select("svg").remove();
    if (symbol == 0) return;
    
    var fromDate = new Date("2018-01-01");
    var toDate = new Date("2019-12-31");

    var file = "data/" + "AltWeekly" + ".csv";
    d3.csv(file).then(function (data) {
        var i = 1;
        data.forEach(function (d) {
            d.date = new Date(d.date);
            d.open = +d.open;
            d.high = +d.high;
            d.low = +d.low;
            d.close = +d.close;
            d.startday = +d.startday;
            d.id = i++;
        });
        var data1 = data.filter(function(d) {
            return (d.startday == startDay && d.date >= fromDate && d.date <= toDate && d.symbol == symbol );
        });
        render(data1);
    });

}

function render(data, chartType){
    var i = 1;
    data.forEach(function (d) {
        //console.log(d.id);
        d.date = new Date(d.date);
        d.open = +d.open;
        d.high = +d.high;
        d.low = +d.low;
        d.close = +d.close;
        d.id = i++;;
    });
    //console.log();
    fromDate = d3.min(data, function (d) { return d["date"]; });
    toDate = d3.max(data, function (d) { return d["date"]; });

    var inputwidth = 800;
    var inputheight = 400;

    var dataArray = data;

    chart1 = createChart(data);
    chart1.Name = "chart1";
    chart1.element = "#chart";
    chart1.inputwidth = inputwidth;
    chart1.inputheight = inputheight;
    chart1.Chart();
    
}    

function chooseCommodity(obj) {
        
    currentSymbol = obj.value;
    d3.select("#chart").select("svg").remove();
    if (obj.value == 0) return;
    
    //console.log(data);
    preRender();
    
    document.getElementById("btnCandleStick").disabled = false;
    document.getElementById("btnOHLC").disabled = false;
    document.getElementById("btnPTOn").disabled = false;

}


function chooseWeekStart(obj) {
    preRender();

}

function changeChartType(obj) {
    var btnCandleStick = document.getElementById("btnCandleStick");
    var btnOHLC = document.getElementById("btnOHLC");
    document.getElementById("selShowMerged").selectedIndex = 0;

    d3.select("#chart").select("svg").remove();
    d3.select("#dialog").select("svg").remove();
    if (obj.id == "btnCandleStick") {
        chartType = "CandleStick";
        
        preRender();
        
        btnCandleStick.className = "buttonActive1";
        btnOHLC.className = "buttonInActive";
    }
    if (obj.id == "btnOHLC") {
        chartType = "OHLC";
        
        preRender();

        btnOHLC.className = "buttonActive1";
        btnCandleStick.className = "buttonInActive";
        
    }
}

var setBtnStyle = function(obj){
    var btnPTOn = document.getElementById("btnPTOn");
    var btnVerOn = document.getElementById("btnVerOn");
    var btnHorOn = document.getElementById("btnHorOn");
    var btnOff = document.getElementById("btnOff");
    btnPTOn.className = "buttonInActive";
    btnVerOn.className = "buttonInActive";
    btnHorOn.className = "buttonInActive";
    btnOff.className = "buttonInActive";

    if (obj.id == "btnPTOn"){
        btnPTOn.className = "buttonActive2";
    }
    if (obj.id == "btnVerOn"){
        btnVerOn.className = "buttonActive2";
    }
    if (obj.id == "btnHorOn"){
        btnHorOn.className = "buttonActive2";
    }
    if (obj.id == "btnOff"){
        btnOff.className = "buttonActive2";
    }
}

function displayData(d) {
    var dataheader = document.getElementById("dataheader");
    var message = "";
    var formatTime = d3.timeFormat("%m/%d/%Y");
    var date = formatTime(d.date); // "June 30, 2015"
    
    message = "Date: " + date + " Open: " + d.open + " High: " + d.high + " Low: " + d.low + " Close: " + d.close;
    dataheader.innerHTML = message;
}

function displayDataOff() {
    var dataheader = document.getElementById("dataheader");
    var message = "";
    dataheader.innerHTML = message;
}