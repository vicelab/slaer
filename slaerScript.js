//Imported Data Via Google Earth Engine

var fc = ee.FeatureCollection(table).select("Crop2014")

//Removes the urban + idle land from the map and dataset
var nonUrban = fc.filter(ee.Filter.neq("Crop2014", "Urban"))
var agOnly = nonUrban.filter(ee.Filter.neq("Crop2014", "Idle"))
var almonds = fc.filter(ee.Filter.eq("Crop2014", "Almonds"))  
var grapes = fc.filter(ee.Filter.eq("Crop2014", "Grapes"))

var colors = [
];

function vizCrop(){ //visualizing crops 
   Map.addLayer(almonds.draw({color: '8B4513', strokeWidth: 2}), {}, 'almonds')
   Map.addLayer(grapes.draw({color: '9400D3', strokeWidth: 2}), {}, 'grapes')
}
function agLand(){ //focusing on 
  Map.addLayer(agOnly, {palette: colors})
  Map.setCenter(-120.98891 , 37.6617049, 10)
}

agLand()
vizCrop()