#!/usr/bin/python3

import matplotlib.pyplot as plt
import matplotlib.mlab as mlab
import numpy as np
import csv

data = []
num = 0
num_fallowed = 0
num_not_fallowed = 0
num_acres = 0

with open('LandSat8-Summer-NDVI.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        line_count += 1
        if line_count > 1: 
            for index in range(4, 9):
                try:
                    num = float(row[index])
                except ValueError:
                    print ("Error on Line ", row[0], " index ", index)
                else:
                    data.append(num)
                    if num > .255: 
                        num_not_fallowed += float(row[1])
                    else:
                        num_fallowed += float(row[1])
                    num_acres += float(row[1])
    print(f'Processed {line_count} lines.')
    print(f'Average Fallowing { num_fallowed / (num_fallowed + num_not_fallowed)} across { num_acres } acres and 19 years of data.')

    # Gives 28.17% fallowing of plots
    # Gives 33.5% fallowing of acres

print("graphing!!")

bins = np.linspace(0, 1, 100)
plt.hist(data, bins, alpha=0.9)

plt.axvline(x=0.255, ymin=0, ymax = 1, linewidth=1, color='red')

plt.xlabel('Mean Average NDVI (July-August)')
plt.ylabel('Number of Plots, 1% Binning')
plt.title('Kern County Fallowed Land Histogram')
plt.axis([0, 1, 0, 8000])
plt.savefig('Kern County 1999-2018 Fallowed Land Histogram', dpi=500) #300
plt.clf()
plt.cla()
plt.close('all')