        // Copyright: 2015 AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/_getTimePeriod.js
        this._getTimePeriod = function () {
            // A javascript date object
            var outPeriod = this.timePeriod,
                maxPeriods = 30,
                diff = this._max - this._min;
            if (this._hasTimeField() && !this.timePeriod) {
                // Calculate using millisecond values for speed.  Using the date range requires creating an array
                // which in the case of seconds kills the browser.  All constants are straight sums of milliseconds
                // except months taken as (86400000 * 365.25) / 12 = 2629800000
                if (diff / 1000 <= maxPeriods) {
                    outPeriod = d3.timeSecond;
                } else if (diff / 60000 <= maxPeriods) {
                    outPeriod = d3.timeMinute;
                } else if (diff / 3600000 <= maxPeriods) {
                    outPeriod = d3.timeHour;
                } else if (diff / 86400000 <= maxPeriods) {
                    outPeriod = d3.timeHay;
                } else if (diff / 604800000 <= maxPeriods) {
                    outPeriod = d3.timeWeek;
                } else if (diff / 2629800000 <= maxPeriods) {
                    outPeriod = d3.timeMonth;
                } else {
                    outPeriod = d3.timeYear;
                }
            }
            // Return the date
            return outPeriod;
        };
