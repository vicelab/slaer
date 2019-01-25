//Imported Data Via Google Earth Engine
//Dataset of satellite images from 2013 till real time.
//Will use times around harvests to ensure the crops get to grow and show color
var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_RT')
                  .filterDate('2018-7-01', '2018-7-10');

//Selects the color bans RGB
var timeLapse = dataset.select(['B4', 'B3', 'B2']);

var trueColors = {
  min: 4000,
  
  max: 12000,
};


//Data from the Crop2014
var fc = ee.FeatureCollection(table).select("Crop2014");

//Removes the urban + idle land from the map and dataset
var nonUrban = fc.filter(ee.Filter.neq("Crop2014", "Urban"));

function getRGB(plot){
  var R, G, B, rTotal, gTotal, bTotal;
  
  rTotal = ee.Number(0);
  gTotal = ee.Number(0);
  bTotal = ee.Number(0);
  
  for(var i = 1; i < 4; i++){
    var pixel = ee.List(plot.get(i));
    R = ee.Number(pixel.get(4));
    G = ee.Number(pixel.get(5));
    B = ee.Number(pixel.get(6));
    
    rTotal.add(R);
    gTotal.add(G);
    bTotal.add(B);
  
    print(R);
    print(rTotal);
  }
    
  var rgbVals = [rTotal, gTotal, bTotal];
  
  return rgbVals;
}


var fallowedLand = nonUrban.map(function(feature){
    var cords = nonUrban.first().geometry();
    var plot = ee.List(timeLapse.getRegion(cords,20));
    var rgbVals = getRGB(plot);
    
    if(rgbVals[0] < rgbVals[1] && rgbVals[0] < rgbVals[2]){
      return feature.set({isFallowed: true});
    }
      return feature.set({isFallowed: false});
  
});


var colors = {
  
};


function vizCrop(){ //visualizing crops by shading the area with a color
   Map.addLayer(almonds.draw({color: '8B4513', strokeWidth: 2}), {}, 'almonds');
   Map.addLayer(grapes.draw({color: '9400D3', strokeWidth: 2}), {}, 'grapes');
}

function agLand(){ //focusing on 
  Map.addLayer(timeLapse, trueColors, "Images from 2017");
  Map.addLayer(table,colors, "Crop2014", true, .5);
  //Map.setCenter(-120.98891 , 37.6617049, 10);
  Map.setCenter(-121.51825258634209, 41.99345475520686, 15);
}


var roi = (-120.44082212108907, 37.31763621977258); //region of interest currently over Merced
var trainingSet = ee.ImageCollection('LANDSAT/LC08/C01/T1_RT')
                  .filterDate('2018-7-01', '2018-7-10');


agLand();

//vizCrop()