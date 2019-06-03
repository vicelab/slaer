# Strategic Landuse for Agriculture and Ecosystem Recovery (SLAER)

An investigation into fallowing of land in California's Central Valley utilizing Google Earth Engine (GEE) and Matplotlib.

SLAER tackles this problem from two distinct angles: an "iterative" approach and a "machine learning" approach.

## The Iterative Approach

### Data Collection

Scraping of data from Landsat, Sentinel, etc. is done in GEE with the slaerExport.js script.

#### Parameters (slaerExport.js)
> + Years: 1999 - 2019 Landsat 7
> + 2013 - 2019 Landsat 8
> + Months: Jan - December
> + NDVI (30-meter resolution)

### Data Parsing && Visualization

Parsing and Visualization of raw mean-average per-plot NVDI values is done with Matplotlib in Python. 

#### Parameters (histogram.py, ...)
> + Plot types (histograms, line graphs, box charts)
> + Various styling/formatting options

### Future Improvements
> + Using both Landsat 7/8 and Sentinel 2 to provide more data points
> + Separating plots based on the reported planted crop. Classify each plot separately  based on the plot crops' planting cycle (e.g, winter, summer, or perennial).

## The Machine Learning Approach

Estimation of fallowed land with Classification and Regression Trees via GEE.

### Data Collection

Sampling geometries from Landsat, importing reported Idle land from Kern County for training data. 

### Data Parsing && Visualization

Data is visualized within GEE by assigning contrasting colors to respective classes and adding the classification to the map.

## Future Improvements

> + Running classification on the Sentinel 2 satellite to compare Landsat results. 
> + Exporting model classification results per individual feature and plotting results for visualization.
