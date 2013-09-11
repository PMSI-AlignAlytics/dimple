        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/_xPixels.js
        // Access the pixel value of the width of the plot area
        this._widthPixels = function () {
            return dimple._parsePosition(this.width, this.svg.node().offsetWidth);
        };