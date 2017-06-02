        // Copyright: 2015 AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/setMargins.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-setMargins
        this.setMargins = function (left, top, right, bottom) {
            // Set the bounds here, functions below will be used for access
            this.x = left;
            this.y = top;
            this.width = 0;
            this.height = 0;
            // Access the pixel value of the x coordinate
            this._xPixels = function () {
                return this._parseXPosition(this.x);
            };
            // Access the pixel value of the y coordinate
            this._yPixels = function () {
                return this._parseYPosition(this.y);
            };
            // Access the pixel value of the width coordinate
            this._widthPixels = function () {
                return this._parentWidth() - this._xPixels() - this._parseXPosition(right);
            };
            // Access the pixel value of the width coordinate
            this._heightPixels = function () {
                return this._parentHeight() - this._yPixels() - this._parseYPosition(bottom);
            };
            // return the chart object for method chaining
            return this;
        };

