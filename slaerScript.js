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

function getNDVI(plot){
  var NIR, R, G, rTotal, gTotal, nirTotal;
  //Work on a better method to grab more pixels for a better average
  var pixel = ee.List(plot.get(100));
  
  NIR = ee.Number(pixel.get(4));
  R = ee.Number(pixel.get(5));
  
  return NIR.subtract(R).divide(NIR.add(R));
}


var checkFallow = function(feature){
    //Need to fix this to be able to grab the correct geomotries
    var cords = nonUrban.first().geometry();
    
    var plot = ee.List(timeLapse.getRegion(cords,21));
    var NDVI = getNDVI(plot);
    print(NDVI);
    if(NDVI.lt(0.4)){
      return feature.set({isFallowed: true});
    }
    else{
      return feature.set({isFallowed: false});
    }
};

var fallowFeatureColection = nonUrban.map(checkFallow);
print(fallowFeatureColection.first());
var colors = {
  
};


function vizCrop(){ //visualizing crops by shading the area with a color
   Map.addLayer(almonds.draw({color: '8B4513', strokeWidth: 2}), {}, 'almonds');
   Map.addLayer(grapes.draw({color: '9400D3', strokeWidth: 2}), {}, 'grapes');
}

function agLand(){ //focusing on 
  Map.addLayer(timeLapse, trueColors, "Images from 2017");
  Map.addLayer(fallowFeatureColection,colors, "Crop2014", true, .5);
  //Map.setCenter(-120.98891 , 37.6617049, 10);
  Map.setCenter(-121.51825258634209, 41.99345475520686, 15);
}


var roi = (-120.44082212108907, 37.31763621977258); //region of interest currently over Merced
var trainingSet = ee.ImageCollection('LANDSAT/LC08/C01/T1_RT')
                  .filterDate('2018-7-01', '2018-7-10');


agLand();

//vizCrop()