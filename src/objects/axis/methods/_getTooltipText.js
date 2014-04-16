        // Copyright: 2014 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/getTooltipText.js
        this._getTooltipText = function (rows, d) {
            if (this._hasTimeField()) {
                if (d[this.position + "Field"][0]) {
                    rows.push(this.timeField + ": " + this._getFormat()(d[this.position + "Field"][0]));
                }
            } else if (this._hasCategories()) {
                // Add the x axis categories
                this.categoryFields.forEach(function (c, i) {
                    if (c !== null && c !== undefined && d[this.position + "Field"][i]) {
                        // If the category name and value match don't display the category name
                        rows.push(c + (d[this.position + "Field"][i] !== c ? ": " + d[this.position + "Field"][i] : ""));
                    }
                }, this);
            } else if (this._hasMeasure()) {
                rows.push(this.measure + ": " + this._getFormat()(d[this.position] || d[this.position + "Value"]));
            }
        };