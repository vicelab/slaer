#!/usr/bin/python3

import matplotlib.pyplot as plt
import matplotlib.mlab as mlab
import numpy as np
import csv

percent_acres_fallowed = []



types_percent_fallowed = {"Alfalfa and Alfalfa Mixtures": [], "Avocados":[], "Almonds": [], "Beans (Dry)": [], "Apples": [], "Bush Berries": [], "Carrots": [], "Cherries": [], "Citrus": [], "Cole Crops": [], "Corn, Sorghum and Sudan": [], "Cotton" : [],"Flowers, Nursery and Christmas Tree Farms":[],  "Grapes":[], "Idle":[],  "Lettuce/Leafy Greens":[], "Managed Wetland":[], "Melons, Squash and Cucumbers":[], "Miscellaneous Truck Crops":[],"Miscellaneous Grain and Hay": [], "Miscellaneous Deciduous":[], "Miscellaneous Field Crops": [],"Miscellaneous Grasses": [],"Miscellaneous Subtropical Fruits":[],  "Mixed Pasture":[], "Pears":[], "Safflower":[],"Strawberries": [], "Olives":[],  "Onions and Garlic": [], "Peaches/Nectarines":[], "Peppers":[], "Pistachios":[], "Plums, Prunes and Apricots":[], "Pomegranates":[], "Potatoes and Sweet Potatoes": [], "Tomatoes": [], "Wheat": [], "Walnuts": [], "Young Perennials": [], "Kiwis" :[] }
# types_percent_fallowed = {"Alfalfa and Alfalfa Mixtures": [], "Avocados":[], "Almonds": [], "Beans (Dry)": [], "Apples": [], "Bush Berries": [], "Carrots": [], "Cherries": [], "Citrus": [], "Cole Crops": [], "Corn, Sorghum and Sudan": [], "Cotton" : [],"Flowers, Nursery and Christmas Tree Farms":[],  "Grapes":[], "Idle":[],  "Lettuce/Leafy Greens":[], "Managed Wetland":[], "Melons, Squash and Cucumbers":[], "Miscellaneous Truck Crops":[],"Miscellaneous Grain and Hay": [], "Miscellaneous Deciduous":[], "Miscellaneous Field Crops": [],"Miscellaneous Grasses": [],"Miscellaneous Subtropical Fruits":[],  "Mixed Pasture":[], "Pears":[], "Safflower":[],"Strawberries": [], "Olives":[],  "Onions and Garlic": [], "Peaches/Nectarines":[], "Peppers":[], "Pistachios":[], "Plums, Prunes and Apricots":[], "Pomegranates":[], "Potatoes and Sweet Potatoes": [], "Tomatoes": [], "Wheat": [], "Walnuts": [], "Young Perennials": [], "Kiwis" :[] }


data_type = {"Alfalfa and Alfalfa Mixtures": [], "Avocados":[], "Almonds": [], "Beans (Dry)": [], "Apples": [], "Bush Berries": [], "Carrots": [], "Cherries": [], "Citrus": [], "Cole Crops": [], "Corn, Sorghum and Sudan": [], "Cotton" : [],"Flowers, Nursery and Christmas Tree Farms":[],  "Grapes":[], "Idle":[],  "Lettuce/Leafy Greens":[], "Managed Wetland":[], "Melons, Squash and Cucumbers":[], "Miscellaneous Truck Crops":[],"Miscellaneous Grain and Hay": [], "Miscellaneous Deciduous":[], "Miscellaneous Field Crops": [],"Miscellaneous Grasses": [],"Miscellaneous Subtropical Fruits":[],  "Mixed Pasture":[], "Pears":[], "Safflower":[],"Strawberries": [], "Olives":[],  "Onions and Garlic": [], "Peaches/Nectarines":[], "Peppers":[], "Pistachios":[], "Plums, Prunes and Apricots":[], "Pomegranates":[], "Potatoes and Sweet Potatoes": [], "Tomatoes": [], "Wheat": [], "Walnuts": [], "Young Perennials": [], "Kiwis" :[] }
summer_data_type = {"Alfalfa and Alfalfa Mixtures": [], "Avocados":[], "Almonds": [], "Beans (Dry)": [], "Apples": [], "Bush Berries": [], "Carrots": [], "Cherries": [], "Citrus": [], "Cole Crops": [], "Corn, Sorghum and Sudan": [], "Cotton" : [],"Flowers, Nursery and Christmas Tree Farms":[],  "Grapes":[], "Idle":[],  "Lettuce/Leafy Greens":[], "Managed Wetland":[], "Melons, Squash and Cucumbers":[], "Miscellaneous Truck Crops":[],"Miscellaneous Grain and Hay": [], "Miscellaneous Deciduous":[], "Miscellaneous Field Crops": [],"Miscellaneous Grasses": [],"Miscellaneous Subtropical Fruits":[],  "Mixed Pasture":[], "Pears":[], "Safflower":[],"Strawberries": [], "Olives":[],  "Onions and Garlic": [], "Peaches/Nectarines":[], "Peppers":[], "Pistachios":[], "Plums, Prunes and Apricots":[], "Pomegranates":[], "Potatoes and Sweet Potatoes": [], "Tomatoes": [], "Wheat": [], "Walnuts": [], "Young Perennials": [], "Kiwis" :[] }
winter_data_type = {"Alfalfa and Alfalfa Mixtures": [], "Avocados":[], "Almonds": [], "Beans (Dry)": [], "Apples": [], "Bush Berries": [], "Carrots": [], "Cherries": [], "Citrus": [], "Cole Crops": [], "Corn, Sorghum and Sudan": [], "Cotton" : [],"Flowers, Nursery and Christmas Tree Farms":[],  "Grapes":[], "Idle":[],  "Lettuce/Leafy Greens":[], "Managed Wetland":[], "Melons, Squash and Cucumbers":[], "Miscellaneous Truck Crops":[],"Miscellaneous Grain and Hay": [], "Miscellaneous Deciduous":[], "Miscellaneous Field Crops": [],"Miscellaneous Grasses": [],"Miscellaneous Subtropical Fruits":[],  "Mixed Pasture":[], "Pears":[], "Safflower":[],"Strawberries": [], "Olives":[],  "Onions and Garlic": [], "Peaches/Nectarines":[], "Peppers":[], "Pistachios":[], "Plums, Prunes and Apricots":[], "Pomegranates":[], "Potatoes and Sweet Potatoes": [], "Tomatoes": [], "Wheat": [], "Walnuts": [], "Young Perennials": [], "Kiwis" :[] }
    
# types = ["test", "test2"]

for index in range(4, 9):
    types_fallowed = {"Alfalfa and Alfalfa Mixtures": 0,"Avocados":0, "Almonds": 0, "Beans (Dry)": 0, "Apples": 0, "Bush Berries": 0, "Carrots": 0, "Cherries": 0, "Citrus": 0, "Cole Crops": 0, "Corn, Sorghum and Sudan": 0, "Cotton" : 0,"Flowers, Nursery and Christmas Tree Farms":0,  "Grapes":0, "Idle":0,  "Lettuce/Leafy Greens":0, "Managed Wetland":0, "Melons, Squash and Cucumbers":0, "Miscellaneous Truck Crops":0, "Miscellaneous Grain and Hay": 0, "Miscellaneous Deciduous":0, "Miscellaneous Field Crops": 0, "Miscellaneous Grasses": 0, "Miscellaneous Subtropical Fruits":0, "Mixed Pasture":0, "Pears":0, "Safflower":0, "Strawberries": 0, "Olives":0,  "Onions and Garlic": 0, "Peaches/Nectarines":0, "Peppers":0, "Pistachios":0, "Plums, Prunes and Apricots":0, "Pomegranates":0, "Potatoes and Sweet Potatoes": 0, "Tomatoes": 0, "Wheat": 0, "Walnuts": 0, "Young Perennials": 0, "Kiwis" :0 }
    types_not_fallowed = {"Alfalfa and Alfalfa Mixtures": 0,"Avocados":0,  "Almonds": 0, "Beans (Dry)": 0, "Apples": 0, "Bush Berries": 0, "Carrots": 0, "Cherries": 0, "Citrus": 0, "Cole Crops": 0, "Corn, Sorghum and Sudan": 0, "Cotton" : 0,"Flowers, Nursery and Christmas Tree Farms":0,  "Grapes":0, "Idle":0,  "Lettuce/Leafy Greens":0, "Managed Wetland":0, "Melons, Squash and Cucumbers":0, "Miscellaneous Truck Crops":0, "Miscellaneous Grain and Hay": 0, "Miscellaneous Deciduous":0, "Miscellaneous Field Crops": 0,"Miscellaneous Grasses": 0, "Miscellaneous Subtropical Fruits":0, "Mixed Pasture":0, "Pears":0, "Safflower":0,"Strawberries": 0,  "Olives":0,  "Onions and Garlic": 0, "Peaches/Nectarines":0, "Peppers":0, "Pistachios":0, "Plums, Prunes and Apricots":0, "Pomegranates":0, "Potatoes and Sweet Potatoes": 0, "Tomatoes": 0, "Wheat": 0, "Walnuts": 0, "Young Perennials": 0, "Kiwis" :0}
    data = []
    num = 0
    num_plots_fallowed = 0
    num_plots_not_fallowed = 0
    num_acres_fallowed = 0
    num_acres_not_fallowed = 0
    num_acres = 0
    num_plots = -1
    with open('LandSat8-Summer-NDVI.csv') as csv_file:
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
                    if index % 2 == 0: 
                        summer_data_type[row[3]].append(num)
                    else:
                        winter_data_type[row[3]].append(num)    
                    num_acres += float(row[1])
                    if num > .255:
                        num_plots_not_fallowed += 1
                        num_acres_not_fallowed += float(row[1])
                        types_not_fallowed[row[3]] += float(row[1])
                    else:
                        # if row[3] == "Citrus":
                        #     count_times = 0
                        #     average_ndvi = 0
                            # for index_inner in range(4, 39 + 4):
                            #     try:
                            #         num_inner = float(row[index_inner])
                            #     except ValueError:
                            #         num += 0
                            #     if num_inner < .255:
                            #         count_times += 1
                            #         average_ndvi += num_inner
                            # if count_times > 33:
                            #     print (row[0] + ' ' + f'{count_times} Average: { average_ndvi/count_times}')
                            #     for index_inner_2 in range(4, 39 + 4):
                            #          print(row[index_inner_2])                         
                        num_plots_fallowed += 1
                        num_acres_fallowed += float(row[1])
                        types_fallowed[row[3]] += float(row[1])
                    
        #finish processing one year here...
        print(f'Processed {num_plots} lines.')
        percent_acres_fallowed.append(
            num_acres_fallowed / (num_acres))
        

        print(f' Year { 1999 + ((index- 4)/2)   } ')
        print(f' Summer { index % 2 == 0  } ')

        for key in types_fallowed:
            # print key, 'corresponds to', d[key]
            types_percent_fallowed[key].append(types_fallowed[key] / (types_fallowed[key]+types_not_fallowed[key]))


            # # percent_plots_fallowed.ap
            # bins = np.linspace(0, 1, 100)
            # plt.hist(data_type[key], bins, alpha=0.9)
            # plt.axvline(x=0.255, ymin=0, ymax=1, linewidth=1, color='red')
            # plt.xlabel('Mean Average NDVI (July-August)')
            # plt.ylabel('Number of Plots, 1% Binning')
            # plt.title(f'Kern County { 1999 + index - 4 } {key} NVDI')
            # # plt.axis([0, 1, 0, 1000])
            # key_alt = key.replace("/", " ")
            # plt.savefig(f'{key_alt}/ Kern County { 1999 + ((index- 4)/2) } { key_alt } NVDI', dpi=300)  # 300
            # plt.clf()
            # plt.cla()
            # plt.close('all')


for key in types_fallowed:
    # plt.plot (types_percent_fallowed[key], label = key)
    # plt.legend()
    # plt.xticks(np.arange(6), ('13', '14', '15', '16', '17', '18' ))
    # plt.xlabel('Year')
    # plt.ylabel('Percent Fallowed')
    # plt.title(f'Kern County 2013-2018 {key} - LandSat 7')
    # key_alt = key.replace("/", " ")
    # # plt.axis([0, 1, 0, 1000])
    # plt.savefig(f'Kern County 2013-2018 {key_alt} - LandSat 7', dpi=300)  # 300
    # plt.clf()
    # plt.cla()
    # plt.close('all')

#     #########################################

    bins = np.linspace(0, 1, 100)
    plt.hist(data_type[key], bins, alpha=0.9)
    plt.axvline(x=0.255, ymin=0, ymax=1, linewidth=1, color='red')
    plt.xlabel('Mean Average NDVI')
    plt.ylabel('Number of Plots, 1% Binning')
    plt.title(f'Kern County {key} NVDI Histogram - LandSat 8')
    # plt.axis([0, 1, 0, 1000])
    key_alt = key.replace("/", " ")
    plt.savefig(f'Kern County {key_alt} NVDI Histogram - LandSat 8', dpi=300)  # 300
    plt.clf()
    plt.cla()
    plt.close('all')
    
#     bins = np.linspace(0, 1, 100)
#     plt.hist(summer_data_type[key], bins, alpha=0.9)
#     plt.axvline(x=0.255, ymin=0, ymax=1, linewidth=1, color='red')
#     plt.xlabel('Mean Average NDVI')
#     plt.ylabel('Number of Plots, 1% Binning')
#     plt.title(f'Kern County {key} Summer NVDI Histogram')
#     # plt.axis([0, 1, 0, 1000])
#     key_alt = key.replace("/", " ")
#     plt.savefig(f'Kern County {key_alt} Summer NVDI Histogram', dpi=300)  # 300
#     plt.clf()
#     plt.cla()
#     plt.close('all')
    
#     bins = np.linspace(0, 1, 100)
#     plt.hist(winter_data_type[key], bins, alpha=0.9)
#     plt.axvline(x=0.255, ymin=0, ymax=1, linewidth=1, color='red')
#     plt.xlabel('Mean Average NDVI')
#     plt.ylabel('Number of Plots, 1% Binning')
#     plt.title(f'Kern County {key} Winter NVDI Histogram')
#     # plt.axis([0, 1, 0, 1000])
#     key_alt = key.replace("/", " ")
#     plt.savefig(f'Kern County {key_alt} Winter NVDI Histogram', dpi=300)  # 300
#     plt.clf()
#     plt.cla()
#     plt.close('all')




plt.plot (percent_acres_fallowed, label = "total")
plt.legend()
plt.xticks(np.arange(6), ('13', '14', '15', '16', '17', '18' ))
plt.xlabel('Year')
plt.ylabel('Percent Fallowed')
plt.title(f'Kern County 2013-2018 - LandSat 8')
key_alt = key.replace("/", " ")
# plt.axis([0, 1, 0, 1000])
plt.savefig(f'Kern County 2013-2018 - LandSat 8', dpi=300)  # 300
plt.clf()
plt.cla()
plt.close('all')

# plt.plot(percent_acres_fallowed, label = 'Total Acres')
# for each type
#     plt.plot (types_percent_fallowed[i], label = 'label[0]');# /types_percent_fallowed[0].append(types_fallowed[0] / (types_fallowed+types_not_fallowed))

# # plt.plot(percent_plots_fallowed, label = 'Plots')
