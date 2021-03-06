var minutes = .5;
var seconds = 0;
var timeDelay = minutes * 60000 + seconds * 1000;
var updateChart = function () {
    $.ajax({
        type: "GET",
        url: "/previous",
        success: function (response) {
            console.log(response);
            $('#TempChart').highcharts({
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
                        formatter: function () {
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
$(function () {
    updateChart();
});
