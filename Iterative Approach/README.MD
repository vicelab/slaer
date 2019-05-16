# Slaer Project

## Software Used

1. Google Earth Engine:
   > + An account is needed to view and use Google Earth Engine. [Link to sign up](https://signup.earthengine.google.com/)
   > + After registration the code editor can be viewed at [Link](code.earthengine.google.com).
2. Python:
   >+ Python3 can be installed via this [link](https://www.python.org/).
3. Matplotlib:
    >+ [Library Link](https://matplotlib.org/)

## Importing and Processing Datasets

Three datasets were used to gather NDVI values per plot in a specific county.

1. LandIQ from 2014 with metadata of what the plot is growing at that year and polygon outline of the plot. [Link to Dataset](https://catalog.data.gov/dataset/land-use-2014-land-iq-ds2677)
2. Landsat 2017 NDVI has precomputed NDVI values from Landsat images. [Link to Dataset](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LE07_C01_T1_8DAY_NDVI)
3. GeoJSON with geometries outlining counties. [Link to Dataset](http://eric.clst.org/tech/usgeojson/)

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

### Parameters:

>+ Months of Interest
>+ Years of Interest
>+ Can be a single time period or multiple

```javascript
var yearsOfInterest = ee.List.sequence(1999,2018);
var monthsOfInterest = ee.List.sequence(1,12);
var monthsOfInterest = ee.List([7,12]);
```

Warning: There are cases where at a point in time there is not a NDVI value for a plot and an error will be thrown.

![Image of Error](https://i.imgur.com/8KBfxne.png)

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

The map function iterates through a data structure like a feature collection or a list. Inside the map function computations can be done based on a passed in value (i or j) and return a data structure in this case a filtered image collection.

[Link to Script](https://code.earthengine.google.com/6001c213dd9e0d4f4f29ce27215702ac)

## Gathering Data

Google Earth Engine allows the adding of properties via the set function. Below the mean NDVI value is calculated per plot and set as a property on the plot.

```javascript
var numberOfEntries = yearlyCollections.size();
var yearlyCollectionIndex = 0;

var checkFallow = function(feature){
    //Selects a filtered Landsat imageCollection
    var convertYearly = ee.ImageCollection(yearlyCollections.get(yearlyCollectionIndex));
    //Filters Landsat by the bounds of a feature's (single plot) geometry
    var plotNDVI = convertYearly.filterBounds(feature.geometry());
    //Computes the mean NDVI value over the entire plot
    plotNDVI = plotNDVI.mean();
    var meanDict = plotNDVI.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: feature.geometry(),
      scale: 1,
      bestEffort:true
    });
    //Extracts the NDVI value from the dictonary return value of meanDict
    plotNDVI = ee.Number(meanDict.get("NDVI"));

    //Constructing a dictonary with the index and the NDVI value to be saved to the feature.
    var foo = {};
    var monthYear = yearlyCollectionIndex.toString();
    foo[monthYear] = plotNDVI;

    return feature.set(foo);
};
```

Using the script below time series NDVI can be stored in feature collection.

```javascript
var landIQNDVI = ee.FeatureCollection(nonUrban.map(setNDVI));

for(yearlyCollectionIndex = yearlyCollectionIndex+1; yearlyCollectionIndex < numberOfEntries; yearlyCollectionIndex++){
  landIQNDVI = ee.FeatureCollection(landIQNDVI.map(setNDVI));
}
```

landIQNDVI returns a feature collection with mean NDVI values over the times of interest.

```JSON
"properties": {
    "0": 0.09877312395773193,
    "1": 0.06276312808948771,
    "2": 0.5253586653470814,
    "3": 0.2979903895553776,
    "4": 0.28399248585516185,
    "5": 0.11432357099110248,
    "6": 0.47526314529567587,
    "7": 0.34818060441157317,
    "8": 0.45370712232626437,
    "9": 0.312030452955916,
    "10": 0.22345866422510072,
    "11": 0.08438224407847458,
    "12": 0.521465526833003,
    "13": 0.204677961783142,
    "14": 0.6150093086963376,
    "15": 0.23447950068881104,
    "16": 0.5725433139818257,
    "17": 0.3034091259869929,
    "18": 0.4643725507406636,
    "19": 0.4620643699828776,
    "20": 0.49508907247464856,
    "21": 0.3243342797228612,
    "22": 0.520806995871174,
    "23": 0.5113243309062386,
    "24": 0.5146000702264357,
    "25": 0.23753865377151034,
    "26": 0.6727596679922516,
    "27": 0.43168228585573964,
    "28": 0.4618968378861816,
    "29": 0.29327033538090086,
    "30": 0.37452569638729827,
    "31": 0.22109621685776032,
    "32": 0.27541618087125747,
    "33": 0.39848670981790774,
    "34": 0.4741756929825517,
    "35": 0.4315363232683603,
    "36": 0.3767581578248459,
    "37": 0.567144975313284,
    "38": 0.4721550143541549,
    "39": 0.281364929728735,
```

[Link to Script](https://code.earthengine.google.com/e37279574d2e330319191237e04c8672)

### Exporting the Data

The function below exports a feature collection to a cloud server, Google Drive, or Google Earth Engine asset.

```javascript
Export.table.toDrive({
  collection: ee.FeatureCollection(landIQNDVI),
  description: 'LandSat7-Bi-Yearly-NDVI',
  fileFormat: 'CSV',
});
```

To access the export window on Google Earth Engine switch the right panel tab to tasks.

![Tasks Tab](https://i.imgur.com/Gf3i1cl.png)

Then click the run button to export the data.

![Tasks Tab](https://i.imgur.com/A6hh9kq.png)

[Link to Script](https://code.earthengine.google.com/d9adbabe83d9a11c347449615fbea3f9)

### Visualizing Results
<!-- TODO: Done Via Python Upload Scripts -->