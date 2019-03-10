//Dataset of satellite images from 2013 till real time.
//Will use times around harvests to ensure the crops get to grow and show color
var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_RT')
                  .filterDate('2018-7-01', '2018-7-10');
//Selects the color bans NIR - Red - Green
var timeLapse = dataset.select(['B5', 'B4', 'B3']);
//Removes the urban + idle land from the map and dataset
var nonUrban = table.filter(ee.Filter.neq("Crop2014", "Urban"));

//Landsat with just NDVI band
var NDVICollection =  ee.ImageCollection("LANDSAT/LC08/C01/T1_8DAY_NDVI");
var timeInterest = ee.List.sequence(2013,2018);

var yearlyNDVICollection =  timeInterest.map(function(i){
  i = ee.Number(i);
  var date = ee.Date.fromYMD(i,7,1);
  return NDVICollection.filterDate(date, date.advance(1,'month'));
});

print(yearlyNDVICollection);

var ndviParams = {min: -1, max: 1, palette: ['blue', 'white', 'green']};

var calcNDVI = function(image){
  var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
}

var NDVILapse = timeLapse.map(calcNDVI);


var checkFallow = function(feature){
  
    var plotNDVI = NDVICollection.filterBounds(feature.geometry());
    plotNDVI = ee.Number(plotNDVI.mean());
    return ee.Algorithms.If(plotNDVI.lt(0.35), feature.set({isFallowed: true}), feature.set({isFallowed: false}))
};

var fallowFeatureColection = ee.FeatureCollection(nonUrban.map(checkFallow));

var colors = {
  
};


function vizCrop(){ //visualizing crops by shading the area with a color
   Map.addLayer(almonds.draw({color: '8B4513', strokeWidth: 2}), {}, 'almonds');
   Map.addLayer(grapes.draw({color: '9400D3', strokeWidth: 2}), {}, 'grapes');
}

function agLand(){ //focusing on 
  Map.addLayer(NDVICollection, ndviParams, "Images from 2017");
  Map.addLayer(fallowFeatureColection,colors, "Crop2014", true, .5);
  //Map.setCenter(-120.98891 , 37.6617049, 10);
  Map.setCenter(-121.51825258634209, 41.99345475520686, 15);
}

//Creates the UI Tables on the left of the map.
var panel = ui.Panel();
panel.style().set('width', '300px');

var intro = ui.Panel([
  ui.Label({
    value: 'NDVI Charts',
    style: {fontSize: '20px', fontWeight: 'bold'}
  }),
  ui.Label('Click a point on the map to inspect.')
]);

panel.add(intro);
var lon = ui.Label();
var lat = ui.Label();
panel.add(ui.Panel([lon, lat], ui.Panel.Layout.flow('horizontal')));

Map.onClick(function(coords) {
  lon.setValue('lon: ' + coords.lon.toFixed(2)),
  lat.setValue('lat: ' + coords.lat.toFixed(2));
  var point = ee.Geometry.Point(coords.lon, coords.lat);

  var ndviChart = ui.Chart.image.series(yearlyNDVICollection.get(0), point, ee.Reducer.mean(), 250);
  ndviChart.setOptions({
    title: 'NDVI 2013',
    vAxis: {title: 'NDVI', maxValue: 1},
    hAxis: {title: 'date', format: 'MM-yy', gridlines: {count: 7}},
  });
  panel.widgets().set(2, ndviChart);
  
  ndviChart = ui.Chart.image.series(yearlyNDVICollection.get(1), point, ee.Reducer.mean(), 250);
  ndviChart.setOptions({
    title: 'NDVI 2014',
    vAxis: {title: 'NDVI', maxValue: 1},
    hAxis: {title: 'date', format: 'MM-yy', gridlines: {count: 7}},
  });
  panel.widgets().set(3, ndviChart);
  ndviChart = ui.Chart.image.series(yearlyNDVICollection.get(2), point, ee.Reducer.mean(), 250);
  ndviChart.setOptions({
    title: 'NDVI 2015',
    vAxis: {title: 'NDVI', maxValue: 1},
    hAxis: {title: 'date', format: 'MM-yy', gridlines: {count: 7}},
  });
  panel.widgets().set(4, ndviChart);
  ndviChart = ui.Chart.image.series(yearlyNDVICollection.get(3), point, ee.Reducer.mean(), 250);
  ndviChart.setOptions({
    title: 'NDVI 2016',
    vAxis: {title: 'NDVI', maxValue: 1},
    hAxis: {title: 'date', format: 'MM-yy', gridlines: {count: 7}},
  });
  panel.widgets().set(5, ndviChart);

    ndviChart = ui.Chart.image.series(yearlyNDVICollection.get(4), point, ee.Reducer.mean(), 250);
  ndviChart.setOptions({
    title: 'NDVI 2017',
    vAxis: {title: 'NDVI', maxValue: 1},
    hAxis: {title: 'date', format: 'MM-yy', gridlines: {count: 7}},
  });
  panel.widgets().set(6, ndviChart);
  
    ndviChart = ui.Chart.image.series(yearlyNDVICollection.get(5), point, ee.Reducer.mean(), 250);
  ndviChart.setOptions({
    title: 'NDVI 2018',
    vAxis: {title: 'NDVI', maxValue: 1},
    hAxis: {title: 'date', format: 'MM-yy', gridlines: {count: 7}},
  });
  panel.widgets().set(7, ndviChart);
});

Map.style().set('cursor', 'crosshair');
ui.root.insert(0, panel);

agLand();

//vizCrop()