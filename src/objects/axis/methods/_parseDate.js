        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/_parseDate.js
        this._parseDate = function (inDate) {
            // A javascript date object
            var outDate;
            if (this.dateParseFormat === null || this.dateParseFormat === undefined) {
                // If nothing has been explicity defined you are in the hands of the browser gods
                // may they smile upon you...
                outDate = Date.parse(inDate);
            } else {
                outDate = d3.time.format(this.dateParseFormat).parse(inDate);
            }
            // Return the date
            return outDate;
        };

