Map.setCenter(-119.44,35.65);

//Filter
var image = ee.Image(ee.ImageCollection('LANDSAT/LC08/C01/T1_RT')
  .filterBounds(roi)
  .filterDate('2014-5-01', '2014-5-10')
  .sort('CLOUD_COVER')
  .first());
Map.addLayer(all_fallow);
Map.addLayer(image, {bands: ['B5', 'B4', 'B3']}, 'Landsat');

//Merging imports of sample regions into one feature collection 
var trainingFC = fallowed.merge(not_fallowed);

//Training data
var bands = ['B5','B4','B3'];
var training = image.select(bands).sampleRegions({
  collection: trainingFC,
  properties: ['landcover'],
  scale: 30
});

//Classifier Training
var classifier = ee.Classifier.cart().train({
  features: training,
  classProperty: 'landcover', 
  inputProperties: bands
  
});

//Run classification 
var classified = image.select(bands).classify(classifier);

//Displaying results
Map.centerObject(roi, 11);

//70FF00 (green) not fallowed, FF2D000 (red) fallowed
Map.addLayer(classified, {min: 0, max: 1, palette: ['70FF00', 'FF2D00']}, 
'classification');

var trainingAcc = classifier.confusionMatrix();
var explain = ee.Classifier.explain(classifier);
print(trainingAcc);