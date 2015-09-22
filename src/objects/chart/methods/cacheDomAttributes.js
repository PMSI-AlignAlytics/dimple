        // Copyright: 2015 AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/cacheDomAttributes.js
        this.cacheDomAttributes = function () {
            this._domCache.height = dimple._parentHeight(this.svg.node());
            this._domCache.width = dimple._parentWidth(this.svg.node());
        };
