var _dec, _class, _dec2, _class2, _dec3, _class3;

import "ng-harmony/ng-harmony-evented";
import { Mixin } from "ng-harmony/ng-harmony-annotate";

let Base = class Base {
    constructor(...args) {
        super(...args);
    }
    initialize(...args) {

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
        this.$scope.state = {
            loading: true,
            selected: null,
            busy: null,
            error: null
        };
        for (let [i, dataset] of this.transform.entries()) {
            let Service = this[`${ dataset.descriptor[0].toUpperCase() }${ dataset.descriptor.substr(1) }DataService`];
            for (let [i, rule] of dataset.init.entries()) {
                Service.aspects(() => {
                    Service.set(rule);
                }, true);
            }
            for (let [i, rule] of dataset.digest.entries()) {
                Service.aspects(() => {
                    Service.set(rule);
                });
            }
        }
        for (let [key, Service] of this.constructor.iterate(this)) {
            if (!/DataService/.test(key)) {
                continue;
            }
            descriptor = key.remove("DataService").toLowerCase();
            Service.subscribe(this._transform.bind(this, descriptor));
            if (Service.db && Service.db.ready === true) {
                Service.digest();
            }
        }
        for (let [k, v] of this.constructor.iterate(this.$scope.state)) {
            let className = this.$element.className.split(/\s+/);
            let hasClass = !!~className.indexOf(k);
            if (v === true && !hasClass) {
                this.$element.addClass(k);
            }
            ((_k, _v, _hasClass, _className) => {
                this.$scope.$watch(`state.${ _k }`, (after, before) => {
                    if (after === true && !_hasClass) {
                        this.$element.className += ` ${ _k }`;
                    } else if (_hasClass) {
                        this.$element.className = _className.filter((el, i, arr) => {
                            return el !== _k;
                        }).join(" ");
                    }
                    if (before === after || (before === undefined || before === null) && (after === undefined || after === null)) {
                        return null;
                    }
                    this.$scope.$emit(`state.${ _k }`, {
                        obj: this.toString(),
                        val: after
                    });
                });
            })(k, v, hasClass, className);
        }
    }
    _transform(descriptor, db) {
        if (this.$scope.model[descriptor] === undefined || this.$scope.model[descriptor] === null) {
            this.$scope.model[descriptor] = this[descriptor[1].toUpperCase() + descriptor.substring(1) + "DataService"].db.store;
        }
        if (this.$scope.model.current === undefined || this.$scope.model.current === null) {
            this.$scope.model.current = {};
        }
        this.$scope.model.current[descriptor] = db.current || null;
        if (this.$scope.model[descriptor] === undefined || this.$scope.model[descriptor] === null || this.$scope.model[descriptor].length === 0) {
            console.warn(`${ this.toString() }::_transform: the dataset of ${ descriptor } was empty`);
            return false;
        } else {
            return true;
        }
    }
};
let Component = (_dec = Mixin([Base]), _dec(_class = class Component extends EventedController {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
}) || _class);
export { Component as default };

export let RouteComponent = (_dec2 = Mixin([Base]), _dec2(_class2 = class RouteComponent extends RouteController {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
}) || _class2);

export let StatefulComponent = (_dec3 = Mixin([Base]), _dec3(_class3 = class StatefulComponent extends StatefulController {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
}) || _class3);

//# sourceMappingURL=system_module.js.map