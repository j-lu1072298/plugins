"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var templates_1 = require("./templates");
var templates_2 = require("./templates");
var templates_3 = require("./templates");
var rxjs_1 = require("rxjs");
var Geolocator = /** @class */ (function () {
    function Geolocator() {
        this.urls = {
            locate: 'http://geogratis.gc.ca/services/geolocation/en/locate?',
            auto: 'http://geogratis.gc.ca/services/geolocation/en/autocomplete?',
            sim: 'http://geogratis.gc.ca/services/geolocation/en/suggest?'
        };
    }
    Geolocator.prototype.getDescription = function () {
        return this._complete.asObservable();
    };
    Geolocator.prototype.setDescription = function (newValue1) {
        this._complete.next(newValue1);
    };
    Geolocator.prototype.init = function (api) {
        var _this = this;
        this.api = api;
        this._complete = new rxjs_1.BehaviorSubject('Start');
        this.button = this.api.mapI.addPluginButton("{{ 'plugins.geolocator.title' | translate }}", this.onMenuItemClick());
        RAMP.mapAdded.subscribe(function () {
            _this.make_panel();
        });
    };
    // Creates original instance of the panel when plugin is loaded
    Geolocator.prototype.make_panel = function () {
        this.setAngular();
        this.setAuto();
        this.setComplete();
        this.panel = this.api.panels.create('geolocatorPanel');
        // Size and location of original panel
        this.panel.element.css({
            top: '60px',
            left: '0px',
            bottom: '400px',
            width: '800px',
        });
        // adds a close panel button and collapse panel button 
        var closeBtn = this.panel.header.closeButton;
        var toggleBtn = this.panel.header.toggleButton;
        // Adds title for panel which will change languages if that option is changed in the menu
        this.panel.header.title = "plugins.geolocator.title";
        // Adds the input and select boxes to the panel 
        this.panel.body = templates_1.INPUT_BOX + templates_2.AUTO_SELECT + templates_3.AUTO_COMPLETE;
        this.open_Panel();
    }; // End of make_panel()  
    // Next two functions open and close panels and add and remove/add the checkmark on the plugin button
    Geolocator.prototype.close_Panel = function () {
        this.panel.close();
        this.button.isActive = false;
    };
    Geolocator.prototype.open_Panel = function () {
        this.panel.open();
        this._RV.toggleSideNav('close');
        this.button.isActive = true;
    };
    // 
    // Slight bug, when the header X (close) button is hit it doesn't make this.button.isActive set to false 
    //    
    Geolocator.prototype.onMenuItemClick = function () {
        var _this = this;
        return function () {
            if (!_this.button.isActive) {
                _this.open_Panel();
            }
            else {
                _this.close_Panel();
            }
        };
    }; // End of onMenuItemClick function
    // Creates a blank list upon the creation of a new panel and creates an autocomplete list when an address is entered into the input box
    Geolocator.prototype.setAuto = function () {
        var that = this;
        var myMap = window.RAMP.mapById('geolocator');
        myMap.layersObj.addLayer('pointlayer');
        //Blank autocomplete list
        this.api.agControllerRegister('autoCtrl', function () {
            var _this = this;
            this.items = [
                { name: '', coords: '' },
                { name: '', coords: '' },
                { name: '', coords: '' },
                { name: '', coords: '' },
                { name: '', coords: '' }
            ];
            // Called everytime the input text is changed an there are new query results
            that.getDescription().subscribe(function (value) {
                _this.items = [
                    { name: value[0][0], coords: value[0][1] },
                    { name: value[1][0], coords: value[1][1] },
                    { name: value[2][0], coords: value[2][1] },
                    { name: value[3][0], coords: value[3][1] },
                    { name: value[4][0], coords: value[4][1] }
                ];
            });
            // Called when an autoselect option is chosen and then initiates the zoom to location using zoom() function
            this.getLoc = function (that) {
                var selectedItem = _this.place;
                var coordsLoc;
                for (var i = 0; i < 5; ++i) {
                    if (selectedItem === _this.items[i].name) {
                        coordsLoc = _this.items[i].coords;
                    }
                }
                var myMap = window.RAMP.mapById('geolocator');
                var ramp = window.RAMP;
                var pointLayer = myMap.layers.getLayersById('pointlayer')[0];
                pointLayer.removeGeometry();
                // geolocator is the identifier for the map found in geo-index.html 27
                pointZoom('geolocator', coordsLoc, myMap, ramp, pointLayer);
            };
        });
    }; // End of set Auto
    // Used to query when the results of the input field are changed and initiates update of autocomplete box
    Geolocator.prototype.setAngular = function () {
        var that = this;
        this.api.agControllerRegister('findCtrl', function () {
            var _this = this;
            this.autoComplete = function () {
                var place = _this.address;
                console.log(place);
                $.ajax({
                    method: 'GET',
                    url: that.urls.locate,
                    cache: false,
                    dataType: 'json',
                    data: "q=" + place
                }).then(function (json) {
                    var found = json;
                    console.log(found);
                    var loc = [
                        ['',], ['',], ['',], ['',], ['',]
                    ];
                    // gets first 5 results from the json and sends the title and coordinates to the setAuto() function
                    for (var i = 0; i < 5; ++i) {
                        loc[i][0] = json[i].title;
                        loc[i][1] = json[i].geometry.coordinates;
                        //$("#loc").append(json[i].title);
                    }
                    that.setDescription(loc);
                });
            };
        });
    }; // End of setAngular
    Geolocator.prototype.setComplete = function () {
        var that = this;
        this.api.agControllerRegister('searchAuto', function () {
            var _this = this;
            this.search = function () {
                var place = _this.searchText;
                console.log(place);
                $.ajax({
                    method: 'GET',
                    url: that.urls.locate,
                    cache: false,
                    dataType: 'json',
                    data: "q=" + place
                }).then(function (json) {
                    var found = json;
                    console.log(found);
                    _this.optionText = [
                        { name: json[1].title, coords: json[1].geometry },
                        { name: json[2].title, coords: json[1].geometry },
                        { name: json[3].title, coords: json[1].geometry },
                        { name: json[4].title, coords: json[1].geometry },
                        { name: json[5].title, coords: json[1].geometry }
                    ];
                    console.log(_this.optionText[1]);
                });
            };
        });
    };
    return Geolocator;
}()); // End of Class Geolocator
exports.Geolocator = Geolocator;
// Receives a set of xy coordinates and uses them to move the map to that location and zoom in
// Places a point on the map at the coordinate location
function pointZoom(mapId, addressCoords, myMap, ramp, pointLayer) {
    var pt = new ramp.GEO.XY(addressCoords[0], addressCoords[1]);
    myMap.zoom = 13;
    myMap.setCenter(pt);
    var icon = 'M 50 0 100 100 50 100 0 100 Z';
    var marker = new ramp.GEO.Point("locGeo", [addressCoords[0], addressCoords[1]], {
        style: 'ICON',
        icon: icon,
        colour: [45, 45, 200, 100], width: 25
    });
    pointLayer.addGeometry(marker);
}
Geolocator.prototype.translations = {
    'en-CA': {
        title: 'Geolocation',
        input: 'Your Address',
        auto: 'Click here to choose the correct address'
    },
    'fr-CA': {
        title: 'Géolocalisation',
        input: 'Votre Addresse',
        auto: 'Cliquez ici pour choisir la bonne adresse'
    }
};
window.geolocator = Geolocator;
