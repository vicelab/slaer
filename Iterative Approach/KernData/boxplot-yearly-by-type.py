#!/usr/bin/python3

import matplotlib.pyplot as plt
import matplotlib.mlab as mlab
import numpy as np
import csv

percent_acres_fallowed = []

types_percent_fallowed = {"Alfalfa and Alfalfa Mixtures": [], "Avocados": [], "Almonds": [], "Beans (Dry)": [], "Apples": [], "Bush Berries": [], "Carrots": [], "Cherries": [], "Citrus": [], "Cole Crops": [], "Corn, Sorghum and Sudan": [], "Cotton": [], "Flowers, Nursery and Christmas Tree Farms": [],  "Grapes": [], "Idle": [],  "Lettuce/Leafy Greens": [], "Managed Wetland": [], "Melons, Squash and Cucumbers": [], "Miscellaneous Truck Crops": [], "Miscellaneous Grain and Hay": [
], "Miscellaneous Deciduous": [], "Miscellaneous Field Crops": [], "Miscellaneous Grasses": [], "Miscellaneous Subtropical Fruits": [],  "Mixed Pasture": [], "Pears": [], "Safflower": [], "Strawberries": [], "Olives": [],  "Onions and Garlic": [], "Peaches/Nectarines": [], "Peppers": [], "Pistachios": [], "Plums, Prunes and Apricots": [], "Pomegranates": [], "Potatoes and Sweet Potatoes": [], "Tomatoes": [], "Wheat": [], "Walnuts": [], "Young Perennials": [], "Kiwis": []}
types_averages = {"Alfalfa and Alfalfa Mixtures": [], "Avocados": [], "Almonds": [], "Beans (Dry)": [], "Apples": [], "Bush Berries": [], "Carrots": [], "Cherries": [], "Citrus": [], "Cole Crops": [], "Corn, Sorghum and Sudan": [], "Cotton": [], "Flowers, Nursery and Christmas Tree Farms": [],  "Grapes": [], "Idle": [],  "Lettuce/Leafy Greens": [], "Managed Wetland": [], "Melons, Squash and Cucumbers": [], "Miscellaneous Truck Crops": [], "Miscellaneous Grain and Hay": [
], "Miscellaneous Deciduous": [], "Miscellaneous Field Crops": [], "Miscellaneous Grasses": [], "Miscellaneous Subtropical Fruits": [],  "Mixed Pasture": [], "Pears": [], "Safflower": [], "Strawberries": [], "Olives": [],  "Onions and Garlic": [], "Peaches/Nectarines": [], "Peppers": [], "Pistachios": [], "Plums, Prunes and Apricots": [], "Pomegranates": [], "Potatoes and Sweet Potatoes": [], "Tomatoes": [], "Wheat": [], "Walnuts": [], "Young Perennials": [], "Kiwis": []}
types_min = {"Alfalfa and Alfalfa Mixtures": [], "Avocados": [], "Almonds": [], "Beans (Dry)": [], "Apples": [], "Bush Berries": [], "Carrots": [], "Cherries": [], "Citrus": [], "Cole Crops": [], "Corn, Sorghum and Sudan": [], "Cotton": [], "Flowers, Nursery and Christmas Tree Farms": [],  "Grapes": [], "Idle": [],  "Lettuce/Leafy Greens": [], "Managed Wetland": [], "Melons, Squash and Cucumbers": [], "Miscellaneous Truck Crops": [], "Miscellaneous Grain and Hay": [
], "Miscellaneous Deciduous": [], "Miscellaneous Field Crops": [], "Miscellaneous Grasses": [], "Miscellaneous Subtropical Fruits": [],  "Mixed Pasture": [], "Pears": [], "Safflower": [], "Strawberries": [], "Olives": [],  "Onions and Garlic": [], "Peaches/Nectarines": [], "Peppers": [], "Pistachios": [], "Plums, Prunes and Apricots": [], "Pomegranates": [], "Potatoes and Sweet Potatoes": [], "Tomatoes": [], "Wheat": [], "Walnuts": [], "Young Perennials": [], "Kiwis": []}
types_max = {"Alfalfa and Alfalfa Mixtures": [], "Avocados": [], "Almonds": [], "Beans (Dry)": [], "Apples": [], "Bush Berries": [], "Carrots": [], "Cherries": [], "Citrus": [], "Cole Crops": [], "Corn, Sorghum and Sudan": [], "Cotton": [], "Flowers, Nursery and Christmas Tree Farms": [],  "Grapes": [], "Idle": [],  "Lettuce/Leafy Greens": [], "Managed Wetland": [], "Melons, Squash and Cucumbers": [], "Miscellaneous Truck Crops": [], "Miscellaneous Grain and Hay": [
], "Miscellaneous Deciduous": [], "Miscellaneous Field Crops": [], "Miscellaneous Grasses": [], "Miscellaneous Subtropical Fruits": [],  "Mixed Pasture": [], "Pears": [], "Safflower": [], "Strawberries": [], "Olives": [],  "Onions and Garlic": [], "Peaches/Nectarines": [], "Peppers": [], "Pistachios": [], "Plums, Prunes and Apricots": [], "Pomegranates": [], "Potatoes and Sweet Potatoes": [], "Tomatoes": [], "Wheat": [], "Walnuts": [], "Young Perennials": [], "Kiwis": []}

types_box_data = []
for k in range(9):
    types_box_data.append({"Alfalfa and Alfalfa Mixtures": [], "Avocados": [], "Almonds": [], "Beans (Dry)": [], "Apples": [], "Bush Berries": [], "Carrots": [], "Cherries": [], "Citrus": [], "Cole Crops": [], "Corn, Sorghum and Sudan": [], "Cotton": [], "Flowers, Nursery and Christmas Tree Farms": [],  "Grapes": [], "Idle": [],  "Lettuce/Leafy Greens": [], "Managed Wetland": [], "Melons, Squash and Cucumbers": [], "Miscellaneous Truck Crops": [], "Miscellaneous Grain and Hay": [],
                           "Miscellaneous Deciduous": [], "Miscellaneous Field Crops": [], "Miscellaneous Grasses": [], "Miscellaneous Subtropical Fruits": [],  "Mixed Pasture": [], "Pears": [], "Safflower": [], "Strawberries": [], "Olives": [],  "Onions and Garlic": [], "Peaches/Nectarines": [], "Peppers": [], "Pistachios": [], "Plums, Prunes and Apricots": [], "Pomegranates": [], "Potatoes and Sweet Potatoes": [], "Tomatoes": [], "Wheat": [], "Walnuts": [], "Young Perennials": [], "Kiwis": []})

data_type = {"Alfalfa and Alfalfa Mixtures": [], "Avocados": [], "Almonds": [], "Beans (Dry)": [], "Apples": [], "Bush Berries": [], "Carrots": [], "Cherries": [], "Citrus": [], "Cole Crops": [], "Corn, Sorghum and Sudan": [], "Cotton": [], "Flowers, Nursery and Christmas Tree Farms": [],  "Grapes": [], "Idle": [],  "Lettuce/Leafy Greens": [], "Managed Wetland": [], "Melons, Squash and Cucumbers": [], "Miscellaneous Truck Crops": [], "Miscellaneous Grain and Hay": [
], "Miscellaneous Deciduous": [], "Miscellaneous Field Crops": [], "Miscellaneous Grasses": [], "Miscellaneous Subtropical Fruits": [],  "Mixed Pasture": [], "Pears": [], "Safflower": [], "Strawberries": [], "Olives": [],  "Onions and Garlic": [], "Peaches/Nectarines": [], "Peppers": [], "Pistachios": [], "Plums, Prunes and Apricots": [], "Pomegranates": [], "Potatoes and Sweet Potatoes": [], "Tomatoes": [], "Wheat": [], "Walnuts": [], "Young Perennials": [], "Kiwis": []}

for index in range(4, 9):
    types_fallowed = {"Alfalfa and Alfalfa Mixtures": 0, "Avocados": 0, "Almonds": 0, "Beans (Dry)": 0, "Apples": 0, "Bush Berries": 0, "Carrots": 0, "Cherries": 0, "Citrus": 0, "Cole Crops": 0, "Corn, Sorghum and Sudan": 0, "Cotton": 0, "Flowers, Nursery and Christmas Tree Farms": 0,  "Grapes": 0, "Idle": 0,  "Lettuce/Leafy Greens": 0, "Managed Wetland": 0, "Melons, Squash and Cucumbers": 0, "Miscellaneous Truck Crops": 0, "Miscellaneous Grain and Hay": 0,
                      "Miscellaneous Deciduous": 0, "Miscellaneous Field Crops": 0, "Miscellaneous Grasses": 0, "Miscellaneous Subtropical Fruits": 0, "Mixed Pasture": 0, "Pears": 0, "Safflower": 0, "Strawberries": 0, "Olives": 0,  "Onions and Garlic": 0, "Peaches/Nectarines": 0, "Peppers": 0, "Pistachios": 0, "Plums, Prunes and Apricots": 0, "Pomegranates": 0, "Potatoes and Sweet Potatoes": 0, "Tomatoes": 0, "Wheat": 0, "Walnuts": 0, "Young Perennials": 0, "Kiwis": 0}
    types_not_fallowed = {"Alfalfa and Alfalfa Mixtures": 0, "Avocados": 0,  "Almonds": 0, "Beans (Dry)": 0, "Apples": 0, "Bush Berries": 0, "Carrots": 0, "Cherries": 0, "Citrus": 0, "Cole Crops": 0, "Corn, Sorghum and Sudan": 0, "Cotton": 0, "Flowers, Nursery and Christmas Tree Farms": 0,  "Grapes": 0, "Idle": 0,  "Lettuce/Leafy Greens": 0, "Managed Wetland": 0, "Melons, Squash and Cucumbers": 0, "Miscellaneous Truck Crops": 0, "Miscellaneous Grain and Hay": 0,
                          "Miscellaneous Deciduous": 0, "Miscellaneous Field Crops": 0, "Miscellaneous Grasses": 0, "Miscellaneous Subtropical Fruits": 0, "Mixed Pasture": 0, "Pears": 0, "Safflower": 0, "Strawberries": 0,  "Olives": 0,  "Onions and Garlic": 0, "Peaches/Nectarines": 0, "Peppers": 0, "Pistachios": 0, "Plums, Prunes and Apricots": 0, "Pomegranates": 0, "Potatoes and Sweet Potatoes": 0, "Tomatoes": 0, "Wheat": 0, "Walnuts": 0, "Young Perennials": 0, "Kiwis": 0}

    types_sum = {"Alfalfa and Alfalfa Mixtures": 0, "Avocados": 0,  "Almonds": 0, "Beans (Dry)": 0, "Apples": 0, "Bush Berries": 0, "Carrots": 0, "Cherries": 0, "Citrus": 0, "Cole Crops": 0, "Corn, Sorghum and Sudan": 0, "Cotton": 0, "Flowers, Nursery and Christmas Tree Farms": 0,  "Grapes": 0, "Idle": 0,  "Lettuce/Leafy Greens": 0, "Managed Wetland": 0, "Melons, Squash and Cucumbers": 0, "Miscellaneous Truck Crops": 0, "Miscellaneous Grain and Hay": 0,
                 "Miscellaneous Deciduous": 0, "Miscellaneous Field Crops": 0, "Miscellaneous Grasses": 0, "Miscellaneous Subtropical Fruits": 0, "Mixed Pasture": 0, "Pears": 0, "Safflower": 0, "Strawberries": 0,  "Olives": 0,  "Onions and Garlic": 0, "Peaches/Nectarines": 0, "Peppers": 0, "Pistachios": 0, "Plums, Prunes and Apricots": 0, "Pomegranates": 0, "Potatoes and Sweet Potatoes": 0, "Tomatoes": 0, "Wheat": 0, "Walnuts": 0, "Young Perennials": 0, "Kiwis": 0}
    types_count = {"Alfalfa and Alfalfa Mixtures": 0, "Avocados": 0,  "Almonds": 0, "Beans (Dry)": 0, "Apples": 0, "Bush Berries": 0, "Carrots": 0, "Cherries": 0, "Citrus": 0, "Cole Crops": 0, "Corn, Sorghum and Sudan": 0, "Cotton": 0, "Flowers, Nursery and Christmas Tree Farms": 0,  "Grapes": 0, "Idle": 0,  "Lettuce/Leafy Greens": 0, "Managed Wetland": 0, "Melons, Squash and Cucumbers": 0, "Miscellaneous Truck Crops": 0, "Miscellaneous Grain and Hay": 0,
                   "Miscellaneous Deciduous": 0, "Miscellaneous Field Crops": 0, "Miscellaneous Grasses": 0, "Miscellaneous Subtropical Fruits": 0, "Mixed Pasture": 0, "Pears": 0, "Safflower": 0, "Strawberries": 0,  "Olives": 0,  "Onions and Garlic": 0, "Peaches/Nectarines": 0, "Peppers": 0, "Pistachios": 0, "Plums, Prunes and Apricots": 0, "Pomegranates": 0, "Potatoes and Sweet Potatoes": 0, "Tomatoes": 0, "Wheat": 0, "Walnuts": 0, "Young Perennials": 0, "Kiwis": 0}
    types_max_current = {"Alfalfa and Alfalfa Mixtures": -2, "Avocados": -2,  "Almonds": -2, "Beans (Dry)": -2, "Apples": -2, "Bush Berries": -2, "Carrots": -2, "Cherries": -2, "Citrus": -2, "Cole Crops": -2, "Corn, Sorghum and Sudan": -2, "Cotton": -2, "Flowers, Nursery and Christmas Tree Farms": -2,  "Grapes": -2, "Idle": -2,  "Lettuce/Leafy Greens": -2, "Managed Wetland": -2, "Melons, Squash and Cucumbers": -2, "Miscellaneous Truck Crops": -2, "Miscellaneous Grain and Hay": -2,
                         "Miscellaneous Deciduous": -2, "Miscellaneous Field Crops": -2, "Miscellaneous Grasses": -2, "Miscellaneous Subtropical Fruits": -2, "Mixed Pasture": -2, "Pears": -2, "Safflower": -2, "Strawberries": -2,  "Olives": -2,  "Onions and Garlic": -2, "Peaches/Nectarines": -2, "Peppers": -2, "Pistachios": -2, "Plums, Prunes and Apricots": -2, "Pomegranates": -2, "Potatoes and Sweet Potatoes": -2, "Tomatoes": -2, "Wheat": -2, "Walnuts": -2, "Young Perennials": -2, "Kiwis": -2}
    types_min_current = {"Alfalfa and Alfalfa Mixtures": 2, "Avocados": 2,  "Almonds": 2, "Beans (Dry)": 2, "Apples": 2, "Bush Berries": 2, "Carrots": 2, "Cherries": 2, "Citrus": 2, "Cole Crops": 2, "Corn, Sorghum and Sudan": 2, "Cotton": 2, "Flowers, Nursery and Christmas Tree Farms": 2,  "Grapes": 2, "Idle": 2,  "Lettuce/Leafy Greens": 2, "Managed Wetland": 2, "Melons, Squash and Cucumbers": 2, "Miscellaneous Truck Crops": 2, "Miscellaneous Grain and Hay": 2,
                         "Miscellaneous Deciduous": 2, "Miscellaneous Field Crops": 2, "Miscellaneous Grasses": 2, "Miscellaneous Subtropical Fruits": 2, "Mixed Pasture": 2, "Pears": 2, "Safflower": 2, "Strawberries": 2,  "Olives": 2,  "Onions and Garlic": 2, "Peaches/Nectarines": 2, "Peppers": 2, "Pistachios": 2, "Plums, Prunes and Apricots": 2, "Pomegranates": 2, "Potatoes and Sweet Potatoes": 2, "Tomatoes": 2, "Wheat": 2, "Walnuts": 2, "Young Perennials": 2, "Kiwis": 2}

    data = []
    num = 0
    num_plots_fallowed = 0
    num_plots_not_fallowed = 0
    num_acres_fallowed = 0
    num_acres_not_fallowed = 0
    num_acres = 0
    num_plots = -1
    with open('KernSummerWinter.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            num_plots += 1
            if num_plots > 0:
                try:
                    num = float(row[index])
                    # if index == 4:
                    #     types_min_current[row[3]] = num
                    #     types_max_current[row[3]] = num
                except ValueError:
                    num += 0
                else:
                    data.append(num)
                    data_type[row[3]].append(num)
                    types_sum[row[3]] += num
                    types_count[row[3]] += 1

                    if float(row[index]) > float(types_max_current[row[3]]):
                        types_max_current[row[3]] = num
                    if float(row[index]) < float(types_min_current[row[3]]):
                        types_min_current[row[3]] = num
                    num_acres += float(row[1])
                    if num > .255:
                        num_plots_not_fallowed += 1
                        num_acres_not_fallowed += float(row[1])
                        types_not_fallowed[row[3]] += float(row[1])
                    else:
                        num_plots_fallowed += 1
                        num_acres_fallowed += float(row[1])
                        types_fallowed[row[3]] += float(row[1])

        print(
            f'Processed {num_plots} lines. Year { 1999 + ((index- 4)/2)   }  Summer { index % 2 == 0  } ')

        for key in types_fallowed:
            types_averages[key].append(types_sum[key] / types_count[key])
            types_max[key].append(types_max_current[key])
            types_min[key].append(types_min_current[key])
            types_box_data[index][key] = (
                [types_sum[key] / types_count[key],  types_max_current[key], types_min_current[key]])

for key in types_fallowed:
    data = [None] * 39
    count = 0
    for i in range(39):
        count += 1
        data[i] = types_box_data[i+4][key]
    data = data[0:39]

    print(f' {key} data added\n')

    print('plotting..\n')
    plt.boxplot(data)
    print('styling\n')
    plt.xticks(np.arange(39), ('99', '', '00', '',  '01', '', '02', '', '03', '', '04', '', '05', '', '06', '', '07', '',
                               '08', '', '09', '', '10', '', '11', '', '12', '', '13', '', '14', '', '15', '', '16', '', '17', '', '18'))
    plt.xlabel('Year')
    plt.ylabel('Plot Mean Average NDVI')
    plt.title(f'Kern County 1999-2018 {key} Boxplot')
    key_alt = key.replace("/", " ")
    key_alt = key.replace("/", " ")
    plt.savefig(f'Kern County 1999-2018 {key_alt} Boxplot', dpi=300)  # 300
    plt.clf()
    plt.cla()
    plt.close('all')
