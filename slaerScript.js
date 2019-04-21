//Dataset of satellite images from 2013 till real time.
//Will use times around harvests to ensure the crops get to grow and show color
var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_RT')
                  .filterDate('2018-7-01', '2018-7-10');
//Selects the color bans NIR - Red - Green
var timeLapse = dataset.select(['B5', 'B4', 'B3']);
//Removes the urban + idle land from the map and dataset
var nonUrban = table.filter(ee.Filter.neq("Crop2014", "Urban"));

//Landsat with just NDVI band
var NDVICollection =  ee.ImageCollection("LANDSAT/LE07/C01/T1_8DAY_NDVI");
var timeInterest = ee.List.sequence(1999,2018);
var tempDatset = NDVICollection.filterDate('2018-7-01', '2018-7-10');

var yearlyNDVICollection =  timeInterest.map(function(i){
  i = ee.Number(i);
  var date = ee.Date.fromYMD(i,7,1);
  return NDVICollection.filterDate(date, date.advance(1,'month'));
});

//0  = 2013 1 = 2014... (year = 2013 + value)
var year = 0;

var ndviParams = {min: -1, max: 1, palette: ['blue', 'white', 'green']};

var calcNDVI = function(image){
  var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
}

var fallowedArray = [];


var NDVILapse = timeLapse.map(calcNDVI);


var checkFallow = function(feature){
    var convertYearly = ee.ImageCollection(yearlyNDVICollection.get(year));
    var plotNDVI = convertYearly.filterBounds(feature.geometry());
    plotNDVI = plotNDVI.mean();
    var meanDict = plotNDVI.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: feature.geometry(),
      scale: 1
    });
    plotNDVI = ee.Number(meanDict.get("NDVI"));
      
    return ee.Algorithms.If(plotNDVI.lt(0.36), feature.set({isFallowed: true}), feature.set({isFallowed: false}))
};

var fallowFeatureColection99 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 1;
var fallowFeatureColection00 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 2;
var fallowFeatureColection01 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 3;
var fallowFeatureColection02 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 4;
var fallowFeatureColection03 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 5;
var fallowFeatureColection04 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 6
var fallowFeatureColection05 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 7;
var fallowFeatureColection06 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 8;
var fallowFeatureColection07 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 9;
var fallowFeatureColection08 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 10;
var fallowFeatureColection09 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 11;
var fallowFeatureColection10 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 12;
var fallowFeatureColection11 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 13;
var fallowFeatureColection12 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 14;
var fallowFeatureColection13 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 15;
var fallowFeatureColection14 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 16;
var fallowFeatureColection15 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 17;
var fallowFeatureColection16 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 18;
var fallowFeatureColection17 = ee.FeatureCollection(nonUrban.map(checkFallow));
year = 19;
var fallowFeatureColection18 = ee.FeatureCollection(nonUrban.map(checkFallow));

function populateFallowedArray(point){
  var featureTest = fallowFeatureColection99.filterBounds(point).first();
  var value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
  featureTest = fallowFeatureColection00.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
  featureTest = fallowFeatureColection01.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
  featureTest = fallowFeatureColection02.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
  featureTest = fallowFeatureColection03.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
  featureTest = fallowFeatureColection04.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
  featureTest = fallowFeatureColection05.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
  featureTest = fallowFeatureColection06.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
  featureTest = fallowFeatureColection07.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
    featureTest = fallowFeatureColection08.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
    featureTest = fallowFeatureColection09.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
    featureTest = fallowFeatureColection10.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
    featureTest = fallowFeatureColection11.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
    featureTest = fallowFeatureColection12.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
    featureTest = fallowFeatureColection13.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
    featureTest = fallowFeatureColection14.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
    featureTest = fallowFeatureColection15.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
      featureTest = fallowFeatureColection16.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
      featureTest = fallowFeatureColection17.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
      featureTest = fallowFeatureColection18.filterBounds(point).first();
  value = featureTest.get("isFallowed");
  fallowedArray.push(value);
  
  fallowedArray = ee.List(fallowedArray);
}

var colors = {
  
};


function vizCrop(){ //visualizing crops by shading the area with a color
   Map.addLayer(almonds.draw({color: '8B4513', strokeWidth: 2}), {}, 'almonds');
   Map.addLayer(grapes.draw({color: '9400D3', strokeWidth: 2}), {}, 'grapes');
}

function agLand(){ //focusing on 
  Map.addLayer(ee.ImageCollection(yearlyNDVICollection.get(year)), ndviParams, "Images from 2017");
  Map.addLayer(fallowFeatureColection07,colors, "Crop2014", true, .5);
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

  fallowedArray = [];
  populateFallowedArray(point);
  
  var fallowedChart = ui.Chart.array.values(fallowedArray, 0);
  fallowedChart.setOptions({
    title: 'Fallowed Time Series',
    vAxis: {title: 'isFallowed', maxValue: 1},
    hAxis: {title: 'year', gridlines: {count: 7}},
  });
  panel.widgets().set(1, fallowedChart);
});

Map.style().set('cursor', 'crosshair');
ui.root.insert(0, panel);

agLand();

//vizCrop()