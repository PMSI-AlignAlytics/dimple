// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/storyboard/begin.js
dimple.storyboard = function (chart, categoryFields) {
    
// Handle an individual string as an array
if (categoryFields != null && categoryFields != undefined) { categoryFields = [].concat(categoryFields); }
 
// The parent chart
this.chart = chart
// The category fields for category type axes
this.categoryFields = categoryFields;
// Indicates that the animation should start when the chart draws
this.autoplay = true;
// The animation length;
this.frameDuration = 3000;
// The storyboard label object
this.storyLabel = null;
// Method associated with the animation tick
this.onTick = null;

// The current frame index
this._frame = 0;
// The animation interval
this._animationTimer = null;
// The category values
this._categories = [];
// The category values when the last cache happened
this._cachedCategoryFields = [];