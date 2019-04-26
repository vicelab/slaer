#!/usr/bin/python3

import matplotlib.pyplot as plt
import matplotlib.mlab as mlab
import numpy as np
import csv

percent_acres_dry = []
percent_plots_dry = []

for index in range(4, 24):
    data = []
    num = 0
    num_plots_dry = 0
    num_plots_not_dry = 0
    num_acres_dry = 0
    num_acres_not_dry = 0
    num_acres = 0
    num_plots = -1
    with open('KernNDWI1999-2018.csv') as csv_file:
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
                    if num > -.075:
                        num_plots_not_dry += 1
                        num_acres_not_dry += num_acres
                    else:
                        num_plots_dry += 1
                        num_acres_dry += num_acres
                    
        print(f'Processed {num_plots} lines.')
        # print(
            # f'Average Percent Fallowed Plots: { num_dry / (num_dry + num_not_dry)} in { 1999 + index - 4 } .')
        percent_acres_dry.append(
            num_acres_dry / (num_acres_dry + num_acres_not_dry))

        percent_plots_dry.append(
            num_plots_dry / (num_plots_dry + num_plots_not_dry))

        bins = np.linspace(-1, 1, 200)
        plt.hist(data, bins, alpha=0.9)
        plt.axvline(x=-.075, ymin=0, ymax=1, linewidth=1, color='red')
        plt.xlabel('Mean Average NDWI (July-August)')
        plt.ylabel('Number of Plots, 1% Binning')
        plt.title(f'Kern County { 1999 + index - 4 } NDWI')
        # plt.axis([0, 1, 0, 1000])
        plt.savefig(f'Kern County { 1999 + index - 4 } NDWI', dpi=300)  # 300
        plt.clf()
        plt.cla()
        plt.close('all')

plt.plot(percent_acres_dry, label = 'Acres')
plt.plot(percent_plots_dry, label = 'Plots')
plt.legend()

plt.xticks(np.arange(20), ('99', '00', '01', '02', '03', '04', '05', '06', '07',
                      '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'))
plt.xlabel('Year')
plt.ylabel('Percent "Dry" [NDWI < -.075]')
plt.title(f'Kern County 1999-2018 NDWI')
# plt.axis([0, 1, 0, 1000])
plt.savefig(f'Kern County 1999-2018 NDWI', dpi=300)  # 300
plt.clf()
plt.cla()
plt.close('all')
