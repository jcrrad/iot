var timeDelay = 2.5 * 1000;

$(function() {
    var data;
    $.ajax({
        type: "GET",
        url: "/previous",
        success: function(response) {
            var chart = $('#NameHere').highcharts({
                chart: {
                    type: 'spline',
                    animation: Highcharts.svg, // don't animate in old IE
                    marginRight: 10,
                    events: {
                        load: function() {
                            var a = this.series[0];
                            var b = this.series[1];
                            setInterval(function() {
                                $.ajax({
                                    type: "GET",
                                    url: "/current",
                                    success: function(response) {

                                        var x = (new Date()).getTime(),
                                            y = Math.random() * 10;
                                        a.addPoint(response[0], false, true);
                                        b.addPoint(response[1], true, true);
                                    }
                                })
                            }, timeDelay);
                        }
                    }
                },
                title: {
                    text: 'Temperature'
                },

                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        second: '%I:%M:%S',
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
                            return this.value + ' ºC';
                        }
                    }
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y} ºC</b><br/>',
                    shared: true,

                    legend: {
                        enabled: false
                    }
                },
                series: response
            })
        }
    })
    var addPoint = function() {
        $.ajax({
            type: "GET",
            url: "/current",
            success: function(response) {

                //chart.series[0].addPoint(Math.random() * 100, true, true);
            }
        })
    };
});

var onLoad = function() {
    var label = this.renderer.label('Chart loaded', 100, 120)
        .attr({
            fill: Highcharts.getOptions().colors[0],
            padding: 10,
            r: 5,
            zIndex: 8
        })
        .css({
            color: '#FFFFFF'
        })
        .add();

    setTimeout(function() {
        label.fadeOut();
    }, 1000);
}

var cToF = function(degree) {
    return degree * 9 / 5 + 32;
}
