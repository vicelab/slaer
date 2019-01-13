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

// var fallowedLand = ee.FeatureCollection(ee.List(nonUrban.iterate(checkFallowed)));

var colors = {
  
};


function vizCrop(){ //visualizing crops by shading the area with a color
   Map.addLayer(almonds.draw({color: '8B4513', strokeWidth: 2}), {}, 'almonds');
   Map.addLayer(grapes.draw({color: '9400D3', strokeWidth: 2}), {}, 'grapes');
}
function agLand(){ //focusing on 
  Map.addLayer(timeLapse, trueColors, "Images from 2017");
  Map.addLayer(table,colors, "Crop2014", true, 0.5);
  Map.setCenter(-120.98891 , 37.6617049, 10);
}

//featureCollection.map() possibly the move apply a func to every feature 

// var getCoords = function(feature){
//     // print(fc.filterMetadata("features:geometry:coordinates", '0')).limit(1));
// };

// var checkFallowed(feature){
//   //if(feature.red < feature.blue && feature.red < feature.green){
//   //  feature.fallowed = false;
//   //}
//   //  feature.fallowed = true;
//   return true;
//   }
// }

// var areaAdded = fc.map(checkFallowed);

// var coordinates = fc.features[y].geometry.coordinates;

var coord = ee.Feature(fc).geometry().coordinates(); 

// print(fc.filterMetadata("features:geometry:coordinates", 'equals', '0').limit(1));

print(test)

// print(fc.filter(ee.Filter.eq("geometry:coordinates", '0')).limit(1));

// print('Feature coords: ', getCoords.first());

agLand();
//vizCrop()
