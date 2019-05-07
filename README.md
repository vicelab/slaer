# Strategic Landuse for Agriculture and Ecosystem Recovery (SLAER)

An investigation into fallowing of land in California's Central Valley utilizing Google Earth Engine (GEE) and Matplotlib.

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