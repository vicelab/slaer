Map.setCenter(-119.44,35.65);

var bands = ['B5','B4', 'B3'];

var sentinel_image = ee.Image(ee.ImageCollection('COPERNICUS/S2')
  .filterDate('2014-05-01', '2014-05-10')
  .filterBounds(roi)
  .sort('CLOUDY_PIXEL_PERCENTAGE', true)
  .first());

Map.addLayer(sentinel_image, bands, "Sentinel-2")

//Filter Landsat
var image = ee.Image(ee.ImageCollection('LANDSAT/LC08/C01/T1')
  .filterBounds(roi)
  .filterDate('2014-5-01', '2014-5-10')
  .sort('CLOUD_COVER')
  .first());
  

Map.addLayer(all_fallow);
//Map.addLayer(image, bands, 'Landsat');

//Merging imports of sample regions into one feature collection 
var trainingFC = not_fallowed.merge(fallowed);

//Training data
var training = image.select(bands).sampleRegions({
  collection: trainingFC,
  properties: ['landcover'],
  scale: 30
});

//CART Classifier Training
var classifier = ee.Classifier.cart().train({
  features: training,
  classProperty: 'landcover', 
  inputProperties: bands
  
});

//Random Forest Classifier Training
// var classifier = ee.Classifier.randomForest().train({
//   features: training,
//   classProperty: 'landcover', 
//   inputProperties: bands
  
// });

//SVM Classifier Training
// var classifier = ee.Classifier.svm().train({
//   features: training,
//   classProperty: 'landcover', 
//   inputProperties: bands
// });


//Run classification 
var classified = image.select(bands).classify(classifier);

//Displaying results
Map.centerObject(roi, 11);

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

//Random Forest Testing
// var trainedClassifier = ee.Classifier.randomForest().train({
//   features: trainingPartition,
//   classProperty: 'landcover',
//   inputProperties: bands
// });

//SVM Testing
// var trainedClassifier = ee.Classifier.svm().train({
//   features: trainingPartition,
//   classProperty: 'landcover',
//   inputProperties: bands
// });

var test = testingPartition.classify(trainedClassifier);

//Confusion Matrix
var confusionMatrix = test.errorMatrix('landcover', 'classification');
print('Testing error matrix', confusionMatrix);
print('Testing accuraccy', confusionMatrix.accuracy());

//Cohen's Kappa
print("Kappa Statistic", confusionMatrix.kappa());