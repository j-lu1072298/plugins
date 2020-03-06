import { Observable } from 'rxjs';
export declare class Geolocator {
    private urls;
    private _complete;
    getDescription(): Observable<string>;
    private setDescription;
    init(api: any): void;
    make_panel(): void;
    close_Panel(): void;
    open_Panel(): void;
    onMenuItemClick(): () => void;
    setAuto(): void;
    setAngular(): void;
    setComplete(): void;
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
