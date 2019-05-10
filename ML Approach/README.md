# Supervised Classification 
Below are the steps necessary to take in order to reproduce results from running Supervised Classification on **Landsat 8 Collection 1 Tier 1 8-Day NDVI Composite** within Google Earth Engine (GEE). A **CART model** is used to make predictions based on on training data collected from pixel geometries of fallowed land reported from Kern County.  
# Importing Data
We will begin with importing data within GEE via the Assets tab:

#### Global Imports
~~~~javascript
var all_fallow: Table users/denisvashchenko/Kern_AllIdle //Fallowed Kern County Data
var iq: Table users/dantran2016/atlas_i15_CropMapping2014 //LandIQ Data
~~~~

# Defining Parameters / Filtering
~~~~javascript
//Bands used for classification (NDVI)
var bands = ['NDVI'];
//Filter Land IQ
var nonUrban = iq.filter(ee.Filter.neq("Crop2014", "Urban"));
var filtered = nonUrban.filter(ee.Filter.eq("County", "Kern"));
~~~~
We will be using the NDVI band in order to classify fallowed land and as such we should define this as our variable for use throughout the script.

Additionally, we will be looking at the Kern County area due to the size of the entire dataset being too large for the model to run at one time. Therefore we want to apply 2 seperate filters, the first one removing Urban land and the second only focusing on Feature Collections of Kern County. 

~~~~javascript
//Filter Training Input
var landSat = ee.Image(ee.ImageCollection('LANDSAT/LC08/C01/T1_8DAY_NDVI')
  .filterDate('2014-5-01', '2014-5-10')
  .select(bands)
  .sort('CLOUD_COVER')
  .first());

//Filter to Classify on LandIQ
var landSatTest = ee.Image(ee.ImageCollection('LANDSAT/LC08/C01/T1_8DAY_NDVI')
  .filterBounds(filtered.geometry())
  .filterDate('2014-5-01', '2014-5-10')
  .select(bands)
  .sort('CLOUD_COVER')
  .first());
~~~~
We are using the **Landsat 8 Collection 1 Tier 1 8-Day NDVI Composite** as our satelite in order to collect training data and classify regions. 

# Collecting Training Data

//add some gifs 

~~~~javascript
//Merging imports of sample regions into one feature collection
var trainingFC = not_fallowed.merge(fallowed);
~~~~
After collecting our training data we want to merge the pixel geometries into one FeatureCollection

~~~~javascript
//Training data
var training = landSat.select(bands).sampleRegions({
  collection: trainingFC,
  properties: ['landcover'],
  scale: 30
});
~~~~


# Model Training
~~~~javascript
//CART Classifier Training
var trainedClassifier = ee.Classifier.cart().train({
  features: training,
  classProperty: 'landcover', 
  inputProperties: bands
});

//Run classification 
var classified = landSatTest.select(bands).classify(trainedClassifier);
~~~~

# Model Validation 

# Results

