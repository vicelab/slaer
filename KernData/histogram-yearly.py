#!/usr/bin/python3

import matplotlib.pyplot as plt
import matplotlib.mlab as mlab
import numpy as np
import csv

percent_fallowed = []

for index in range(4, 24):
    data = []
    num = 0
    num_fallowed = 0
    num_not_fallowed = 0
    num_acres = 0
    line_count = 0
    with open('Kern1999-2018.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            line_count += 1
            if line_count > 1:
                try:
                    num = float(row[index])
                except ValueError:
                    num += 0
                    # print ("Error on Line ", row[0], " index ", index)
                else:
                    data.append(num)
                    if num > .255:
                        num_not_fallowed += float(row[1])
                    else:
                        num_fallowed += float(row[1])
                    num_acres += float(row[1])
        print(f'Processed {line_count} lines.')
        print(
            f'Average Fallowing { num_fallowed / (num_fallowed + num_not_fallowed)} across { num_acres } acres and 20 years of data.')
        percent_fallowed.append(
            num_fallowed / (num_fallowed + num_not_fallowed))

        bins = np.linspace(0, 1, 100)
        plt.hist(data, bins, alpha=0.9)

        plt.axvline(x=0.255, ymin=0, ymax=1, linewidth=1, color='red')

        plt.xlabel('Mean Average NDVI (July-August)')
        plt.ylabel('Number of Plots, 1% Binning')
        plt.title(f'Kern County { 1999 + index - 5 } Fallowed Land')
        plt.axis([0, 1, 0, 1000])
        plt.savefig(
            f'Kern County { 1999 + index - 5 } Fallowed Land', dpi=300)  # 300
        plt.clf()
        plt.cla()
        plt.close('all')


plt.plot(percent_fallowed)
plt.xticks(np.arange(20), ('99', '00', '01', '02', '03', '04', '05', '06', '07',
                      '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'))
plt.xlabel('Year')
plt.ylabel('Percent Fallowed Acres')
plt.title(f'Kern County 1999-2018 Percent Fallowing')
# plt.axis([0, 1, 0, 1000])
plt.savefig(f'Kern County 1999-2018 Percent Fallowing', dpi=300)  # 300
plt.clf()
plt.cla()
plt.close('all')
