    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/axis/begin.js
    // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis
    dimple.axis = function (chart, position, categoryFields, measure) {

        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-chart
        this.chart = chart;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-position
        this.position = position;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-categoryFields
        this.categoryFields = categoryFields;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-measure
        this.measure = measure;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-hidden
        this.hidden = false;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-showPercent
        this.showPercent = false;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-colors
        this.colors = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-overrideMin
        this.overrideMin = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-overrideMax
        this.overrideMax = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-shapes
        this.shapes = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-showGridlines
        this.showGridlines = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-gridlineShapes
        this.gridlineShapes = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-titleShape
        this.titleShape = null;

        // The scale determined by the update method
        this._scale = null;
        // The minimum and maximum axis values
        this._min = 0;
        this._max = 0;
        // Chart origin before and after an update.  This helps
        // with transitions
        this._previousOrigin = null;
        this._origin = null;
        // The order definition array
        this._orderDefinitions = [];

