// @flow

const DOM = require('../../util/dom');
const util = require('../../util/util');
const DragRotateHandler = require('../handler/drag_rotate');

import type Map from '../map';

const defaultOptions = {
    showCompass: true,
    showZoom: true
};

/**
 * A `NavigationControl` control contains zoom buttons and a compass.
 *
 * @implements {IControl}
 * @param {Object} [options]
 * @param {Boolean} [options.showCompass=true] If `true` the compass button is included.
 * @param {Boolean} [options.showZoom=true] If `true` the zoom-in and zoom-out buttons are included.
 * @example
 * var nav = new mapboxgl.NavigationControl();
 * map.addControl(nav, 'top-left');
 * @see [Display map navigation controls](https://www.mapbox.com/mapbox-gl-js/example/navigation/)
 * @see [Add a third party vector tile source](https://www.mapbox.com/mapbox-gl-js/example/third-party/)
 */
class NavigationControl {
    _map: Map;
    options: any;
    _container: HTMLElement;
    _zoomInButton: HTMLElement;
    _zoomOutButton: HTMLElement;
    _compass: HTMLElement;
    _compassArrow: HTMLElement;
    _handler: DragRotateHandler;

    constructor(options: any) {
        this.options = util.extend({}, defaultOptions, options);

        this._container = DOM.create('div', 'mapboxgl-ctrl mapboxgl-ctrl-group');
        this._container.addEventListener('contextmenu', (e) => e.preventDefault());

        if (this.options.showZoom) {
            this._zoomInButton = this._createButton('mapboxgl-ctrl-icon mapboxgl-ctrl-zoom-in', 'Zoom In', () => this._map.zoomIn());
            this._zoomOutButton = this._createButton('mapboxgl-ctrl-icon mapboxgl-ctrl-zoom-out', 'Zoom Out', () => this._map.zoomOut());
        }
        if (this.options.showCompass) {
            util.bindAll([
                '_rotateCompassArrow'
            ], this);
            this._compass = this._createButton('mapboxgl-ctrl-icon mapboxgl-ctrl-compass', 'Reset North', () => this._map.resetNorth());
            this._compassArrow = DOM.create('span', 'mapboxgl-ctrl-compass-arrow', this._compass);
        }
    }

    _rotateCompassArrow() {
        const rotate = `rotate(${this._map.transform.angle * (180 / Math.PI)}deg)`;
        this._compassArrow.style.transform = rotate;
    }

    onAdd(map: Map) {
        this._map = map;
        if (this.options.showCompass) {
            this._map.on('rotate', this._rotateCompassArrow);
            this._rotateCompassArrow();
            this._handler = new DragRotateHandler(map, {button: 'left', element: this._compass});
            this._handler.enable();
        }
        return this._container;
    }

    onRemove() {
        DOM.remove(this._container);
        if (this.options.showCompass) {
            this._map.off('rotate', this._rotateCompassArrow);
            this._handler.disable();
            delete this._handler;
        }

        delete this._map;
    }

    _createButton(className: string, ariaLabel: string, fn: () => mixed) {
        const a = DOM.create('button', className, this._container);
        a.type = 'button';
        a.setAttribute('aria-label', ariaLabel);
        a.addEventListener('click', fn);
        return a;
    }
}

module.exports = NavigationControl;
