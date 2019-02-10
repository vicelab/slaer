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

function getNDVI(plot){
  
  var pixel = ee.List(plot.get(100));
  
  return 0;
}

var checkFallow = function(feature){
    //Need to fix this to be able to grab the correct geomotries
    var cords = feature.geometry();
    var plotGeo = ee.List(NDVILapse.getRegion(cords,21));
    var plotNDVI = ee.Number(getNDVI(plotGeo));
    
    if(plotNDVI.lt(0.3) == 1){
      console.log("True");
      return feature.set({isFallowed: true});
    }
    else{
      console.log("False");
      return feature.set({isFallowed: false});
    }
};

var fallowFeatureColection = nonUrban.map(checkFallow);

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