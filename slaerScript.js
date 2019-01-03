//Imported Data Via Google Earth Engine
//Dataset of satellite images from 2013 till real time.
var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_RT')
                  .filterDate('2018-12-01', '2018-12-10');

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
//We wouldn't want to go solely on their things because the data is from 2014
var agOnly = nonUrban.filter(ee.Filter.neq("Crop2014", "Idle"));
var almonds = fc.filter(ee.Filter.eq("Crop2014", "Almonds"));  
var grapes = fc.filter(ee.Filter.eq("Crop2014", "Grapes"));

var colors = {
  
};


function vizCrop(){ //visualizing crops by shading the area with a color
   Map.addLayer(almonds.draw({color: '8B4513', strokeWidth: 2}), {}, 'almonds');
   Map.addLayer(grapes.draw({color: '9400D3', strokeWidth: 2}), {}, 'grapes');
}
function agLand(){ //focusing on 
  Map.addLayer(timeLapse, trueColors, "Images from 2017");
  Map.addLayer(nonUrban,colors, "Crop2014", true, .5);
  Map.setCenter(-120.98891 , 37.6617049, 10);
}

function checkFallowed(landObject){
  //Take in the chordiantes given via the landObjects and create a polygon of the area.
  //1: We could average the color of the land to see if it's fallowed
  //2: Use a ML model
  return 1;
}

var fallowedLand;

nonUrban.iterate(checkFallowed);

agLand();
//vizCrop()
