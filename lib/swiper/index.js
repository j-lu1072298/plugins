"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Swiper = /** @class */ (function () {
    function Swiper() {
        this.closureFunc = function (fn) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var args = Array.prototype.slice.call(arguments, 1);
            return function () {
                // Clone the array (with slice()) and append additional arguments
                // to the existing arguments.
                var newArgs = args.slice();
                newArgs.push.apply(newArgs, arguments);
                return fn.apply(this, newArgs);
            };
        };
    }
    Swiper.prototype.init = function (mapApi) {
        var _this = this;
        this.mapApi = mapApi;
        // get swiper config
        this.config = this._RV.getConfig('plugins').swiper;
        this.config.language = this._RV.getCurrentLang();
        var myBundlePromise = RAMP.GAPI.esriLoadApiClasses([['esri/dijit/LayerSwipe', 'layerSwipe']]);
        myBundlePromise.then(function (myBundle) {
            _this.setSwiper(myBundle, _this.config);
        });
    };
    Swiper.prototype.setSwiper = function (myBundle, swiper) {
        // add layers
        var layers = [];
        var len = swiper.layers.length;
        while (len--) {
            layers.push(this.mapApi.esriMap.getLayer(swiper.layers[len].id));
        }
        // add swiper div
        this.mapApi.mapDiv.find('rv-shell').find('.rv-esri-map').prepend('<div id="rv-swiper-div"></div>');
        // create swiper
        var swipeWidget = new myBundle.layerSwipe({
            type: swiper.type,
            map: this.mapApi.esriMap,
            layers: layers
        }, 'rv-swiper-div');
        var that = this;
        swipeWidget.on('load', function () {
            var item = that.mapApi.mapDiv.find('#rv-swiper-div .vertical')[0];
            // set tabindex and WCAG keyboard offset
            item.tabIndex = -3;
            item.addEventListener('keydown', that.closureFunc(function (swipeWidget, item, off, evt) {
                var value = parseInt(item.style.left);
                var width = parseInt(that.mapApi.mapDiv.find('#rv-swiper-div').width()) - 10;
                if (evt.keyCode === 37 && value >= 0) {
                    // left 37
                    value = (value > off) ? value -= off : 0;
                }
                else if (evt.keyCode === 39 && value <= width) {
                    // right 39
                    value = (value <= width - off) ? value += off : width;
                }
                item.style.left = String(value + 'px');
                swipeWidget.swipe();
            }, swipeWidget, item, swiper.keyboardOffset));
            // change text if french
            if (that._RV.getCurrentLang() === 'fr-CA') {
                item.title = 'Faites glisser pour voir les couches sous-jacentes';
            }
        });
        swipeWidget.startup();
    };
    return Swiper;
}());
exports.default = Swiper;
window.swiper = Swiper;
