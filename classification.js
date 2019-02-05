//classification on landsat image
Map.setCenter(-119.26, 35.37)

var image = ee.Image(ee.ImageCollection('LANDSAT/LC08/C01/T1_RT')
  .filterBounds(roi)
  .filterDate('2017-7-01', '2017-7-10')
  .sort('CLOUD_COVER')
  .first())
Map.addLayer(interest_fallow)
Map.addLayer(image)
// Map.addLayer(image, {bands: ['B5', 'B4', 'B3'], max: 0.3}, 'image');

  