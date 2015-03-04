        // Copyright: 2015 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/legend/methods/_getHorizontalPadding.js
        this._getHorizontalPadding = function () {
            var horizontalPadding;
            if (isNaN(this.horizontalPadding)) {
                horizontalPadding = 20;
            } else {
                horizontalPadding = this.horizontalPadding;
            }
            return horizontalPadding;
        };
