# Slaer Project

## Software Used

1. Google Earth Engine:
   > + An account is needed to view and use Google Earth Engine. [Link to sign up](https://signup.earthengine.google.com/)
   > + After registration the code editor can be viewed at [Link](code.earthengine.google.com).
2. Python:
   >+ Python3 can be installed via this [link](https://www.python.org/).
3. Matplotlib:
    <!-- Add install instructions or links -->

## Importing and Processing Data

Two datasets were used to gather NDVI values per plot.

1. LandIQ from 2014 with metadata of what the plot is growing at that year and polygon outline of the plot
2. Landsat 2017 NDVI has precomputed NDVI values from Landsat images

```javascript
var table: Table users/dantran2016/atlas_i15_CropMapping2014;
var landSatNDVI =  ee.ImageCollection("LANDSAT/LE07/C01/T1_8DAY_NDVI");
```

Landsat 7 data is collected in ImageCollections and contain different images with data below.

```JSON
{
  "type": "Image",
  "bands": [
    {
      "id": "NDVI",
      "data_type": {
        "type": "PixelType",
        "precision": "float",
        "min": -1,
        "max": 1
      },
      "crs": "EPSG:4326",
      "crs_transform": [
        1,
        0,
        0,
        0,
        1,
        0
      ]
    }
  ],
  "version": 1557407867588447,
  "id": "LANDSAT/LE07/C01/T1_8DAY_NDVI/19990101",

```

LandIQ has metadata defining what the plot was growing. For example,
```"Crop2014": "Miscellaneous Grain and Hay",``` ```"Crop2014": "Urban"```
We discarded the Urban classified land since our focus is to calssify fallowed agricultural land.

```javascript
var nonUrban = table.filter(ee.Filter.neq("Crop2014","Urban"));
```

#### Parameters:

> Months of Interest
> Years of Interest
> Can be a single time period or multiple

```javascript
var yearsOfInterest = ee.List.sequence(1999,2018);
var monthsOfInterest = ee.List.sequence(1,12);
var monthOfInterest = ee.List([1]);
```

Given the parameters a list of Landsat imageCollections filtered by induvidual month and year can be generated through the function below.

```javascript
var yearlyCollections  = yearsOfInterest.map(function(i){
    return monthsOfInterst.map(function(j){
      i = ee.Number(i);
      j = ee.Number(j);
      var date = ee.Date.fromYMD(i,j,1);
      return landSatNDVI.filterDate(date, date.advance(1,'month'));
  });}).flatten();
```

The map function iterates through a datastructure like a feature collection or a list. Inside the map function computations can be done based on a passed in value (i or j) and return a datastructure in this case an filtered image collection.

[Link to Preprocess Data](https://code.earthengine.google.com/5a54184e8e3b5de77d395ea486e41c42)


