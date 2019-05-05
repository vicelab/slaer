#!/usr/bin/python3

import matplotlib.pyplot as plt
import matplotlib.mlab as mlab
import numpy as np
import csv

percent_acres_fallowed = []



types_percent_fallowed = {}

# types = ["test", "test2"]

for index in range(4, 24):
    types_fallowed = {}
    types_not_fallowed = {}
    data = []
    data_type = {}
    num = 0
    num_plots_fallowed = 0
    num_plots_not_fallowed = 0
    num_acres_fallowed = 0
    num_acres_not_fallowed = 0
    num_acres = 0
    num_plots = -1
    with open('KernNDVI1999-2018.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            num_plots += 1
            # if (row[3] == "")
            if num_plots > 0:
                try:
                    num = float(row[index])
                except ValueError:
                    num += 0
                    # print ("Error on Line ", row[0], " index ", index)
                else:
                    data.append(num)
                    data_type[row[3]].append(num)
                    num_acres += float(row[1])
                    if num > .255:
                        num_plots_not_fallowed += 1
                        num_acres_not_fallowed += float(row[1])
                        types_not_fallowed[row[3]] += float(row[1])
                    else:
                        num_plots_fallowed += 1
                        num_acres_fallowed += float(row[1])
                        types_fallowed[row[3]] += float(row[1])
                    
        #finish processing one year here...
        print(f'Processed {num_plots} lines.')
        percent_acres_fallowed.append(
            num_acres_fallowed / (num_acres))
        
        for key in types_fallowed:
            # print key, 'corresponds to', d[key]
            types_percent_fallowed[key].append(types_fallowed[key] / (types_fallowed[key]+types_not_fallowed[key]))

            # percent_plots_fallowed.ap
            bins = np.linspace(0, 1, 100)
            plt.hist(data_type[key], bins, alpha=0.9)
            plt.axvline(x=0.255, ymin=0, ymax=1, linewidth=1, color='red')
            plt.xlabel('Mean Average NDVI (July-August)')
            plt.ylabel('Number of Plots, 1% Binning')
            plt.title(f'Kern County { 1999 + index - 4 } {key} NVDI')
            # plt.axis([0, 1, 0, 1000])
            plt.savefig(f'Kern County { 1999 + index - 4 } {key} NVDI', dpi=300)  # 300
            plt.clf()
            plt.cla()
            plt.close('all')

# plt.plot(percent_acres_fallowed, label = 'Total Acres')
# for each type
#     plt.plot (types_percent_fallowed[i], label = 'label[0]');# /types_percent_fallowed[0].append(types_fallowed[0] / (types_fallowed+types_not_fallowed))

# # plt.plot(percent_plots_fallowed, label = 'Plots')
# plt.legend()

# plt.xticks(np.arange(20), ('99', '00', '01', '02', '03', '04', '05', '06', '07',
#                       '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'))
# plt.xlabel('Year')
# plt.ylabel('Percent Fallowed')
# plt.title(f'Kern County 1999-2018 Fallowing')
# # plt.axis([0, 1, 0, 1000])
# plt.savefig(f'Kern County 1999-2018 Fallowing', dpi=300)  # 300
# plt.clf()
# plt.cla()
# plt.close('all')
