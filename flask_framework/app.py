from datetime import datetime
from statistics import mean

import numpy as np
import pandas as pd
from flask import Flask, render_template, request

app = Flask(__name__)

sensors_dict={
    'sensor1':'sensorParms(1)',
    'sensor2':'sensorParms(2)',
    'sensor3':'sensorParms(3)',
    'sensor4':'sensorParms(4)',
    'sensor5':'sensorParms(5)',
    'sensor6':'sensorParms(6)',
    'sensor7':'sensorParms(7)',
    'sensor8':'sensorParms(8)',
    'sensor9':'sensorParms(9)',
    'sensor10':'sensorParms(10)',
    'sensor11':'sensorParms(11)',
}
   
def raw_data_reading():
    raw_data_step = pd.read_csv("../RawData/Profiler_modem_PFL_Step.dat", low_memory=False)
    raw_data_step.drop([0,1], axis=0, inplace=True)
    raw_data_step['TIMESTAMP'] = pd.to_datetime(raw_data_step.TIMESTAMP)
    raw_data_step['_RS232Dpt'] = raw_data_step['_RS232Dpt'].astype('float')
    raw_data_step['sensorParms(1)'] = raw_data_step['sensorParms(1)'].astype('float')
    raw_data_step['sensorParms(2)'] = raw_data_step['sensorParms(2)'].astype('float')
    raw_data_step['sensorParms(3)'] = raw_data_step['sensorParms(3)'].astype('float')
    raw_data_step['sensorParms(4)'] = raw_data_step['sensorParms(4)'].astype('float')
    raw_data_step['sensorParms(5)'] = raw_data_step['sensorParms(5)'].astype('float')
    raw_data_step['sensorParms(6)'] = raw_data_step['sensorParms(6)'].astype('float')
    raw_data_step['sensorParms(7)'] = raw_data_step['sensorParms(7)'].astype('float')
    raw_data_step['sensorParms(8)'] = raw_data_step['sensorParms(8)'].astype('float')
    raw_data_step['sensorParms(9)'] = raw_data_step['sensorParms(9)'].astype('float')
    raw_data_step['sensorParms(10)'] = raw_data_step['sensorParms(10)'].astype('float')
    raw_data_step['sensorParms(11)'] = raw_data_step['sensorParms(11)'].astype('float')

    raw_data_step['_RS232Dpt'] = raw_data_step['_RS232Dpt'].map(lambda x: round(x))

    raw_data_hour = pd.read_csv("../RawData/Profiler_modem_SondeHourly.dat", low_memory=False)
    raw_data_hour.drop([0,1], axis=0, inplace=True)
    raw_data_hour['TIMESTAMP'] = pd.to_datetime(raw_data_hour.TIMESTAMP)
    raw_data_hour['sensorParms(1)'] = raw_data_hour['sensorParms(1)'].astype('float')
    raw_data_hour['sensorParms(2)'] = raw_data_hour['sensorParms(2)'].astype('float')
    raw_data_hour['sensorParms(3)'] = raw_data_hour['sensorParms(3)'].astype('float')
    raw_data_hour['sensorParms(4)'] = raw_data_hour['sensorParms(4)'].astype('float')
    raw_data_hour['sensorParms(5)'] = raw_data_hour['sensorParms(5)'].astype('float')
    raw_data_hour['sensorParms(6)'] = raw_data_hour['sensorParms(6)'].astype('float')
    raw_data_hour['sensorParms(7)'] = raw_data_hour['sensorParms(7)'].astype('float')
    raw_data_hour['sensorParms(8)'] = raw_data_hour['sensorParms(8)'].astype('float')
    raw_data_hour['sensorParms(9)'] = raw_data_hour['sensorParms(9)'].astype('float')
    raw_data_hour['sensorParms(10)'] = raw_data_hour['sensorParms(10)'].astype('float')
    raw_data_hour['sensorParms(11)'] = raw_data_hour['sensorParms(11)'].astype('float')

    return raw_data_step, raw_data_hour

[raw_data_step, raw_data_hour] = raw_data_reading()

@app.route('/')
def front_page():
    return render_template('front_page.html')

@app.route('/historical')
def historical_data():
    time_start = raw_data_step['TIMESTAMP'].tolist()[0].strftime("%m/%d/%Y, %H:%M:%S")
    time_end = raw_data_step['TIMESTAMP'].tolist()[-1].strftime("%m/%d/%Y, %H:%M:%S")
    depth_start = raw_data_step['_RS232Dpt'] .min()
    depth_end = raw_data_step['_RS232Dpt'] .max()
    return render_template(
        'profiler_historical.html', 
        start_time = time_start,
        end_time = time_end,
        start_depth = depth_start,
        end_depth = depth_end,
    )

@app.route('/relationship')
def relationship_analysis():
    return render_template('profiler_relationship.html')

@app.route('/historical_data', methods=['GET'])
def get_historical_data():
    plot_frequency = request.args['frequency']
    start_time = pd.to_datetime(request.args['start_time']).tz_localize(None)
    end_time =  pd.to_datetime(request.args['end_time']).tz_localize(None)
    selected_sensors = request.args['selected_sensors'].split(',')
    selected_depth = int(request.args['depth'])

    if plot_frequency=='minutely':
        target_df = raw_data_step
    else:
        target_df = raw_data_hour

    if (start_time > target_df['TIMESTAMP'].values[0]) & (end_time < target_df['TIMESTAMP'].values[-1]):
        target=target_df[(raw_data_step['TIMESTAMP']<end_time) & 
            (target_df['TIMESTAMP']>start_time) &
            (target_df['_RS232Dpt']==selected_depth)
        ]
        message={'TIMESTAMP': target['TIMESTAMP'].values.tolist()}
        for sensor in selected_sensors:
            message[sensor] = target[sensors_dict[sensor]].values.tolist()
        return message
    return {'Error':'Selected time is out of range.'}

@app.route('/relationship_data', methods=['GET'])
def get_relationship_data():

    selected_sensors = request.args['selected_sensors'].split(',')
    depth_list = raw_data_step['_RS232Dpt'].unique()

    sensors_data = {}

    for sensor in selected_sensors:
        sensor_data = {}
        for depth in depth_list:
            sensor_depth_data = raw_data_step.loc[raw_data_step['_RS232Dpt'] == depth, sensors_dict[sensor]].tolist()
            #sensor_depth_data = raw_data_step[raw_data_step['_RS232Dpt']==depth][sensors_dict[sensor]].tolist()
            mean_data = mean(sensor_depth_data)
            sensor_data[depth.item()] = mean_data
        sensors_data[sensor] = sensor_data
    
    return sensors_data


if __name__ == "__main__":
    app.run(debug=True)