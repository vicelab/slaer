# Strategic Landuse for Agriculture and Ecosystem Recovery (SLAER)

An investigation into fallowing of land in California's Central Valley utilizing Google Earth Engine (GEE) and Matplotlib.

SLAER tackles this problem from two distinct angles: an "iterative" approach and a "machine learning" approach.

# The Iterative Approach

## Data Collection

Scraping of data from Landsat, Sentinel, etc. is done in GEE with the slaerExport.js script. 

### Parameters (slaerExport.js)
> + Year Range
> + Months
> + Spectral Index (NDVI, NDWI, etc)

## Data Parsing && Visualization

Parsing and Visualization of raw mean-average per-plot NVDI values is done with Matplotlib in Python. 

### Parameters (histogram.py, ...)
> + Plot types (histograms, line graphs, box charts)
> + Various styling/formatting options

# The Machine Learning Approach

Estimation of Fallowed Land with Classification and Regression Trees via Google Earth Engine.

## Data Collection

Sampling geometries from Landsat, importing reported Idle land from Kern County for training data. 

## Data Parsing && Visualization


