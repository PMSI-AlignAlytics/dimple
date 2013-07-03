        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/addAxis.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-addAxis
        this.addAxis = function (position, categoryFields, measure, timeField) {
            // Convert the passed category fields to an array in case a single string is sent
            if (categoryFields !== null && categoryFields !== undefined) {
                categoryFields = [].concat(categoryFields);
            }
            // Create the axis object based on the passed parameters
            var axis = new dimple.axis(
                this,
                position,
                categoryFields,
                measure,
                timeField
            );
            // Add the axis to the array for the chart
            this.axes.push(axis);
            // return the axis
            return axis;
        };

