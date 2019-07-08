Map.setCenter(-119.44,35.65);
//Bands used for classification (NDVI)
var bands = ['NDVI'];

//Filter Land IQ
var nonUrban = iq.filter(ee.Filter.neq("Crop2014", "Urban"));
var filtered = nonUrban.filter(ee.Filter.eq("County", "Kern"));

// Filter sentinel images to classify
var sentinelCollection = ee.ImageCollection('COPERNICUS/S2')
  .filterBounds(filtered.geometry())
  .filterDate('2018-05-01', '2018-05-03')
  .select(['B8','B4'])
  .sort('CLOUDY_PIXEL_PERCENTAGE', true);

// mosaic the images together, since Sentinel 2 has smaller images
var sentinelImg = ee.Image(sentinelCollection.toList(sentinelCollection.size()).get(1));

var addNDVIBand = function(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename("NDVI");
  return image.addBands(ndvi);
};
sentinelImg = addNDVIBand(sentinelImg);

// Map.addLayer(all_fallow, {}, "Kern");
Map.addLayer(sentinelImg, bands, 'Sentinel');
//Map.addLayer(iq, {color: '000000'}, 'IQ');
Map.addLayer(filtered, {}, 'Filtered');

//Merging imports of sample regions into one feature collection
var trainingFC = not_fallowed.merge(fallowed);

//Training data
var training = sentinelImg.select(bands).sampleRegions({
  collection: trainingFC,
  properties: ['landcover'],
  scale: 30
});

//CART Classifier Training
var trainedClassifier = ee.Classifier.cart().train({
  features: training,
  classProperty: 'landcover',
  inputProperties: bands
});

//Run classification
var classified = sentinelImg.select(bands).classify(trainedClassifier);

//Displaying results
Map.centerObject(iqROI, 7.5);

//70FF00 (green) not fallowed, FF2D000 (red) fallowed
Map.addLayer(classified, {min: 0, max: 1, palette: ['70FF00', 'FF2D00']},
'classification');

var withRandom = training.randomColumn('random');

var split = 0.7;  // Roughly 70% training, 30% testing.

var trainingPartition = withRandom.filter(ee.Filter.lt('random', split));
print("Training Partition", trainingPartition);
var testingPartition = withRandom.filter(ee.Filter.gte('random', split));
print("Testing Partition", testingPartition);

//CART Testing
var trainedClassifier = ee.Classifier.cart().train({
  features: trainingPartition,
  classProperty: 'landcover',
  inputProperties: bands
});

//Classifying on Testing Partition
var test = testingPartition.classify(trainedClassifier);

//Confusion Matrix
var confusionMatrix = test.errorMatrix('landcover', 'classification');
print('Testing error matrix', confusionMatrix);
print('Testing accuraccy', confusionMatrix.accuracy());

//Cohen's Kappa
print("Kappa Statistic", confusionMatrix.kappa());
