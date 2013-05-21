// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/chart/methods/_axisIndex.js
// Return the ordinal value of the passed axis.  If an orientation is passed, return the order for the 
// specific orientation, otherwise return the order from all axes.  Returns -1 if the passed axis isn't part of the collection
this._axisIndex = function (axis, orientation) {
    var i = 0;
    var axisCount = 0;
    for (i = 0; i < this.axes.length; i++) {
        if (this.axes[i] == axis) {
            return axisCount;
        }
        if (orientation == null || orientation == undefined || orientation[0] == this.axes[i].position[0]) {
            axisCount++;
        }
    }
    return -1;
};

