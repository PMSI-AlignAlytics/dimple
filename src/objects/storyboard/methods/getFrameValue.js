// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/storyboard/methods/getFrameValue.js
this.getFrameValue = function () {
    if (this._frame >= 0 && this._getCategories().length > this._frame) {
        return this._getCategories()[this._frame];
    }
    else {
        return null;
    }
};

