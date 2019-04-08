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

// //100% acc expected due to confusionMatrix being applied to the same data so we need to validata via external data 
// print('RF, error matrix: ', classifier.confusionMatrix());
// print('RF accuracy: ', classifier.confusionMatrix().accuracy());

var withRandom = training.randomColumn('random');

var split = 0.5;  // Roughly 70% training, 30% testing.
var trainingPartition = withRandom.filter(ee.Filter.lt('random', split));
var testingPartition = withRandom.filter(ee.Filter.gte('random', split));

var trainedClassifier = ee.Classifier.cart().train({
  features: trainingPartition,
  classProperty: 'landcover',
  inputProperties: bands
});

var test = testingPartition.classify(trainedClassifier);

var confusionMatrix = test.errorMatrix('landcover', 'classification');
print('Testing error matrix', confusionMatrix);
print('Testing accuraccy', confusionMatrix.accuracy());

//ROC Curve 

fallowed = classified.reduceRegions(fallowed,ee.Reducer.max().setOutputs(['ndvi']),30).map(function(x){return x.set('is_target',1);})
not_fallowed = classified.reduceRegions(not_fallowed,ee.Reducer.max().setOutputs(['ndvi']),30).map(function(x){return x.set('is_target',0);})
var combined = fallowed.merge(not_fallowed)


var ROC_field = 'ndvi', ROC_min = 0, ROC_max = 1, ROC_steps = 1000, ROC_points = combined

var ROC = ee.FeatureCollection(ee.List.sequence(ROC_min, ROC_max, null, ROC_steps).map(function (cutoff) {
  var target_roc = ROC_points.filterMetadata('is_target','equals',1)
  // true-positive-rate, sensitivity  
  var TPR = ee.Number(target_roc.filterMetadata(ROC_field,'greater_than',cutoff).size()).divide(target_roc.size()) 
  var non_target_roc = ROC_points.filterMetadata('is_target','equals',0)
  // true-negative-rate, specificity  
  var TNR = ee.Number(non_target_roc.filterMetadata(ROC_field,'less_than',cutoff).size()).divide(non_target_roc.size()) 
  return ee.Feature(null,{cutoff: cutoff, TPR: TPR, TNR: TNR, FPR:TNR.subtract(1).multiply(-1),  dist:TPR.subtract(1).pow(2).add(TNR.subtract(1).pow(2)).sqrt()})
}))

var X = ee.Array(ROC.aggregate_array('FPR')), 
    Y = ee.Array(ROC.aggregate_array('TPR')), 
    Xk_m_Xkm1 = X.slice(0,1).subtract(X.slice(0,0,-1)),
    Yk_p_Ykm1 = Y.slice(0,1).add(Y.slice(0,0,-1)),
    AUC = Xk_m_Xkm1.multiply(Yk_p_Ykm1).multiply(0.5).reduce('sum',[0]).abs().toList().get(0)
print(AUC,'Area under curve')
// Plot the ROC curve
print(ui.Chart.feature.byFeature(ROC, 'FPR', 'TPR').setOptions({
      title: 'ROC curve',
      legend: 'none',
      hAxis: { title: 'False-positive-rate'},
      vAxis: { title: 'True-negative-rate'},
      lineWidth: 1}))
// find the cutoff value whose ROC point is closest to (0,1) (= "perfect classification")      
var ROC_best = ROC.sort('dist').first().get('cutoff').aside(print,'best ROC point cutoff')