
var centralValley = ee.FeatureCollection('ft:1h46ENpEp8vO3pOe1EqeF1sZLEDhSVMxbu8pHAoU4', 'geometry');
var county = ee.Geometry.MultiPolygon(
    [[[ -118.140074, 34.820780 ], [ -118.854253, 34.817772 ], [ -118.854576, 34.803027 ], [ -118.877289, 34.803212 ], [ -118.881729, 34.817802 ], [ -118.894474, 34.817972 ], [ -118.881364, 34.790629 ], [ -118.976723, 34.790660 ], [ -118.976721, 34.812199 ], [ -119.243645, 34.814178 ], [ -119.243645, 34.857576 ], [ -119.278346, 34.857276 ], [ -119.276946, 34.879675 ], [ -119.382451, 34.879675 ], [ -119.382154, 34.900936 ], [ -119.442352, 34.901274 ], [ -119.472754, 34.901174 ], [ -119.472719, 35.076885 ], [ -119.490709, 35.077208 ], [ -119.490632, 35.091805 ], [ -119.560975, 35.087673 ], [ -119.553641, 35.179975 ], [ -119.667056, 35.174809 ], [ -119.666663, 35.262527 ], [ -119.809449, 35.263584 ], [ -119.809346, 35.350865 ], [ -119.880172, 35.351211 ], [ -119.880045, 35.439133 ], [ -119.997392, 35.439495 ], [ -119.997382, 35.468702 ], [ -120.015659, 35.469039 ], [ -120.014602, 35.483652 ], [ -120.033314, 35.483648 ], [ -120.033241, 35.498642 ], [ -120.051050, 35.498627 ], [ -120.051237, 35.512695 ], [ -120.068905, 35.512779 ], [ -120.068657, 35.526320 ], [ -120.086674, 35.526554 ], [ -120.085922, 35.614524 ], [ -120.193918, 35.614359 ], [ -120.193892, 35.726513 ], [ -120.194146, 35.789204 ], [ -119.538116, 35.789567 ], [ -119.214033, 35.790489 ], [ -118.507224, 35.789711 ], [ -118.464791, 35.792637 ], [ -118.067719, 35.791537 ], [ -118.008043, 35.789161 ], [ -118.000908, 35.789488 ], [ -117.923120, 35.786812 ], [ -117.924459, 35.798149 ], [ -117.632996, 35.797251 ], [ -117.634251, 35.709927 ], [ -117.651986, 35.709934 ], [ -117.652319, 35.680782 ], [ -117.616195, 35.680856 ], [ -117.616395, 35.651755 ], [ -117.633830, 35.651569 ], [ -117.634771, 35.564109 ], [ -117.630126, 35.564071 ], [ -117.630216, 35.451041 ], [ -117.633659, 35.450997 ], [ -117.633290, 35.097558 ], [ -117.632011, 34.822270 ], [ -117.667292, 34.822526 ], [ -118.130847, 34.820938 ], [ -118.132940, 34.820739 ], [ -118.140074, 34.820780 ]]]
  );
var nonUrban = table.filterBounds(county);
nonUrban = nonUrban.filter(ee.Filter.neq("Crop2014", "Urban"));

var landsat = ee.ImageCollection("LANDSAT/LE07/C01/T1_8DAY_NDVI");
var dataset = ee.ImageCollection('LANDSAT/LE07/C01/T1_8DAY_NDWI')

var years = ee.List.sequence(1999,2018);
var months = ee.List([1,7]);
print(months);
var year = 1;
var dataSetType = "NDWI";
var test = "0";

var yearlyCollections  = years.map(function(i){
    return months.map(function(j){
      i = ee.Number(i);
      j = ee.Number(j);
      var date = ee.Date.fromYMD(i,j,1);
      return landsat.filterDate(date, date.advance(1,'month'));
  });}).flatten();
// var yearlyCollections = years.map(function(i){
//   i = ee.Number(i);
//   var date = ee.Date.fromYMD(i,12,1);
//   return landsat.filterDate(date, date.advance(3, 'month'));
// });

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
      
    var books = [];
    var foo = {};
    var monthYear = year.toString();
    // var monthYear = "NDVI";
    foo[monthYear] = plotNDVI;
    
    return feature.set(foo);
};

var removeGeo = function(feature){
  return feature.setGeometry(null);
}

var fallowedCheck = ee.FeatureCollection(nonUrban.map(checkFallow));

for(year = year+1; year < 40; year++){
  fallowedCheck = ee.FeatureCollection(fallowedCheck.map(checkFallow));
}

fallowedCheck = ee.FeatureCollection(fallowedCheck.map(removeGeo));
print(yearlyCollections);
print(fallowedCheck.first());

Export.table.toDrive({
  collection: ee.FeatureCollection(fallowedCheck),
  description: 'KernSummerWinter',
  fileFormat: 'CSV',
});












