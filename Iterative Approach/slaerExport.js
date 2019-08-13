//Variables to Change

var yearsOfInterest = ee.List.sequence(2005,2018);
var monthsOfInterest = ee.List.sequence(1,12);
var totalTimesteps = 168; // number of years * number of months
var exportName = "LandSat7_Monthly_05-18_Faster";
var exportFileType = "CSV"; //Can be "CSV" "GeoJSON", "KML", "KMZ", or "SHP", or "TFRecord".
var kernCounty = ee.Geometry.MultiPolygon(
    [[[ -118.140074, 34.820780 ], [ -118.854253, 34.817772 ], [ -118.854576, 34.803027 ], [ -118.877289, 34.803212 ], [ -118.881729, 34.817802 ], [ -118.894474, 34.817972 ], [ -118.881364, 34.790629 ], [ -118.976723, 34.790660 ], [ -118.976721, 34.812199 ], [ -119.243645, 34.814178 ], [ -119.243645, 34.857576 ], [ -119.278346, 34.857276 ], [ -119.276946, 34.879675 ], [ -119.382451, 34.879675 ], [ -119.382154, 34.900936 ], [ -119.442352, 34.901274 ], [ -119.472754, 34.901174 ], [ -119.472719, 35.076885 ], [ -119.490709, 35.077208 ], [ -119.490632, 35.091805 ], [ -119.560975, 35.087673 ], [ -119.553641, 35.179975 ], [ -119.667056, 35.174809 ], [ -119.666663, 35.262527 ], [ -119.809449, 35.263584 ], [ -119.809346, 35.350865 ], [ -119.880172, 35.351211 ], [ -119.880045, 35.439133 ], [ -119.997392, 35.439495 ], [ -119.997382, 35.468702 ], [ -120.015659, 35.469039 ], [ -120.014602, 35.483652 ], [ -120.033314, 35.483648 ], [ -120.033241, 35.498642 ], [ -120.051050, 35.498627 ], [ -120.051237, 35.512695 ], [ -120.068905, 35.512779 ], [ -120.068657, 35.526320 ], [ -120.086674, 35.526554 ], [ -120.085922, 35.614524 ], [ -120.193918, 35.614359 ], [ -120.193892, 35.726513 ], [ -120.194146, 35.789204 ], [ -119.538116, 35.789567 ], [ -119.214033, 35.790489 ], [ -118.507224, 35.789711 ], [ -118.464791, 35.792637 ], [ -118.067719, 35.791537 ], [ -118.008043, 35.789161 ], [ -118.000908, 35.789488 ], [ -117.923120, 35.786812 ], [ -117.924459, 35.798149 ], [ -117.632996, 35.797251 ], [ -117.634251, 35.709927 ], [ -117.651986, 35.709934 ], [ -117.652319, 35.680782 ], [ -117.616195, 35.680856 ], [ -117.616395, 35.651755 ], [ -117.633830, 35.651569 ], [ -117.634771, 35.564109 ], [ -117.630126, 35.564071 ], [ -117.630216, 35.451041 ], [ -117.633659, 35.450997 ], [ -117.633290, 35.097558 ], [ -117.632011, 34.822270 ], [ -117.667292, 34.822526 ], [ -118.130847, 34.820938 ], [ -118.132940, 34.820739 ], [ -118.140074, 34.820780 ]]]
  );

//
//    Script
//

// Filter landIQ with Kern County geometry
var nonUrban = iq.filterBounds(kernCounty);
nonUrban = nonUrban.filter(ee.Filter.neq("Crop2014","Urban"));
print(nonUrban.size());

// Import the Landsat 7 NDVI 8-day dataset
var landSatNDVI =  ee.ImageCollection("LANDSAT/LE07/C01/T1_8DAY_NDVI");

// Create a collection of ImageCollections, where each collection is a timestep for a different month/year
var ndviCollection = yearsOfInterest.map(function(year) {
  return monthsOfInterest.map(function(month) {
    var date = ee.Date.fromYMD(year,month,1);
    return landSatNDVI.filterDate(date,date.advance(1,'month')); // an ImageCollection filtered for the proper date
  }) // a collection ImageCollections based on month
}).flatten(); // flatten from a 2d Collection of ImageCollections to a 1d Collection of ImageCollections

// Iterate over the Collection of ImageCollections, to create a List of ImageCollections, with an index for each preserving their order
var ndviList = ee.List(ndviCollection.iterate(function(coll,list) {
  // cast to GEE objects to gain access to methods again
  coll = ee.ImageCollection(coll);
  list = ee.List(list);
  // set the index based on current List length aka assigns indices in order
  coll = coll.set("timestep",list.length());
  // return the extended List to be used next step
  return list.add(coll);
},ee.List([]))); // start the iteration with an empty List

// Calculate the mean NDVI value for each plot at each timestep
var timeseriesNDVI = nonUrban.map(function(feature) {
  // Asynchronously compute the mean NDVI values for this plot
  var results = ndviList.map(function(collection) {
    collection = ee.ImageCollection(collection)
    var plotNDVI = collection.filterBounds(feature.geometry());
    // Computes the mean NDVI value over the entire plot
    plotNDVI = plotNDVI.mean();
    var meanDict = plotNDVI.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: feature.geometry(),
      scale: 1,
      bestEffort:true
    });
    // Extracts the NDVI value from the dictonary return value of meanDict
    plotNDVI = ee.Number(meanDict.get("NDVI"));
    // Return a list with the index and the NDVI value to be saved to the feature
    return [collection.get("timestep"),plotNDVI];
  });
  // Once all results have been collected, iterate through and save them to the feature
  return results.iterate(function(result,ft) {
    result = ee.List(result);
    return ee.Feature(ft).set(result.get(0),result.get(1)); // sets feature[timestep] to plotNDVI
  },feature);
});

// Export the results as CSV or other
Export.table.toDrive({
  collection: ee.FeatureCollection(timeseriesNDVI),
  description: exportName,
  fileFormat: exportFileType,
});
