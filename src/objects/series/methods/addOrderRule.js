        // Copyright: 2015 AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/series/methods/addOrderRule.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-addOrderRule
        this.addOrderRule = function (ordering, desc) {
            this._orderRules.push({ ordering : ordering, desc : desc });
        };