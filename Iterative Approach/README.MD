# Slaer Project 
### Importing and Processing Data
Two datasets were used to gather NDVI values per plot.

1. LandIQ from 2014 with metadata of what the plot is growing at that year and polygon outline of the plot
2. Landsat 2017 NDVI has precomputed NDVI values from Landsat images
```javascript
var table: Table users/dantran2016/atlas_i15_CropMapping2014;
var landSatNDVI =  ee.ImageCollection("LANDSAT/LE07/C01/T1_8DAY_NDVI");
```
LandIQ has metadata defining what the plot was growing. For example,
```"Crop2014": "Miscellaneous Grain and Hay",``` ```"Crop2014": "Urban"```
We discarded the Urban classified land since our focus is to calssify fallowed agricultural land. 
```javascript
var nonUrban = table.filter(ee.Filter.neq("Crop2014","Urban"));
```



[Link to Preprocess Data](https://code.earthengine.google.com/5a54184e8e3b5de77d395ea486e41c42)
