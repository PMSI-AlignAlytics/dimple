        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/_registerEventHandlers.js
        // Register events, handle standard d3 shape events
        this._registerEventHandlers = function (series) {
            if (series._eventHandlers !== null && series._eventHandlers.length > 0) {
                series._eventHandlers.forEach(function (thisHandler) {
                    if (thisHandler.handler !== null && typeof (thisHandler.handler) === "function") {
                        series.shapes.on(thisHandler.event, function (d) {
                            var e = new dimple.eventArgs();
                            if (series.chart.storyboard !== null) {
                                e.frameValue = series.chart.storyboard.getFrameValue();
                            }
                            e.seriesValue = d.aggField;
                            e.xValue = d.x;
                            e.yValue = d.y;
                            e.zValue = d.z;
                            e.colorValue = d.cValue;
                            e.seriesShapes = series.shapes;
                            e.selectedShape = d3.select(this);
                            thisHandler.handler(e);
                        });
                    }
                }, this);
            }
        };

