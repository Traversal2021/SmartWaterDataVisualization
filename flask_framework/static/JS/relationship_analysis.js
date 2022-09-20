const sensor_list=[
    'relationship_sensor1','relationship_sensor2','relationship_sensor3','relationship_sensor4','relationship_sensor5','relationship_sensor6'
    ,'relationship_sensor7','relationship_sensor8','relationship_sensor9','relationship_sensor10','relationship_sensor11'
]

var parameter_list ={
    'sensor1':'Temperature' ,
    'sensor2':'Electrical Conductivity' ,
    'sensor3':'Specific Conductivity',
    'sensor4':'Salinity PPT',
    'sensor5':'PH',
    'sensor6':'ODO SAT',
    'sensor7':'Turbidity NTU',
    'sensor8':'Turbidity FNU',
    'sensor9':'sensor9',
    'sensor10':'fDOM RFU',
    'sensor11':'fDOM OSU',

} 
var unit_list={
    'sensor1':' °C' ,
    'sensor2':'μs/cm' ,
    'sensor3':'μs/cm',
    'sensor4':'PPT',
    'sensor5':'PH',
    'sensor6':'ODO SAT',
    'sensor7':'NTU',
    'sensor8':'FNU',
    'sensor9':'sensor9',
    'sensor10':'RFU',
    'sensor11':'OSU', 
}

const charts_element = document.getElementById('relationship_graph_container')
const submit_button= document.getElementById('relationship_submit')

//add click event to button
submit_button.addEventListener('click', function(){

    while (charts_element.firstChild) {
        charts_element.removeChild(charts_element.lastChild);
      }

    //get selected sensor list
    var selected_sensors=[]
    sensor_list.forEach(function(sensor){
        var sensor_checkbox = document.getElementById(sensor)
        if(sensor_checkbox.checked == true){
            selected_sensors.push(sensor_checkbox.value)
        }
    }) 

    //check if 2 sensors are selected or not
    // if(selected_sensors.length!=2){
    //     alert("Please select 2 sensors")
    //     return
    // }

    relationship_datta_draw(selected_sensors)
    
})

function relationship_datta_draw(selected_sensors){
    fetch('/relationship_data?selected_sensors='+selected_sensors)
    .then(function (response) {
        return response.json();
    }).then(function (text) {

        for (i=0;i<selected_sensors.length;i++){
            var plot_data=[]
            for (j=1; j<=81; j++){
                plot_data.push({
                    "x": j,
                    "y":text[selected_sensors[i]][j]
                })
            }

            relationship_plot(plot_data, selected_sensors[i])
        }

    });
}

function relationship_plot(plot_data,selected_sensor){


    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#relationship_graph_container")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px")
        .text(parameter_list[selected_sensor]);
    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
        .domain([0,82])
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", (width / 2))
        .attr("y", height + 30)
        .text("Depth(m)");
  
    // Add Y axis
    const y = d3.scaleLinear()
        .domain([d3.min(plot_data, function(d) { return +d.y; }), d3.max(plot_data, function(d) { return +d.y; })])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y))
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text(unit_list[selected_sensor]);

    // Add the line
    svg.append("path")
        .datum(plot_data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.x) })
            .y(function(d) { return y(d.y) })
            )


    // console.log(plot_data)

    // // set the dimensions and margins of the graph
    // const margin = {top: 10, right: 30, bottom: 30, left: 60},
    //     width = 460 - margin.left - margin.right,
    //     height = 400 - margin.top - margin.bottom;

    // // append the svg object to the body of the page
    // const svg = d3.select("#relationship_graph_container")
    //     .append("svg")
    //         .attr("width", width + margin.left + margin.right)
    //         .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //         .attr("transform", `translate(${margin.left},${margin.top})`);

    // // Add X axis --> it is a date format
    // const x = d3.scaleLinear()
    //     .domain([ 0, 82])
    //     .range([ 0, width ]);
    // svg.append("g")
    //     .attr("transform", `translate(0, ${height})`)
    //     .call(d3.axisBottom(x))
    //     .append("text")
    //     .attr("class", "x label")
    //     .attr("text-anchor", "end")
    //     .attr("x", width)
    //     .attr("y", height - 6)
    //     .text(selected_sensors);
  
    // // Add Y axis
    // const y = d3.scaleLinear()
    //     .domain([d3.min(plot_data, function(d) { return +d.value; }), d3.max(plot_data, function(d) { return +d.value; })])
    //     .range([ height, 0 ]);
    // svg.append("g")
    //     .call(d3.axisLeft(y))
    //     .append("text")
    //     .attr("class", "y label")
    //     .attr("text-anchor", "end")
    //     .attr("y", 6)
    //     .attr("dy", ".75em")
    //     .attr("transform", "rotate(-90)")
    //     .text(selected_sensors[1]);

    // // Add dots
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(plot_data)
    //     .join("circle")
    //         .attr("cx", x(function (d) { return x(d.x); }) )
    //         .attr("cy", y(function (d) { return y(d.y); } ))
    //         .attr("r", 1.5)
    //         .style("fill", "#69b3a2")
}