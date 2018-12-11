//Imported Data Via Google Earth Engine

var fc = ee.FeatureCollection(table).select("Crop2014")

//Removes the urban enviroments from the map and dataset
var nonUrban = fc.filter(ee.Filter.neq("Crop2014", "Urban"))
var almonds = fc.filter(ee.Filter.eq("Crop2014", "Almonds"))


var colors = [];

Map.addLayer(nonUrban, {palette: colors})
Map.addLayer(almonds.draw({color: '8B4513', strokeWidth: 2}), {}, 'drawn')
Map.setCenter(-120.98891 , 37.6617049, 12)