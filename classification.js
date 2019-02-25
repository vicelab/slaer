Map.setCenter(-119.26, 35.37);

//Filter
var image = ee.Image(ee.ImageCollection('LANDSAT/LC08/C01/T1_RT')
  .filterBounds(roi)
  .filterDate('2014-5-01', '2014-5-10')
  .sort('CLOUD_COVER')
  .first());
Map.addLayer(all_fallow);
Map.addLayer(image, {bands: ['B5', 'B4', 'B3']}, 'image');

//Merging imports of sample regions into one feature collection 
var trainingFC = not_fallowed.merge(fallowed);
//print(trainingFC);

//Training data
var bands = ['B2','B3','B4','B5'];
var training = image.select(bands).sampleRegions({
  collection: trainingFC,
  properties: ['landcover'],
  scale: 30
});

print(training);

//Classifier Training
var classifier = ee.Classifier.cart().train({
  features: training,
  classProperty: 'landcover',
  inputProperties: bands
});
