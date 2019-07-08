//Variables to Change

//Start Index of NDVI checking 0 = 7-1999 in default cases
var yearlyCollectionIndex = 0;

var yearsOfInterest = ee.List.sequence(2016,2018);
var monthsOfInterst = ee.List([1,7]);
var exportName = "Sentinel2-JulyJan";
var exportFileType = "CSV"; //Can be "CSV" "GeoJSON", "KML", "KMZ", or "SHP", or "TFRecord".
var kernCounty = ee.Geometry.MultiPolygon(
    [[[ -118.140074, 34.820780 ], [ -118.854253, 34.817772 ], [ -118.854576, 34.803027 ], [ -118.877289, 34.803212 ], [ -118.881729, 34.817802 ], [ -118.894474, 34.817972 ], [ -118.881364, 34.790629 ], [ -118.976723, 34.790660 ], [ -118.976721, 34.812199 ], [ -119.243645, 34.814178 ], [ -119.243645, 34.857576 ], [ -119.278346, 34.857276 ], [ -119.276946, 34.879675 ], [ -119.382451, 34.879675 ], [ -119.382154, 34.900936 ], [ -119.442352, 34.901274 ], [ -119.472754, 34.901174 ], [ -119.472719, 35.076885 ], [ -119.490709, 35.077208 ], [ -119.490632, 35.091805 ], [ -119.560975, 35.087673 ], [ -119.553641, 35.179975 ], [ -119.667056, 35.174809 ], [ -119.666663, 35.262527 ], [ -119.809449, 35.263584 ], [ -119.809346, 35.350865 ], [ -119.880172, 35.351211 ], [ -119.880045, 35.439133 ], [ -119.997392, 35.439495 ], [ -119.997382, 35.468702 ], [ -120.015659, 35.469039 ], [ -120.014602, 35.483652 ], [ -120.033314, 35.483648 ], [ -120.033241, 35.498642 ], [ -120.051050, 35.498627 ], [ -120.051237, 35.512695 ], [ -120.068905, 35.512779 ], [ -120.068657, 35.526320 ], [ -120.086674, 35.526554 ], [ -120.085922, 35.614524 ], [ -120.193918, 35.614359 ], [ -120.193892, 35.726513 ], [ -120.194146, 35.789204 ], [ -119.538116, 35.789567 ], [ -119.214033, 35.790489 ], [ -118.507224, 35.789711 ], [ -118.464791, 35.792637 ], [ -118.067719, 35.791537 ], [ -118.008043, 35.789161 ], [ -118.000908, 35.789488 ], [ -117.923120, 35.786812 ], [ -117.924459, 35.798149 ], [ -117.632996, 35.797251 ], [ -117.634251, 35.709927 ], [ -117.651986, 35.709934 ], [ -117.652319, 35.680782 ], [ -117.616195, 35.680856 ], [ -117.616395, 35.651755 ], [ -117.633830, 35.651569 ], [ -117.634771, 35.564109 ], [ -117.630126, 35.564071 ], [ -117.630216, 35.451041 ], [ -117.633659, 35.450997 ], [ -117.633290, 35.097558 ], [ -117.632011, 34.822270 ], [ -117.667292, 34.822526 ], [ -118.130847, 34.820938 ], [ -118.132940, 34.820739 ], [ -118.140074, 34.820780 ]]]
  );
var numberOfEntries = 6; //Years.size * Month.size

//
//    Script
//

var nonUrban = table.filterBounds(kernCounty);
nonUrban = nonUrban.filter(ee.Filter.neq("Crop2014","Urban"));
print(nonUrban.size()); //Output 359893 feature

//We will now include Landsat 7 NDVI 8-day dataset.
var sentinelNDVI = ee.ImageCollection("COPERNICUS/S2");

var yearlyCollections  = yearsOfInterest.map(function(i){
    return monthsOfInterst.map(function(j){
      i = ee.Number(i);
      j = ee.Number(j);
      var date = ee.Date.fromYMD(i,j,1);
      return sentinelNDVI.filterDate(date, date.advance(1,'month'));
  });}).flatten();
print(yearlyCollections);

// need to do this for sentinel, since there is no ndvi band
var addNDVIBand = function(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename("NDVI");
  return image.addBands(ndvi);
};

var setNDVI = function(feature){
    //Selects a filtered Landsat imageCollection
    var convertYearly = ee.ImageCollection(yearlyCollections.get(yearlyCollectionIndex));

    //Filters Landsat by the bounds of a feature's (single plot) geometry
    var plotNDVI = convertYearly.filterBounds(feature.geometry());

    // Add the NDVI band to sentinel 2
    plotNDVI = plotNDVI.map(addNDVIBand);
    plotNDVI = plotNDVI.select(['NDVI']);
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

    //Constructing a dictionary with the index and the NDVI value to be saved to the feature.
    var foo = {};
    var monthYear = yearlyCollectionIndex.toString();
    foo[monthYear] = plotNDVI;

    return feature.set(foo);
};

var landIQNDVI = ee.FeatureCollection(nonUrban.map(setNDVI));

for(yearlyCollectionIndex = yearlyCollectionIndex+1; yearlyCollectionIndex < numberOfEntries; yearlyCollectionIndex++){
  // hacky fix (sentinel 2 is missing data for Feb 2016)
  // if (yearlyCollectionIndex==1) continue;
  landIQNDVI = ee.FeatureCollection(landIQNDVI.map(setNDVI));
}

print(landIQNDVI.first());

Export.table.toDrive({
  collection: ee.FeatureCollection(landIQNDVI),
  description: exportName,
  fileFormat: exportFileType,
});
