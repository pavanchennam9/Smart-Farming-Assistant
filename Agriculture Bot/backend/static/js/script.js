let cropHistory = [];
let pieChart = null;

function sendData() {

    const data = {
        N: parseFloat(document.getElementById("N").value),
        P: parseFloat(document.getElementById("P").value),
        K: parseFloat(document.getElementById("K").value),
        temperature: parseFloat(document.getElementById("temperature").value),
        humidity: parseFloat(document.getElementById("humidity").value),
        ph: parseFloat(document.getElementById("ph").value),
        rainfall: parseFloat(document.getElementById("rainfall").value)
    };

    fetch("/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        if (result.error) {
            document.getElementById("resultBox").innerHTML =
                "⚠ Error: " + result.error;
        } else {
            const recommendedCrop = result.recommended_crop;
            document.getElementById("resultBox").innerHTML =
                "🌱 Recommended Crop: <b>" + recommendedCrop + "</b>";
            
            // Add to history
            cropHistory.push(recommendedCrop);
            
            // Update pie chart
            updatePieChart();
            
            // Show chart container and clear button
            document.getElementById("chartContainer").style.display = "block";
            document.getElementById("clearBtn").style.display = "block";
        }
    })
    .catch(error => {
        document.getElementById("resultBox").innerHTML =
            "⚠ Error connecting to server";
    });
}

function updatePieChart() {
    // Count crop frequencies
    const cropCounts = {};
    cropHistory.forEach(crop => {
        cropCounts[crop] = (cropCounts[crop] || 0) + 1;
    });
    
    const labels = Object.keys(cropCounts);
    const data = Object.values(cropCounts);
    
    // Generate random colors for each crop
    const backgroundColors = generateColors(labels.length);
    
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    if (pieChart) {
        pieChart.data.labels = labels;
        pieChart.data.datasets[0].data = data;
        pieChart.data.datasets[0].backgroundColor = backgroundColors;
        pieChart.update();
    } else {
        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }
}

function generateColors(count) {
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
        '#8BC34A', '#FFC300', '#E91E63', '#009688', '#3F51B5'
    ];
    
    let result = [];
    for (let i = 0; i < count; i++) {
        result.push(colors[i % colors.length]);
    }
    return result;
}

function clearHistory() {
    cropHistory = [];
    document.getElementById("chartContainer").style.display = "none";
    document.getElementById("clearBtn").style.display = "none";
    document.getElementById("resultBox").innerHTML = "";
    
    if (pieChart) {
        pieChart.destroy();
        pieChart = null;
    }
}