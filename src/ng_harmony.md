# Ng-Harmony-Component
======================

## Development

![Harmony = 6 + 7;](logo.png "Harmony - Fire in my eyes")

The Component is a Controller that integrates with the special DataServices

## Concept

Services abstract away/encapsulate regular/recurring service calls, so code
isn't duplicated in various controller-spaces, but the actual CRUD is done in a
central place.
Since you might still want to transform/adapt your data in an individual way
I introduce a default naming scheme ... methods to be overridden/specified
in your own class so the default data is automatically adapted before further
use.

Use it in conjunction with

* [literate-programming](http://npmjs.org/packages/literate-programming "click for npm-package-homepage") to write markdown-flavored literate JS, HTML and CSS
* [jspm](https://www.npmjs.com/package/jspm "click for npm-package-homepage") for a nice solution to handle npm-modules with ES6-Module-Format-Loading ...
## Files

This serves as literate-programming compiler-directive

[dist/raw/ng_harmony_component.js](#Compilation "save:")

## Compilation

To Compile this package please run `npm run all` from a proper shell (on Windows there's gitbash!);

Dependencies/Base-Classes

```javascript
    import { Service, Controller } from "ng-harmony/ng-harmony";
    import { EventedController } from "ng-harmony/ng-harmony-evented";
```

The _Component_ class is building on top of the Controller and taking advantage of the DynamicDataService ... it
* automatically hooks up to all injected DataServices
* provides for a default data-transformation
* provides a default css-driving UI/UX-state mechansim

```javascript
    export class Component extends Controller {
        constructor (...args) {
            super(...args);
```

Aspect Oriented Feature here.
You can actually initialize a db-store (api-result-set) with a value or set values each api-cycle
Syntax is:

```javascript
            this.$scope.model = {};
            this.transform = [{
                descriptor: "Name", //of DataService without the DataService-suffix
                init: [
                    // i is the id ... 0 - length-1 ... or -1 for all datasets
                    //{ i: 0, prop: "loading", val: false },
                    //{ i: -1, prop: "selected", val: (db, id) => { return id is 0; } }
                ],
                digest: [
                    //{ i: -1, prop: "selected", val: (db, id) -> (db.store.find((el, i, arr) => { return el.id is id; }).special is this.$scope.someConditional }
                ]
            }];
```
The state var is a CSS-state-descriptor/helper
```javascript
            this.$scope.state = {
                loading: true,
                selected: null,
                busy: null,
                error: null
            };
```
Injecting the aspects defined in this.transform --- default actions for data transformation
```javascript
            for (let [i, dataset] of this.transform.entries()) {
                let Service = this[`${dataset.descriptor[0].toUpperCase()}${dataset.descriptor.substr(1)}DataService`];
                for (let [i, rule] of dataset.init.entries()) {
                    Service.aspects(() => { Service.set(rule) }, true);
                }
                for (let [i, rule] of dataset.digest.entries()) {
                    Service.aspects(() => { Service.set(rule) });
                }
            }
```
Hooking up the injected DataServices
* the transform member method is automatically called
* it has 2 params(descriptor = _Name_ DataService, db = NameDataService.db.store)
* always call super(descriptor, db) first and return if it returns false -> that's when something didn't work out with the AJAX call and there's nothing to be processed
* it takes care of a special obj-var "current" which reflects the currently "selected = true" dataset
```javascript
            for (let [key, Service] of this.constructor.iterate(this)) {
                if (!/DataService/.test(key)) { continue; }
                descriptor = key.remove("DataService").toLowerCase();
                Service.subscribe(this._transform.bind(this, descriptor));
                if (Service.db && Service.db.ready === true) { Service.digest(); }
            }
```
Taking care of the state watchers
* Applying the state descriptors/names as CSS-classes to the container
* Emitting an event that bubbles up to the Routing-Controller and allows for global State-Handling
```javascript
            for (let [k, v] of this.constructor.iterate(this.$scope.state)) {
                let className = this.$element.className.split(/\s+/);
                let hasClass = !!~className.indexOf(k);
                if (v === true && !hasClass) { this.$element.addClass(k); }
                ((_k, _v, _hasClass, _className) => {
                    this.$scope.$watch(`state.${_k}`, (after, before) => {
                        if (after === true && !_hasClass) { this.$element.className += ` ${_k}`; }
                        else if (_hasClass) { this.$element.className = _className.filter((el, i, arr) => { return el !== _k }).join(" "); }
                        if (before === after || ((before === undefined || before === null) && (after === undefined || after === null))) { return null; }
                        this.$scope.$emit(`state.${_k}`, {
                            obj: this.toString(),
                            val: after
                        });
                    })
                })(k, v, hasClass, className);
            }
        }
```
The actual default _transform_ function - as described at the hook-up-section
```javascript
        _transform (descriptor, db) {
            if (this.$scope.model[descriptor] === undefined || this.$scope.model[descriptor] === null) {
                this.$scope.model[descriptor] = this[descriptor[1].toUpperCase() + descriptor.substring(1) + "DataService"].db.store;
            }
            if (this.$scope.model.current === undefined || this.$scope.model.current === null) {
                this.$scope.model.current = {};
            }
            this.$scope.model.current[descriptor] = db.current || null;
            if (this.$scope.model[descriptor] === undefined || this.$scope.model[descriptor] === null || this.$scope.model[descriptor].length === 0) {
                console.warn(`${this.toString()}::_transform: the dataset of ${descriptor} was empty`)
                return false;
            } else { return true; }
        }
    }
    Component.$inject = "$element";
```
An enhanced Component-Variation, enabling the PowerControllers Eventing in the already powerful Ctrl
```javascript
    export class EventedComponent extends Component.mixin(EventedController) {};

    export class RouteComponent extends Component.mixin(RouteController) {};
    export class StatefulComponent extends Component.mixin(StatefulController) {};
```

## CHANGELOG
*0.2.0*: Refactoring and classifying into Standard/Evented/Routed/Stateful
*0.1.1*: _PowerComponent_: ComponentCtrl with Eventing-Capabilities of the PowerCtrl
