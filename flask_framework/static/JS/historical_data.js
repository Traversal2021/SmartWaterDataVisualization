const sensor_list=[
    'sensor1','sensor2','sensor3','sensor4','sensor5','sensor6'
    ,'sensor7','sensor8','sensor9','sensor10','sensor11'
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
const charts_element = document.getElementById('graph_container')
const submit_button= document.getElementById('submit')
const frequency_element = document.getElementById('freqency_select')

const start_time_element=document.getElementById('start_time')
const end_time_element=document.getElementById('end_time')

const time_element = $( "#slider-range" )
const depth_element = document.getElementById("depth_slider")

//add click event to button
submit_button.addEventListener('click', function(){plot_control()})
depth_element.addEventListener('change', function(){
    var depth_text = document.getElementById('selected_depth')
    depth_text.value = "Selected depth: "+ document.getElementById("depth_slider").value +"m"
    plot_control()
})
time_element.on(
    "slidechange",
    function( event, ui ) {
        $( "#started_time" ).val( "Start time: "+ (new Date(ui.values[ 0 ]))); 
        $( "#end_time" ).val( "End time: "+ (new Date(ui.values[ 1 ]))); 
        plot_control()
    } 
)

function plot_control(){

    while (charts_element.firstChild) {
        charts_element.removeChild(charts_element.lastChild);
    }

    var start_time=(new Date($( "#slider-range" ).slider( "values", 0 ))).toISOString()
    var end_time=(new Date($( "#slider-range" ).slider( "values", 1 ))).toISOString()
    var plot_frequency = frequency_element.value
    var depth = depth_element.value

    //get selected sensor list
    var selected_sensors=[]
    sensor_list.forEach(function(sensor){
        var sensor_checkbox = document.getElementById(sensor)
        if(sensor_checkbox.checked == true){
            selected_sensors.push(sensor_checkbox.value)
        }
    }) 

    //check if start time, end time and selected sensors are null or not
    if(!start_time){
        //alert("Please select a start time")
        return
    }
    if(!end_time){
        //alert("Please select an end time")
        return
    }
    if(selected_sensors.length==0){
        //alert("Please select at least a sensor")
        return
    }

    historical_datta_draw(plot_frequency,start_time,end_time,selected_sensors, depth)
}

function historical_datta_draw(plot_frequency,start_time,end_time,selected_sensors,depth){
    fetch('/historical_data?frequency='+plot_frequency
        +'&start_time='+start_time
        +'&end_time='+end_time
        +'&selected_sensors='+selected_sensors
        +'&depth='+depth)
    .then(function (response) {
        return response.json();
    }).then(function (text) {
        if(text.Error) {
            alert(text.Error)
        }
        else{
            console.log(text)
            var time = text.TIMESTAMP
            for (i=0;i<=selected_sensors.length-1;i++){
                var plot_data = []
                for (j=0;j<=text[selected_sensors[i]].length;j++){
                    plot_data.push({
                        'date': new Date(time[j]/1000000),
                        'value': text[selected_sensors[i]][j]
                    })
                }
                
                history_plot(i,plot_data, selected_sensors[i])
            }
        }
    
    });
}

function history_plot(chart_number, plot_data,selected_sensor){

    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#graph_container")
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
    const x = d3.scaleTime()
        .domain(d3.extent(plot_data, function(d) { return d.date; }))
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", (width / 2))
        .attr("y", height + 30)
        .text("Time");
  
    // Add Y axis
    const y = d3.scaleLinear()
        .domain([d3.min(plot_data, function(d) { return +d.value; }), d3.max(plot_data, function(d) { return +d.value; })])
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
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.value) })
            )
}