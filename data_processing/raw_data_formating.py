import csv

with open('./RawData/Profiler_modem_PFL_Step.dat') as dat_file, open('Profiler_modem_PFL_Step.csv', 'w') as csv_file:
    csv_writer = csv.writer(csv_file)

    for line in dat_file:
        row = [field.strip() for field in line.split(',')]
        csv_writer.writerow(row)