        // Copyright: 2015 AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/storyboard/methods/pauseAnimation.js
        this.pauseAnimation = function () {
            if (this._animationTimer !== null) {
                window.clearInterval(this._animationTimer);
                this._animationTimer = null;
            }
        };

