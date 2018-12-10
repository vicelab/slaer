//Imported Data Via Google Earth Engine

var fc = ee.FeatureCollection(table).select("Crop2014")

//Removes the urban enviroments from the map and dataset
var wantedLand = fc.filter(ee.Filter.neq("Crop2014", "Urban"))

var colors = [
  //Add colors for different types of crops
];

Map.addLayer(wantedLand, {palette: colors})
Map.setCenter(-120.98891 , 37.6617049, 7)