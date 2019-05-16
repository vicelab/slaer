# Classification of Fallowed Land 
Below are the steps necessary to take in order to reproduce results from running Supervised Classification on **Landsat 8 Collection 1 Tier 1 8-Day NDVI Composite** and visualizing results within Google Earth Engine (GEE). A **CART model** is used to make predictions but models such as **SVM** or **RandomForest** are also applicable and can be easily integrated. Training data is collected from pixel geometries of fallowed land reported from Kern County.  
  
# Google Earth Engine
An [account](https://signup.earthengine.google.com/) is needed to view and use Google Earth Engine.

Full script can be seen [here](https://code.earthengine.google.com/27dac6ced898aec8d7ce237c1beac91b).

# Importing Data
We will begin with importing data as a table within GEE via the Assets tab:

LandIQ from 2014: [Link to Dataset](https://catalog.data.gov/dataset/land-use-2014-land-iq-ds2677)

Kern County Idle Land from 2014: [Link to Dataset](http://www.kernag.com/gis/gis-data.asp)

Follow instructions on importing here: [Importing Table Data](https://developers.google.com/earth-engine/importing)

#### Global Imports
~~~~javascript
var all_fallow: Table users/denisvashchenko/Kern_AllIdle //Fallowed Kern County Data
var iq: Table users/dantran2016/atlas_i15_CropMapping2014 //LandIQ Data
~~~~

You should have both the KernIdle and LandIQ datasets imported to begin. 

# Defining Parameters / Filtering
~~~~javascript
//Bands used for classification (NDVI)
var bands = ['NDVI'];
//Filter Land IQ
var nonUrban = iq.filter(ee.Filter.neq("Crop2014", "Urban")); //removing Urban land
var filtered = nonUrban.filter(ee.Filter.eq("County", "Kern")); //isolating Kern County
~~~~
We will be using the NDVI band in order to classify fallowed land and as such we should define this as our variable for use throughout the script.

Additionally, we will be looking at the Kern County area due to the size of the entire dataset being too large for the model to run at one time. Therefore we want to apply 2 seperate filters, the first one removing Urban land and the second only focusing on Feature Collections of Kern County. 

~~~~javascript
//Filter Training Input
var landSat = ee.Image(ee.ImageCollection('LANDSAT/LC08/C01/T1_8DAY_NDVI')
  .filterDate('2014-5-01', '2014-5-10') //filtering by date
  .select(bands) //selecting NDVI band
  .sort('CLOUD_COVER') //removing cloudy images
  .first()); //getting first image of collection

//Filter to Classify on LandIQ
var landSatTest = ee.Image(ee.ImageCollection('LANDSAT/LC08/C01/T1_8DAY_NDVI')
  .filterBounds(filtered.geometry()) //filtering by Kern County area
  .filterDate('2014-5-01', '2014-5-10') 
  .select(bands) 
  .sort('CLOUD_COVER') 
  .first()); 
~~~~
We are using the **Landsat 8 Collection 1 Tier 1 8-Day NDVI Composite** as our satellite in order to collect training data and classify regions. We will define **landSat** as our satellite to collect training data and **landSatTest** as our region to classify.

# Collecting Training Data 
![toolset](https://i.imgur.com/8cV5wuh.png)

Training data is collected using the toolset and drawing rectangles over areas of interest.

![not_fallowed](https://i.imgur.com/sE3hAlC.png) ![fallowed](https://i.imgur.com/N2fxDgX.png)

We will be setting up 2 different classes of geometries: fallowed
not_fallowed and as such they should be configured as shown
above. 
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
We will then load our features into one parameter for our model to operate on. 

# Model Training & Classification
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

The CART model will then train on the passed data points and then classify our predefined region. 

# Visualizing Results

~~~~javascript
//70FF00 (green) not fallowed, FF2D000 (red) fallowed
Map.addLayer(classified, {min: 0, max: 1, palette: ['70FF00', 'FF2D00']}, 
'classification');
~~~~
Adding the classified layer to the map will yield this image of Kern County. 

![image](https://i.imgur.com/ZS94aoh.png)  

The regions that are Green are land that is not fallowed and the regions which are Red represent fallowed land in 2014. 





