#!/usr/bin/python3

import matplotlib.pyplot as plt
import matplotlib.mlab as mlab
import numpy as np
import csv

percent_acres_fallowed = []
percent_plots_fallowed = []

for index in range(4, 24):
    data = []
    num = 0
    num_plots_fallowed = 0
    num_plots_not_fallowed = 0
    num_acres_fallowed = 0
    num_acres_not_fallowed = 0
    num_acres = 0
    num_plots = -1
    with open('Kern1999-2018.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            num_plots += 1
            if num_plots > 0:
                try:
                    num = float(row[index])
                except ValueError:
                    num += 0
                    # print ("Error on Line ", row[0], " index ", index)
                else:
                    data.append(num)
                    num_acres += float(row[1])
                    if num > .255:
                        num_plots_not_fallowed += 1
                        num_acres_not_fallowed += num_acres
                    else:
                        num_plots_fallowed += 1
                        num_acres_fallowed += num_acres
                    
        print(f'Processed {num_plots} lines.')
        # print(
            # f'Average Percent Fallowed Plots: { num_fallowed / (num_fallowed + num_not_fallowed)} in { 1999 + index - 4 } .')
        percent_acres_fallowed.append(
            num_acres_fallowed / (num_acres_fallowed + num_acres_not_fallowed))

        percent_plots_fallowed.append(
            num_plots_fallowed / (num_plots_fallowed + num_plots_not_fallowed))

        # bins = np.linspace(0, 1, 100)
        # plt.hist(data, bins, alpha=0.9)
        # plt.axvline(x=0.255, ymin=0, ymax=1, linewidth=1, color='red')
        # plt.xlabel('Mean Average NDVI (July-August)')
        # plt.ylabel('Number of Plots, 1% Binning')
        # plt.title(f'Kern County { 1999 + index - 4 } Fallowed Plots')
        # plt.axis([0, 1, 0, 1000])
        # plt.savefig(f'Kern County { 1999 + index - 4 } Fallowed Plots', dpi=300)  # 300
        # plt.clf()
        # plt.cla()
        # plt.close('all')

plt.plot(percent_acres_fallowed, label = 'Acres')
plt.plot(percent_plots_fallowed, label = 'Plots')
plt.legend()

plt.xticks(np.arange(20), ('99', '00', '01', '02', '03', '04', '05', '06', '07',
                      '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'))
plt.xlabel('Year')
plt.ylabel('Percent Fallowed')
plt.title(f'Kern County 1999-2018 Fallowing')
# plt.axis([0, 1, 0, 1000])
plt.savefig(f'Kern County 1999-2018 Fallowing', dpi=300)  # 300
plt.clf()
plt.cla()
plt.close('all')
