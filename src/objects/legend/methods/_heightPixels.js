        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/_xPixels.js
        // Access the pixel value of the height of the plot area
        this._heightPixels = function () {
            return dimple._parsePosition(this.height, this.svg.node().offsetHeight);
        };
