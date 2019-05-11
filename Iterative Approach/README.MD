# Slaer Project

## Software Used

1. Google Earth Engine:
   > + An account is needed to view and use Google Earth Engine. [Link to sign up](https://signup.earthengine.google.com/)
   > + After registration the code editor can be viewed at [Link](code.earthengine.google.com).
2. Python:
   >+ Python3 can be installed via this [link](https://www.python.org/).
3. Matplotlib:
    <!-- Add install instructions or links -->

## Importing and Processing Datasets

Three datasets were used to gather NDVI values per plot in a specific county.

1. LandIQ from 2014 with metadata of what the plot is growing at that year and polygon outline of the plot. [Link to Dataset]()
2. Landsat 2017 NDVI has precomputed NDVI values from Landsat images. [Link to Dataset](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LE07_C01_T1_8DAY_NDVI)
3. GeoJSON with geoemtries outlinng countiess. [Link to Dataset](http://eric.clst.org/tech/usgeojson/)

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
We discarded the Urban classified land since our focus is to classify fallowed agricultural land.

```javascript
var nonUrban = table.filter(ee.Filter.neq("Crop2014","Urban"));
```
Further filtering can be done to focus on a county by filtering the LandIQ dataset by the polygon of a county.

```javascript
var kernCounty = ee.Geometry.MultiPolygon(
    [[[ -118.140074, 34.820780 ], [ -118.854253, 34.817772 ], [ -118.854576, 34.803027 ], [ -118.877289, 34.803212 ], [ -118.881729, 34.817802 ], [ -118.894474, 34.817972 ], [ -118.881364, 34.790629 ], [ -118.976723, 34.790660 ], [ -118.976721, 34.812199 ], [ -119.243645, 34.814178 ], [ -119.243645, 34.857576 ], [ -119.278346, 34.857276 ], [ -119.276946, 34.879675 ], [ -119.382451, 34.879675 ], [ -119.382154, 34.900936 ], [ -119.442352, 34.901274 ], [ -119.472754, 34.901174 ], [ -119.472719, 35.076885 ], [ -119.490709, 35.077208 ], [ -119.490632, 35.091805 ], [ -119.560975, 35.087673 ], [ -119.553641, 35.179975 ], [ -119.667056, 35.174809 ], [ -119.666663, 35.262527 ], [ -119.809449, 35.263584 ], [ -119.809346, 35.350865 ], [ -119.880172, 35.351211 ], [ -119.880045, 35.439133 ], [ -119.997392, 35.439495 ], [ -119.997382, 35.468702 ], [ -120.015659, 35.469039 ], [ -120.014602, 35.483652 ], [ -120.033314, 35.483648 ], [ -120.033241, 35.498642 ], [ -120.051050, 35.498627 ], [ -120.051237, 35.512695 ], [ -120.068905, 35.512779 ], [ -120.068657, 35.526320 ], [ -120.086674, 35.526554 ], [ -120.085922, 35.614524 ], [ -120.193918, 35.614359 ], [ -120.193892, 35.726513 ], [ -120.194146, 35.789204 ], [ -119.538116, 35.789567 ], [ -119.214033, 35.790489 ], [ -118.507224, 35.789711 ], [ -118.464791, 35.792637 ], [ -118.067719, 35.791537 ], [ -118.008043, 35.789161 ], [ -118.000908, 35.789488 ], [ -117.923120, 35.786812 ], [ -117.924459, 35.798149 ], [ -117.632996, 35.797251 ], [ -117.634251, 35.709927 ], [ -117.651986, 35.709934 ], [ -117.652319, 35.680782 ], [ -117.616195, 35.680856 ], [ -117.616395, 35.651755 ], [ -117.633830, 35.651569 ], [ -117.634771, 35.564109 ], [ -117.630126, 35.564071 ], [ -117.630216, 35.451041 ], [ -117.633659, 35.450997 ], [ -117.633290, 35.097558 ], [ -117.632011, 34.822270 ], [ -117.667292, 34.822526 ], [ -118.130847, 34.820938 ], [ -118.132940, 34.820739 ], [ -118.140074, 34.820780 ]]]
  );
nonUrban = nonUrban.filterBounds(kernCounty);
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

Given the parameters a list of Landsat imageCollections filtered by individual month and year can be generated through the function below.

```javascript
var yearlyCollections  = yearsOfInterest.map(function(i){
    return monthsOfInterest.map(function(j){
      i = ee.Number(i);
      j = ee.Number(j);
      var date = ee.Date.fromYMD(i,j,1);
      return landSatNDVI.filterDate(date, date.advance(1,'month'));
  });}).flatten();
```

The map function iterates through a data structure like a feature collection or a list. Inside the map function computations can be done based on a passed in value (i or j) and return a data structure in this case an filtered image collection.

[Link to Script](https://code.earthengine.google.com/5a54184e8e3b5de77d395ea486e41c42)

###  Gathering Data
<!-- TODO: Add descriptions -->
```javascript
var checkFallow = function(feature){
    var convertYearly = ee.ImageCollection(yearlyCollections.get(year));
    var plotNDVI = convertYearly.filterBounds(feature.geometry());
    plotNDVI = plotNDVI.mean();
    var meanDict = plotNDVI.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: feature.geometry(),
      scale: 1,
      bestEffort:true
    });
    plotNDVI = ee.Number(meanDict.get("NDVI"));
      
    var foo = {};
    var monthYear = year.toString();
    foo[monthYear] = plotNDVI;
    
    return feature.set(foo);
};
```
[Link to Script](https://code.earthengine.google.com/ad3e00e901efa2e463b6ae4a9efce803)
### Exporting the Data
<!-- TODO: Add descriptions -->
```javascript
Export.table.toDrive({
  collection: ee.FeatureCollection(fallowedCheck),
  description: 'LandSat7-Summer-NDVI',
  fileFormat: 'CSV',
});
```

### Visualizing Results