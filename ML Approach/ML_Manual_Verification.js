Map.setCenter(-119.44,35.65);

var nd = ['NDVI'], ms = ["MSAVI2"];
var landSatRGB = ['B3','B2','B1'], sentinelRGB = ['B4','B3','B2'];
// var satNir = 'B4', satRed = 'B3'; // landsat
var satNir = 'B8', satRed = 'B4'; // sentinel

// Dates
// var startDate = "2014-5-01", endDate = "2014-5-10"; // landsat
var startDate = "2018-5-01", endDate = "2018-5-03"; // sentinel

//Filter Land IQ
var nonUrban = iq.filter(ee.Filter.neq("Crop2014", "Urban"));
var filtered = nonUrban.filter(ee.Filter.eq("County", "Kern"));



// //Filter Training Input
// var landSat = ee.Image(ee.ImageCollection('LANDSAT/LE07/C01/T1')
//   .filterDate(startDate,ee.Date(startDate).advance(15,'day'))
//   .select([satNir,satRed])
//   .sort('CLOUD_COVER')
//   .mosaic()
//   .addBands(ee.Image(ee.ImageCollection('LANDSAT/LC08/C01/T1_8DAY_NDVI')
//     .filterDate(startDate,endDate)
//     .select(nd)
//     .sort('CLOUD_COVER')
//     .first())));
// //Filter to Classify on LandIQ
// var landSatTest = ee.Image(ee.ImageCollection('LANDSAT/LE07/C01/T1')
//   .filterBounds(filtered.geometry())
//   .filterDate(startDate,ee.Date(startDate).advance(15,'day'))
//   .select([satNir,satRed])
//   .sort('CLOUD_COVER')
//   .mosaic()
//   .addBands(ee.Image(ee.ImageCollection('LANDSAT/LC08/C01/T1_8DAY_NDVI')
//     .filterBounds(filtered.geometry())
//     .filterDate(startDate,endDate)
//     .select(nd)
//     .sort('CLOUD_COVER')
//     .first())));


// Sentinel training input
var sentinel = ee.Image(ee.ImageCollection('COPERNICUS/S2')
  .filterDate(startDate, endDate)
  .select([satNir,satRed])
  .sort('CLOUDY_PIXEL_PERCENTAGE', false)
  .mosaic()); // mosaic the images together, since Sentinel 2 has smaller images
// Filter sentinel images to classify
var sentinelTest = ee.Image(ee.ImageCollection('COPERNICUS/S2')
  .filterBounds(filtered.geometry())
  .filterDate(startDate,endDate)
  .select([satNir,satRed])
  .sort('CLOUDY_PIXEL_PERCENTAGE', false)
  .mosaic());

// functions to calculate index bands
var addNDVI = function(image) {
  var ndvi = image.normalizedDifference([satNir,satRed]).rename("NDVI");
  return image.addBands(ndvi);
};
var addMSAVI2 = function(image) {
  var nir = image.select([satNir]), red = image.select([satRed]);
  var msavi2 = nir.multiply(2).add(1).subtract( nir.multiply(2).add(1).pow(2).subtract(nir.subtract(red).multiply(8)).sqrt() ).divide(2).rename('MSAVI2');
  return image.addBands(msavi2);
};
// landSat = addMSAVI2(landSat);
// landSatTest = addMSAVI2(landSatTest);
sentinel = addMSAVI2(addNDVI(sentinel));
sentinelTest = addMSAVI2(addNDVI(sentinelTest));

// draw the raw satellite image for comparison
// var rawImage = ee.Image(ee.ImageCollection('LANDSAT/LE07/C01/T1')
var rawImage = ee.Image(ee.ImageCollection('COPERNICUS/S2')
  .filterBounds(filtered.geometry())
  .filterDate(startDate,ee.Date(startDate).advance(1,'month'))
  // .select(landSatRGB)
  // .sort('CLOUD_COVER')
  .select(sentinelRGB)
  .sort('CLOUDY_PIXEL_PERCENTAGE', false)
  .mosaic());
// Map.addLayer(rawImage,{bands: landSatRGB},"RawLandSat");
Map.addLayer(rawImage,{min: 0.0, max: 3000, bands: sentinelRGB},"RawSentinel");

// Map.addLayer(filtered, {}, 'Filtered');
// Map.addLayer(landSatTest, {bands: nd}, 'LandSatNDVI');
// Map.addLayer(landSatTest, {bands: ms}, 'LandSatMSAVI2');
Map.addLayer(sentinelTest, {bands: nd}, 'SentinelNDVI');
Map.addLayer(sentinelTest, {bands: ms}, 'SentinelMSAVI2');


//Merging imports of sample regions into one feature collection
// var trainingFC = not_fallowed.merge(fallowed);
var trainingFC = not_fallowed_sentinel.merge(fallowed);

//Training data
// var trainingNDVI = landSat.select(nd).sampleRegions({
var trainingNDVI = sentinel.select(nd).sampleRegions({
  collection: trainingFC,
  properties: ['landcover'],
  // scale: 30 // landsat
  scale: 10 // sentinel
});
// var trainingMSAVI = landSat.select(ms).sampleRegions({
var trainingMSAVI = sentinel.select(ms).sampleRegions({
  collection: trainingFC,
  properties: ['landcover'],
  // scale: 30 // landsat
  scale: 10 // sentinel
});

//CART Classifier Training
var ndviClassifier = ee.Classifier.cart().train({
  features: trainingNDVI,
  classProperty: 'landcover',
  inputProperties: nd
});
var msaviClassifier = ee.Classifier.cart().train({
  features: trainingMSAVI,
  classProperty: 'landcover',
  inputProperties: ms
});

//Run classification
// var classifiedNDVI = landSatTest.select(nd).classify(ndviClassifier);
// var classifiedMSAVI = landSatTest.select(ms).classify(msaviClassifier);
var classifiedNDVI = sentinelTest.select(nd).classify(ndviClassifier);
var classifiedMSAVI = sentinelTest.select(ms).classify(msaviClassifier);

//Displaying results
Map.centerObject(iqROI, 7.5);

//70FF00 (green) not fallowed, FF2D000 (red) fallowed
Map.addLayer(classifiedNDVI, {min: 0, max: 1, palette: ['70FF00', 'FF2D00']}, 'NDVI classif.');
Map.addLayer(classifiedMSAVI, {min: 0, max: 1, palette: ['70FF00', 'FF2D00']}, 'MSAVI2 classif.');


// 'Manual' classification check

// Filter kern shapefile by date range
var selectingRange = ee.DateRange(startDate,endDate);
// var kernDated = kern2014.map(function(feature) {
var kernDated = kern2018.map(function(feature) {
  var plotStart = ee.Date(feature.get("DT_ACT"));
  // var plotEnd = ee.Date(feature.get("DT_INACT"));
  var fc = ee.FeatureCollection([feature]).filter(ee.Filter.eq("DT_INACT",null)); // filter for null DT_INACT value
  var plotEnd = ee.Date(ee.Algorithms.If(fc.size().gt(0), endDate, feature.get("DT_INACT"))); // if null, use endDate as the date. otherwise use DT_INACT
  var plotRange = ee.DateRange(plotStart,plotEnd);
  return ee.Algorithms.If(selectingRange.intersects(plotRange),feature,null);
},true);


var k = 100; // number of random plots to manually check

// // Choose k random indices from the filtered plots
// var totalPlots = 11178;
// // print(kernDated.size()); // use this to manually set totalPlots
// var randomSet = [];
// for (var i = 0; i < k; i++) randomSet.push(i);
// for (var i = k; i < totalPlots; i++) {
//   var j = Math.floor(Math.random()*i);
//   if (j<k) randomSet[j] = i;
// }
// print(randomSet);

// OR, set the list manually
// these plots were used for LandSat
// var randomSet = [5454,2541,5591,7416,2045,10629,5099,2444,8036,8199,431,287,556,6040,3488,2726,1518,1427,1715,9369,10092,6727,346,6113,1639,6419,6928,7751,8107,8502,8642,1078,5199,7006,7596,3105,8204,6553,9465,5975,8336,9143,8196,7148,6493,6803,3273,1931,7506,2625,2072,9781,1123,7862,4926,2108,6744,6729,2302,1526,3747,1372,3263,7586,4904,5190,5827,1090,3228,10487,918,6387,10550,6750,7070,8873,1022,2213,4929,8485,7547,5114,4238,5311,6581,139,6653,1821,7303,8760,9009,5159,92,763,7817,224,5950,630,2159,5734];
// and these for sentinel (any identical numbers won't match the same plots as landsat, since different years were used)
var randomSet = [4041,3196,8497,5754,6800,6531,8475,10889,4234,7965,7195,7618,4343,795,4864,4782,7691,11108,11105,1777,6025,6634,4273,7109,10449,1064,5059,8680,6465,9805,10022,2273,9121,5536,9147,9120,5978,322,263,3933,1128,2441,7798,1214,2300,10121,7669,9474,5553,2787,9294,10300,10936,2637,2377,3204,8800,11057,5473,1576,8900,1805,6347,6322,6337,4366,157,4650,1988,10591,7988,7844,5073,1814,3231,152,7781,10210,3184,6545,8171,2208,2102,6973,3077,2575,6233,6571,992,10030,7280,924,7053,5843,1457,4944,9604,8408,9264,1902];

// Collect random plots from the chosen indices
var kernList = kernDated.toList(kernDated.size());
var randomPlotsList = ee.List(randomSet).map(function(index) {
  var plot = ee.Feature(kernList.get(index));
  plot = plot.set('plotNum',index);
  return plot.select(['plotNum','COMM','P_STATUS','PMT_SITE','PMT_YEAR']);
});
var randomPlots = ee.FeatureCollection(randomPlotsList);
Map.addLayer(randomPlots,null,"random");
// print(randomPlots);


// // Draw classification only on random plots
// Map.addLayer(classified.clip(randomPlots), {min: 0, max: 1, palette: ['70FF00', 'FF2D00']},'classification');

// remove map layers
var removeLayer = function(name) {
  var layers = Map.layers();
  var names = [];
  layers.forEach(function(lay) {
    var lay_name = lay.getName();
    names.push(lay_name);
  })
  var index = names.indexOf(name);
  if (index > -1) {
    var layer = layers.get(index);
    Map.remove(layer);
  }
}
// get plot from randomPlots using its index from 0 to (k-1)
var getPlot = function(index) {
  var plotNum = randomSet[index];
  return randomPlots.filter(ee.Filter.eq("plotNum",plotNum));
}
// show plot on map
var showPlot = function(index) {
  var plot = getPlot(index);
  plotNumLabel.setValue("Plot #"+randomSet[index]);
  removeLayer("ChosenPlot");
  removeLayer("classifiedNDVIPlot");
  removeLayer("classifiedMSAVIPlot");
  Map.addLayer(plot,null,"ChosenPlot");
  Map.addLayer(classifiedNDVI.clip(plot),{min: 0, max: 1, palette: ['70FF00', 'FF2D00']},'classifiedNDVIPlot');
  Map.addLayer(classifiedMSAVI.clip(plot),{min: 0, max: 1, palette: ['70FF00', 'FF2D00']},'classifiedMSAVIPlot');
  Map.centerObject(plot);
}

// ui
var plotNumLabel = ui.Label();
Map.add(plotNumLabel)
showPlot(0);
var lookIndex = 0;
var lookBox = ui.Textbox("num",lookIndex,function(text,box) {
  box.setValue(Math.max(0,Math.min(k-1,box.getValue())),false);
  lookIndex = box.getValue();
  showPlot(lookIndex);
});
Map.add(ui.Button("-",function(button) {
  lookBox.setValue(--lookIndex);
}));
Map.add(lookBox);
Map.add(ui.Button("+",function(button) {
  lookBox.setValue(++lookIndex);
}));


// // Export table data for all plots
// Export.table.toDrive({
//   collection: randomPlots,
//   description: 'RandomPlotData',
//   fileFormat: 'CSV'
// });
