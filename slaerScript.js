//Imported Data Via Google Earth Engine
//Dataset of satellite images from 2013 till real time.
//Will use times around harvests to ensure the crops get to grow and show color
var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_RT')
                  .filterDate('2018-7-01', '2018-7-10');

//Selects the color bans NIR - Red - Green
var timeLapse = dataset.select(['B5', 'B4', 'B3']);

var trueColors = {
  min: 4000,
  
  max: 12000,
};

//Removes the urban + idle land from the map and dataset
var nonUrban = table.filter(ee.Filter.neq("Crop2014", "Urban"));

var calcNDVI = function(image){
  var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
}

var NDVILapse = timeLapse.map(calcNDVI);

function createNDVIList(list){
  var returnList = ee.List([]);
  for(var i = 0; i < 100; i++){
    returnList.add(ee.List(list.get(i)).get(7));
  }
  return returnList;
}

function getNDVI(plot){
  var meanNDVI = ee.Number(0);
  var NDVIList = createNDVIList(plot);
  meanNDVI = NDVIList.reduce(ee.Reducer.mean());
  return ee.Number(meanNDVI);
}

function getTempNDVI(plot){
  var sampleList = ee.Number(ee.List(plot.get(100)).get(7));
  sampleList = sampleList.add(ee.Number(ee.List(plot.get(150)).get(7)));
  sampleList = sampleList.add(ee.Number(ee.List(plot.get(200)).get(7)));
  sampleList = sampleList.add(ee.Number(ee.List(plot.get(250)).get(7)));
  sampleList = sampleList.add(ee.Number(ee.List(plot.get(300)).get(7)));
  sampleList = sampleList.add(ee.Number(ee.List(plot.get(350)).get(7)));
  sampleList = sampleList.add(ee.Number(ee.List(plot.get(400)).get(7)));
  sampleList = sampleList.add(ee.Number(ee.List(plot.get(450)).get(7)));
  sampleList = sampleList.divide(8);
  return sampleList;
}


var checkFallow = function(feature){
    //Need to fix this to be able to grab the correct geomotries
    var cords = ee.List(feature.geometry());
    var plotGeo = ee.List(NDVILapse.getRegion(cords,21));
    var plotNDVI = ee.Number(getTempNDVI(plotGeo));
    return ee.Algorithms.If(plotNDVI.lt(0.35), feature.set({isFallowed: true}), feature.set({isFallowed: false}))
};

var fallowFeatureColection = ee.FeatureCollection(nonUrban.map(checkFallow));

print (nonUrban.first());
var colors = {
  
};


function vizCrop(){ //visualizing crops by shading the area with a color
   Map.addLayer(almonds.draw({color: '8B4513', strokeWidth: 2}), {}, 'almonds');
   Map.addLayer(grapes.draw({color: '9400D3', strokeWidth: 2}), {}, 'grapes');
}

function agLand(){ //focusing on 
  Map.addLayer(NDVILapse, trueColors, "Images from 2017");
  Map.addLayer(fallowFeatureColection,colors, "Crop2014", true, .5);
  //Map.setCenter(-120.98891 , 37.6617049, 10);
  Map.setCenter(-121.51825258634209, 41.99345475520686, 15);
}


var roi = (-120.44082212108907, 37.31763621977258); //region of interest currently over Merced
var trainingSet = ee.ImageCollection('LAN DSAT/LC08/C01/T1_RT')
                  .filterDate('2018-7-01', '2018-7-10');


agLand();

//vizCrop()