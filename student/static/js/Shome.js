var xValues = [];
var yValues = [];
var barColors = ["red", "green","blue","orange","brown"];

for (let index = 0; index < data.length; index++) {
  xValues.push(data[index].subject_name);
  yValues.push(data[index].attendance);
}
yValues.push(45);
yValues.push(0);

new Chart("myChart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Attendance"
    }
  }
});