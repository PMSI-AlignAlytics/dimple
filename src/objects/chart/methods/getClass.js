        // Copyright: 2015 AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/getClass.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-getClass
        this.getClass = function (tag) {
            // If no class is assigned, do so here
            if (!this._assignedClasses[tag]) {
                this._assignedClasses[tag] = this.customClassList.colorClasses[this._nextClass];
                this._nextClass = (this._nextClass + 1) % this.customClassList.colorClasses.length;
            }
            // Return the class
            return this._assignedClasses[tag];
        };

