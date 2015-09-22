        // Copyright: 2015 AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/_parentWidth.js
        this._parentWidth = function () {
            return this._domCache.width || dimple._parentWidth(this.svg.node());
        };
