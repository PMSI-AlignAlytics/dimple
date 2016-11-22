    // Copyright: 2015 AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_ease.js
    dimple._ease = function (shape, ease) {
        if (shape && ease) {
            // If interpolation is a string, use the conversion behaviour, otherwise apply it directly
            if (Object.prototype.toString.call(ease) === "[object String]") {
                switch (ease) {
                case 'linear':
                    ease = d3.easeLinear;
                    break;
                case 'poly':
                    ease = d3.easePoly;
                    break;
                case 'quad':
                    ease = d3.easeQuad;
                    break;
                case 'cubic':
                    ease = d3.easeCubic;
                    break;
                case 'sin':
                    ease = d3.easeSin;
                    break;
                case 'exp':
                    ease = d3.easeExp;
                    break;
                case 'circle':
                    ease = d3.easeCircle;
                    break;
                case 'elastic':
                    ease = d3.easeElastic;
                    break;
                case 'back':
                    ease = d3.easeBack;
                    break;
                case 'bounce':
                    ease = d3.easeBounce;
                    break;
                }
                shape.ease(ease);
            }
        }
    };
