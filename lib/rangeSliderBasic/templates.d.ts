export declare const SLIDER_TEMPLATE = "\n<div rv-focus-exempt class=\"rv-rangeslider\">\n    <div class=\"slider-content\">\n        <div class=\"slider-bar\">\n            <div id=\"nouislider\" class=\"slider-widget\"></div>\n            <div class=\"slider-controls\"></div>\n        </div>\n    </div>\n</div>";
export declare const LOCK_BAR_TEMPLATE: string;
export declare const PREVIOUS_BAR_TEMPLATE: string;
export declare const NEXT_BAR_TEMPLATE: string;
export declare const PLAY_BAR_TEMPLATE: string;
export declare const REFRESH_BAR_TEMPLATE: string;
export declare const DELAY_BAR_TEMPLATE = "\n<div ng-controller=\"DelaySliderCtrl as ctrl\" class=\"slider-bar-control\">\n    <md-input-container class=\"md-block\" md-no-float flex>\n        <label>{{ 'plugins.rangeSlider.bar.delay' | translate }}</label>\n        <md-select\n            aria-label=\"{{ 'plugins.rangeSlider.bar.delay' | translate }}\"\n            ng-model=\"ctrl.selectedDelay\"\n            ng-change=\"ctrl.selectDelay()\">\n            <md-option ng-repeat=\"(key, value) in { 3000: '3 sec', 5000: '5 sec', 7000: '7 sec' }\" ng-value=\"{{ key }}\" ng-selected=\"{{ key }} === 5000\">\n                {{ value }}\n            </md-option>\n        </md-select>\n    </md-input-container>\n</div>";
export declare const EXPORT_BAR_TEMPLATE = "\n<div class=\"slider-bar-control\">\n    <md-switch\n        ng-controller=\"ExportSliderCtrl as ctrl\"\n        aria-label=\"{{ 'plugins.rangeSlider.histo' | translate }}\"\n        class=\"rv-slider-switch\"\n        ng-class=\"md-primary\"\n        ng-model=\"ctrl.export\">\n        {{ 'plugins.rangeSlider.histo' | translate }}\n        <md-tooltip>{{ 'plugins.rangeSlider.histo' | translate }}</md-tooltip>\n    </md-switchn>\n</div>";
