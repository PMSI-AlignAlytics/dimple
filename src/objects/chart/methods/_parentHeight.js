        // Copyright: 2015 AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/_parentHeight.js
        this._parentHeight = function () {
            return this._domCache.height || dimple._parentHeight(this.svg.node());
        };
