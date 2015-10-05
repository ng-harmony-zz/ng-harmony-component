# Ng-Harmony-Component
======================

[![Join the chat at https://gitter.im/ng-harmony/ng-harmony](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ng-harmony/ng_harmony?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Concept

A (sample) ES7-proposal (babel-feature) annotation collection mimicking the upcoming Angular 2.0 code-style.
Write your own, contribute, and feel like a hero ... it's easy!

Use:
* [literate-programming](http://npmjs.org/packages/literate-programming "click for npm-package-homepage") to write markdown-flavored literate JS, HTML and CSS
* [jspm](https://www.npmjs.com/package/jspm "click for npm-package-homepage") for a nice solution to handle npm-modules with ES6-Module-Format-Loading ...

* * *

## Files

This serves as literate-programming compiler-directive

[dist/raw/ng_harmony_component.js](#Compilation "save:")

## Compilation

To Compile this package please run `npm run all` from a proper shell (on Windows there's gitbash!);

Dependencies/Base-Classes

```javascript
    import { Srvc, Ctrl } from "ng-harmony/ng-harmony";
    import { PowerCtrl } from "ng-harmony/ng-harmony-powercontroller";
```

The _DataService_ Class is a starting point for API-consuming Services, that provide linkable Data-Objects

```javascript
    export class DataService extends Srvc {
        constructor(...args) { super(...args); }
```
Initiate and trigger
```javascript
        _db (api, { name, oneshot, interval }) {
            this.name = name;
            this.oneshot = oneshot === true || !(interval !== undefined && interval !== null);
            this.interval = interval || null;
            this.q = this.$q.defer();

            if (this.db === undefined || this.db === null) {
                this.db = {
                    busy: false,
                    ready: false,
                    handle: (api !== undefined && api !== null) ? this.$resource(api) : null,
                    store: []
                }
            }
            if (this.db.busy === true) {
                this.$timeout(() => {
                    (this.oneshot === true) ?
                        this.q.reject() :
                        this.q.notify(false);
                }, 0);
            }
            if (this.oneshot === false) {
                this.q.promise.then(
                    () => { true; },
                    (notification) => { this.$timeout(this._api, this.interval); },
                    () => { false; }
                )
            }

            this._api();
            this.q.promise();
        }
```
AJAX Mechanism
```javascript
        _api () {
            if (this.db.busy === true) { return null; }
            this.db.busy = true;
            this.db.handle.get().$promise
                .then((data) => {
                    console.info(`${(new Date()).toLocaleTimeString('en-US')}: API/${this.name}: success`);
                    this._store(data[this.name] || data);
                    this.db.busy = false;
                    if (this.oneshot !== false) {
                        this.q && this.q.resolve();
                        this.q = this.$q.defer();
                    } else { this.q.notify(true); }
                }).catch((err) => {
                    console.warn(`${(new Date()).toLocaleTimeString('en-US')}: API/${this.name}: ${err.toString()}`);
                    if (this.oneshot !== false) {
                        this.q && this.q.reject();
                        this.q = this.$q.defer();
                    } else {
                        this.q.notify(false);
                    }
                });
        }
```
Storage Mechanism
```javascript
        _store (data) {
```
Usually the API returns an Array of n datasets
Should your API return an Object instead, it is "arrayified"
```javascript
            let _data = Object.prototype.toString.call(data) === "[object Array]" ? data : [data];
```
Before we update the existing in-memory database to the newly returned API values we want to clean up all outdated datasets
```javascript
            for (let [i, o] of this.db.store.entries()) {
                o.deleted = true;
            }
```
Iterating over the new datasets we
* invalidate the deleted prop for the now newly existing props
* via this mech will not loose special ng-hash-vals and possibly some of your personal special data
```javascript
            for (let [i, o] of this.db.store.entries()) {
                let current = null;
                if (current = _data.filter((el, i, arr) => { return (el.id === o.id); })[0]) {
                    for (let [k, v] of this.constructor.iterate(current)) { this.db.store[i][k] = v; }
                    this.db.store[i].deleted = false;
                }
            }
            for (let [i, o] of _data.entries()) {
                let current = null;
                if (this.db.store.filter((el, i, arr) => { return el.id === o.id; }).length === 0) {
                    this.db.store.push(o);
                    this.db.store[this.db.store.length - 1].deleted = false;
                }
            }
        }
    }
    DataService.$inject = ["$resource", "$interval", "$q", "$timeout"];
```

The DynamicDataService provides some convenience mechanisms for cooperation of DataServices and Controllers
* Event Subscription
* Auto Notification on Ajax-Data
* Pre-Configuration of Ajax-Data
* Getter and Setter to the in-memory db

```javascript
    export class DynamicDataService extends DataService {
        constructor(...args) { super(...args); }
        subscribe (callback, oneshot = false) {
            if (this.subscribers === undefined || this.subscribers === null) { this.subscribers = []; }
            if (this.once_subscribers === undefined || this.once_subscribers === null) { this.once_subscribers = []; }
            if (onehost === true) { this.once_subscribers.push(callback); }
            else { this.subscribers.push(callback); }
        }
        aspects (injection, oneshot = false) {
            if (this.aspects === undefined || this.aspects === null) { this.aspects = []; }
            if (this.once_aspects === undefined || this.once_aspects === null) { this.once_aspects = []; }
            if (onehost === true) { this.once_aspects.push(injection); }
            else { this.aspects.push(injection); }
        }
        getData (matcher) {
            return this.db.store.filter((el, i, arr) => {
                for (let [k, v] of this.constructor.iterate(matcher)) {
                    if (!(typeof v === "function" && v(el[k]) || (el[k] === v))) { return false; }
                }
                return true;
            })
        }
        setData (opts) {
            if (!~opts.i) {
                for (let [doc, i] of this.db.store.entries()) {
                    doc[opts.prop] = typeof opts.val === "function" ? opts.val(this.db, doc.id) : opts.val;
                }
            } else {
                let foo = this.db.store[typeof opts.i === "function" ? opts.i(this.db) : opts.i];
                if (foo !== undefined && foo !== null) {
                    foo[opts.prop] = typeof opts.val === "function" ?
                        opts.val(this.db, this.db.store[
                            typeof opts.i === "function" ?
                                opts.i(this.db) :
                                opts.i
                        ]) :
                        opts.val
                }
            }
        }
        digest () {
            if (this.db.ready === false) { return null; }
            if (this.db.resolved === undefined || this.db.resolved === null) { this.db.resolved = false; }

            for (let [i, once_aspect] of this.once_aspects.entries()) {
                typeof once_aspect === "function" && once_aspect(this.db);
                this.once_aspects[i] = null;
            }
            this.once_aspects = [];
            for (let [i, aspect] of this.aspects.entries()) { aspect(this.db); }

            for (let [i, d] of this.db.store.entries()) {
                if (d.deleted === true) { d.selected = false; }
                else if (d.selected === true) { this.db.current = d; }
                else if (d.selected === undefined || d.selected === null) { d.selected = false; }
            }

            this.db.resolved = true;

            for (let [i, once_cb] of this.once_subscribers.entries()) {
                typeof once_cb === "function" && once_cb(this.db);
                this.once_subscribers[i] = null;
            }
            this.once_subscribers = [];
            for (let [i, cb] of this.subscribers.entries()) { cb(this.db); }

            return true;
        }
    }
```

The _Component_ class is building on top of the Controller and taking advantage of the DynamicDataService ... it
* automatically hooks up to all injected DataServices
* provides for a default data-transformation
* provides a default css-driving UI/UX-state mechansim

```javascript
    export class Component extends Ctrl {
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
    export class PowerComponent extends Component.mixin(PowerCtrl) {}
```

## CHANGELOG

*0.1.1*: _PowerComponent_: ComponentCtrl with Eventing-Capabilities of the PowerCtrl
