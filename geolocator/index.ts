import { INPUT_BOX} from './templates';
import { AUTO_SELECT} from './templates';
import { AUTO_COMPLETE} from './templates'
import { finished } from 'stream';
import { title } from 'process';
import { AUTO_LIST } from './templates'; 
import { Observable, BehaviorSubject } from 'rxjs';

export class Geolocator {
    private urls = {
        locate:  'http://geogratis.gc.ca/services/geolocation/en/locate?',
        auto: 'http://geogratis.gc.ca/services/geolocation/en/autocomplete?',
        sim: 'http://geogratis.gc.ca/services/geolocation/en/suggest?'
    };
    
// observable to detect description modification
private _complete: any;
public getDescription(): Observable<string> {
    return this._complete.asObservable();
}
private setDescription(newValue1: Array<string>): void {
    this._complete.next(newValue1);
}

    init(api: any){
        this.api = api;
        this._complete = new BehaviorSubject<string>('     ');

        this.button = this.api.mapI.addPluginButton(
            "{{ 'plugins.geolocator.title' | translate }}",
            this.onMenuItemClick()
        );

    
            (<any>RAMP).mapAdded.subscribe(() => {
                this.make_panel(); 
            }); 
        
    }
    // Creates original instance of the panel when plugin is loaded
    make_panel() {
      
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
        let closeBtn = this.panel.header.closeButton;
        let toggleBtn = this.panel.header.toggleButton;

        // Adds title for panel which will change languages if that option is changed in the menu
        this.panel.header.title = `plugins.geolocator.title`;

        // Adds the input and select boxes to the panel 
        //this.panel.body = INPUT_BOX + AUTO_SELECT + AUTO_COMPLETE; 
        this.panel.body = INPUT_BOX + AUTO_LIST;

        this.open_Panel();

    } // End of make_panel()  

    // Next two functions open and close panels and add and remove/add the checkmark on the plugin button
    close_Panel() {
        this.panel.close();
        this.button.isActive = false;
    }
    open_Panel() {
        this.panel.open();
        this._RV.toggleSideNav('close');
        this.button.isActive = true;
    }
    // 
    // Slight bug, when the header X (close) button is hit it doesn't make this.button.isActive set to false 
    //    
    onMenuItemClick() {
        return () => {
            if (!this.button.isActive) {
                this.open_Panel()

            } else {
                this.close_Panel();
             
            }
        };
    } // End of onMenuItemClick function

    
    // Creates a blank list upon the creation of a new panel and creates an autocomplete list when an address is entered into the input box
    setAuto() {
        const that = this
        const myMap = (<any>window).RAMP.mapById('geolocator');
        myMap.layersObj.addLayer('pointlayer');
       //Blank autocomplete list
        this.api.agControllerRegister('autoCtrl', function () {
         
          
            this.items = [
                { name: '', coords: '' },
                { name: '', coords: '' },
                { name: '', coords: '' },
                { name: '', coords: '' },
                { name: '', coords: '' }
            ];
            // Called everytime the input text is changed an there are new query results
            that.getDescription().subscribe(value =>{
               this.items = [
                { name: value[0][0], coords: value[0][1] },
                { name: value[1][0], coords: value[1][1] },
                { name: value[2][0], coords: value[2][1] },
                { name: value[3][0], coords: value[3][1] },
                { name: value[4][0], coords: value[4][1] }
                ];

            });
            // Called when an autoselect option is chosen and then initiates the zoom to location using zoom() function
                this.getLoc = (that) => {
                    let selectedItem: string = this.place
                    let coordsLoc: Array<any>; 
                    for (let i=0; i<5; ++i){
                        if(selectedItem === this.items[i].name){
                            coordsLoc = this.items[i].coords;
                        }
                    }
                    
                    const myMap = (<any>window).RAMP.mapById('geolocator');
                    const ramp = (<any>window).RAMP;
                    const pointLayer = myMap.layers.getLayersById('pointlayer')[0]; 
                    pointLayer.removeGeometry();
                // geolocator is the identifier for the map found in geo-index.html 27
                    pointZoom('geolocator', coordsLoc, myMap, ramp, pointLayer);
                    
                }
        });

    }// End of set Auto


// Used to query when the results of the input field are changed and initiates update of autocomplete box
      setAngular() {
        const that = this;
            this.api.agControllerRegister('findCtrl', function () {

                this.autoComplete = () => {
                    let place: string = this.address;
                    console.log(place);
                    $.ajax({
                        method: 'GET',
                        url: that.urls.locate,
                        cache: false,
                        dataType: 'json',
                        data: `q=${place}`
                    }).then(json => {
                      let found = json;
                      console.log(found);
                     
                      let loc: Array<any> = [
                          ['',], ['',], ['',], ['',], ['',]
                        ];
                        // gets first 5 results from the json and sends the title and coordinates to the setAuto() function
                      for(let i=0; i<5; ++i){
                            loc[i][0] = json[i].title;
                            loc[i][1] = json[i].geometry.coordinates;
                            //$("#loc").append(json[i].title);
                      }
                        that.setDescription(loc)
                    });


                }


        });

    } // End of setAngular


    setComplete() {
            const that = this;

            this.api.agControllerRegister( 'searchAuto', function() {
                
                
                this.search = () => {
                    let place: string = this.searchText;
                    console.log(place);

                   $.ajax({
                        method: 'GET',
                        url: that.urls.locate,
                        cache: false,
                        dataType: 'json',
                        data: `q=${place}`
                    }).then(json => {
                      let found = json;
                      console.log(found);
                  
                      this.optionText = [
                        { name: json[1].title, coords: json[1].geometry },
                        { name:json[2].title, coords: json[1].geometry  },
                        { name: json[3].title, coords: json[1].geometry  },
                        { name: json[4].title, coords: json[1].geometry  },
                        { name: json[5].title, coords: json[1].geometry  }
                    ];

                    console.log(this.optionText[1]);



                   });

                }
            });
                







    }


} // End of Class Geolocator
  

// Receives a set of xy coordinates and uses them to move the map to that location and zoom in
// Places a point on the map at the coordinate location
function pointZoom(mapId: string, addressCoords: Array<Number>, myMap: any, ramp: any, pointLayer){
    const pt = new ramp.GEO.XY(addressCoords[0], addressCoords[1]);
                
    myMap.zoom = 13;
    myMap.setCenter(pt);

    const icon = 'M 50 0 100 100 50 100 0 100 Z';

    let marker: any = new ramp.GEO.Point("locGeo", [addressCoords[0], addressCoords[1]], {
        style: 'ICON',
        icon: icon,
        colour: [45, 45, 200, 100], width:25});
    pointLayer.addGeometry(marker);
    
}





export interface Geolocator {
    api: any;
    translations: any;
    _RV: any;
    panel: any;
    button: any;
    isActive: boolean;
    name: string;
    geometry: any;
    loc: string;
   
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


(<any>window).geolocator = Geolocator;
