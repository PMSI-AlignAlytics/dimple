    // Copyright: 2015 AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_interpolate.js
    dimple._interpolate = function (point, interpolation) {
        if (point && interpolation) {
            // If interpolation is a string, use the conversion behaviour, otherwise apply it directly
            if (Object.prototype.toString.call(interpolation) === "[object String]") {
                switch (interpolation) {
                case 'linear':
                    interpolation = d3.curveLinear;
                    break;
                case 'linear-closed':
                    interpolation = d3.curveLinearClosed;
                    break;
                case 'step':
                    interpolation = d3.curveStep;
                    break;
                case 'step-before':
                    interpolation = d3.curveStepBefore;
                    break;
                case 'step-after':
                    interpolation = d3.curveStepAfter;
                    break;
                case 'basis':
                    interpolation = d3.curveBasis;
                    break;
                case 'basis-open':
                    interpolation = d3.curveBasisOpen;
                    break;
                case 'basis-closed':
                    interpolation = d3.curveBasisClosed;
                    break;
                case 'bundle':
                    interpolation = d3.curveBundle;
                    break;
                case 'cardinal':
                    interpolation = d3.curveCardinal;
                    break;
                case 'cardinal-open':
                    interpolation = d3.curveCardinalOpen;
                    break;
                case 'cardinal-closed':
                    interpolation = d3.curveCardinalClosed;
                    break;
                case 'monotone':
                    interpolation = d3.curveMonotoneX;
                    break;
                }
            }
            point.curve(interpolation);
        }
    };
