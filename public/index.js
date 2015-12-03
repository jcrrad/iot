var minutes = .5;
var seconds = 0;
var timeDelay = minutes * 60000 + seconds * 1000;
var updateChart = function() {
    $.ajax({
        type: "GET",
        url: "/previous",
        success: function(response) {
            response = JSON.parse(response);
            console.log(response);
            $('#NameHere').highcharts({
                chart: {
                    type: 'spline',
                    animation: Highcharts.svg, // don't animate in old IE
                    marginRight: 10
                },
                title: {
                    text: 'Temperature'
                },

                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        second: '%I:%M:%S %p',
                        minute: '%I:%M %p',
                        hour: '%I:%M %p'

                    },
                    title: {
                        text: 'Date'
                    }
                },
                yAxis: {
                    type: 'Temperature',
                    title: {
                        text: 'Temperature'
                    },
                    labels: {
                        formatter: function() {
                            return this.value + ' ºF';
                        }
                    }
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y:,.2f} ºF</b><br/>',
                    shared: true,
                    legend: {
                        enabled: false
                    }
                },
                series: response
            })
        }
    })
}
$(function() {
    updateChart();

    setInterval(function() {
        checkAlarms();
        updateChart();
    }, timeDelay);
});

function checkAlarms() {
    $.ajax({
        type: "GET",
        url: "/alarms",
        success:function(reponse){
            alert("STOP");
        }
    })
}

function setTargetTemp(sensor) {
    var temp = prompt("Please enter desired Temp on sensor 1", "155");
    if (temp != null) {
        $.ajax({
            type: "get",
            url: "/temp/" + sensor + "/" + temp,
            success: function(response) {
                alert("Temperature\t:" + temp + "\nSensor\t:" + Sensor);
            }
        });
    }
}


function setTargetTime() {
    var delta = prompt("Please enter desired Timer(mins)", "15");
    if (delta != null) {
        $.ajax({
            type: "GET",
            url: "/time/" + sensor + "/" + temp,
            success: function(response) {
                alert("Timer\t:" + delta);
            }
        });
    }
}
