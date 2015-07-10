        // Copyright: 2015 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/legend/methods/_getVerticalPadding.js
        this._getVerticalPadding = function () {
            var verticalPadding;
            if (isNaN(this.verticalPadding)) {
                verticalPadding = 2;
            } else {
                verticalPadding = this.verticalPadding;
            }
            return verticalPadding;
        };
