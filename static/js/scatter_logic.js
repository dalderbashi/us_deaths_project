const scatterUrl = "./output/medicare_deaths_chart.json";

let year = 2014;
let cause = "All causes"
    // Fetch the JSON data and console log it
d3.json(scatterUrl, function(data) {
    console.log(data);
    const points = data.filter(function(record) {
        return record.Year === year &&
            record["Cause Name"] === cause



    }).map(function(record) {
            return {
                label: record.State,
                backgroundColor: "#76FF03",
                borderColor: "#64DD17",
                data: [{
                    x: record.normalized_deaths,
                    y: record.normalized_medicare_spending,
                    r: 8
                }]
            }

        }

    )
    var ctx = document.getElementById('bubble-chart').getContext('2d');
    var scatterChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: points
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    gridLines: {
                        display: false
                    }


                }],
                yAxes: [{
                    gridLines: {
                        display: false
                    }
                }]


            },
            legend: {
                display: false

            },
            layout: {
                padding: {
                    left: 0,
                    right: 10,
                    top: 10,
                    bottom: 0
                }

            }

        }

    });
});