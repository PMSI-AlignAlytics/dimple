        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/_getFormat.js
        this._getFormat = function () {
            var returnFormat,
                max,
                min,
                len,
                chunks,
                suffix,
                dp;
            if (this.showPercent) {
                returnFormat = d3.format("%");
            } else if (this.measure !== null) {
                max = Math.floor(Math.abs(this._max), 0).toString();
                min = Math.floor(Math.abs(this._min), 0).toString();
                len = Math.max(min.length, max.length);
                if (len > 3) {
                    chunks = Math.min(Math.floor((len - 1) / 3), 4);
                    suffix = "kmBT".substring(chunks - 1, chunks);
                    dp = (len - chunks * 3 <= 2 ? 1 : 0);
                    returnFormat = function (n) {
                        return (n === 0 ? 0 : d3.format(",." + dp + "f")(n / Math.pow(1000, chunks)) + suffix);
                    };
                } else {
                    dp = (len <= 2 ? 1 : 0);
                    returnFormat = d3.format(",." + dp + "f");
                }
            } else {
                returnFormat = function (n) { return n; };
            }
            return returnFormat;
        };

