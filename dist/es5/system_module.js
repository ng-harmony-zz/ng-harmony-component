System.register(['ng-harmony'], function (_export) {
    var Srvc, Ctrl, _slicedToArray, _classCallCheck, _createClass, _get, _inherits, DataService, DynamicDataService, Component;

    return {
        setters: [function (_ngHarmony) {
            Srvc = _ngHarmony.Srvc;
            Ctrl = _ngHarmony.Ctrl;
        }],
        execute: function () {
            'use strict';

            _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

            _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

            _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

            _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

            DataService = (function (_Srvc) {
                function DataService() {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    _classCallCheck(this, DataService);

                    _get(Object.getPrototypeOf(DataService.prototype), 'constructor', this).apply(this, args);
                }

                _inherits(DataService, _Srvc);

                _createClass(DataService, [{
                    key: '_db',
                    value: function _db(api, _ref) {
                        var _this = this;

                        var name = _ref.name;
                        var oneshot = _ref.oneshot;
                        var interval = _ref.interval;

                        this.name = name;
                        this.oneshot = oneshot === true || !(interval !== undefined && interval !== null);
                        this.interval = interval || null;
                        this.q = this.$q.defer();
                        if (this.db === undefined || this.db === null) {
                            this.db = {
                                busy: false,
                                ready: false,
                                handle: api !== undefined && api !== null ? this.$resource(api) : null,
                                store: []
                            };
                        }
                        if (this.db.busy === true) {
                            this.$timeout(function () {
                                _this.oneshot === true ? _this.q.reject() : _this.q.notify(false);
                            }, 0);
                        }
                        if (this.oneshot === false) {
                            this.q.promise.then(function () {
                                true;
                            }, function (notification) {
                                _this.$timeout(_this._api, _this.interval);
                            }, function () {
                                false;
                            });
                        }
                        this._api();
                        this.q.promise();
                    }
                }, {
                    key: '_api',
                    value: function _api() {
                        var _this2 = this;

                        if (this.db.busy === true) {
                            return null;
                        }
                        this.db.busy = true;
                        this.db.handle.get().$promise.then(function (data) {
                            console.info('' + new Date().toLocaleTimeString('en-US') + ': API/' + _this2.name + ': success');
                            _this2._store(data[_this2.name] || data);
                            _this2.db.busy = false;
                            if (_this2.oneshot !== false) {
                                _this2.q && _this2.q.resolve();
                                _this2.q = _this2.$q.defer();
                            } else {
                                _this2.q.notify(true);
                            }
                        })['catch'](function (err) {
                            console.warn('' + new Date().toLocaleTimeString('en-US') + ': API/' + _this2.name + ': ' + err.toString());
                            if (_this2.oneshot !== false) {
                                _this2.q && _this2.q.reject();
                                _this2.q = _this2.$q.defer();
                            } else {
                                _this2.q.notify(false);
                            }
                        });
                    }
                }, {
                    key: '_store',
                    value: function _store(data) {
                        var _this3 = this;

                        var _data = Object.prototype.toString.call(data) === '[object Array]' ? data : [data];
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = this.db.store.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var _step$value = _slicedToArray(_step.value, 2);

                                var i = _step$value[0];
                                var o = _step$value[1];

                                o.deleted = true;
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator['return']) {
                                    _iterator['return']();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            var _loop = function () {
                                _step2$value = _slicedToArray(_step2.value, 2);
                                var i = _step2$value[0];
                                var o = _step2$value[1];

                                var current = null;
                                if (current = _data.filter(function (el, i, arr) {
                                    return el.id === o.id;
                                })[0]) {
                                    _iteratorNormalCompletion4 = true;
                                    _didIteratorError4 = false;
                                    _iteratorError4 = undefined;

                                    try {
                                        for (_iterator4 = _this3.constructor.iterate(current)[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                            _step4$value = _slicedToArray(_step4.value, 2);
                                            var k = _step4$value[0];
                                            var v = _step4$value[1];

                                            _this3.db.store[i][k] = v;
                                        }
                                    } catch (err) {
                                        _didIteratorError4 = true;
                                        _iteratorError4 = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                                                _iterator4['return']();
                                            }
                                        } finally {
                                            if (_didIteratorError4) {
                                                throw _iteratorError4;
                                            }
                                        }
                                    }

                                    _this3.db.store[i].deleted = false;
                                }
                            };

                            for (var _iterator2 = this.db.store.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var _step2$value;

                                var _iteratorNormalCompletion4;

                                var _didIteratorError4;

                                var _iteratorError4;

                                var _iterator4, _step4;

                                var _step4$value;

                                _loop();
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                                    _iterator2['return']();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }

                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            var _loop2 = function () {
                                _step3$value = _slicedToArray(_step3.value, 2);
                                var i = _step3$value[0];
                                var o = _step3$value[1];

                                var current = null;
                                if (_this3.db.store.filter(function (el, i, arr) {
                                    return el.id === o.id;
                                }).length === 0) {
                                    _this3.db.store.push(o);
                                    _this3.db.store[_this3.db.store.length - 1].deleted = false;
                                }
                            };

                            for (var _iterator3 = _data.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var _step3$value;

                                _loop2();
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                                    _iterator3['return']();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                    }
                }]);

                return DataService;
            })(Srvc);

            _export('DataService', DataService);

            DataService.$inject = ['$resource', '$interval', '$q', '$timeout'];

            DynamicDataService = (function (_DataService) {
                function DynamicDataService() {
                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = arguments[_key2];
                    }

                    _classCallCheck(this, DynamicDataService);

                    _get(Object.getPrototypeOf(DynamicDataService.prototype), 'constructor', this).apply(this, args);
                }

                _inherits(DynamicDataService, _DataService);

                _createClass(DynamicDataService, [{
                    key: 'subscribe',
                    value: function subscribe(callback) {
                        var oneshot = arguments[1] === undefined ? false : arguments[1];

                        if (this.subscribers === undefined || this.subscribers === null) {
                            this.subscribers = [];
                        }
                        if (this.once_subscribers === undefined || this.once_subscribers === null) {
                            this.once_subscribers = [];
                        }
                        if (onehost === true) {
                            this.once_subscribers.push(callback);
                        } else {
                            this.subscribers.push(callback);
                        }
                    }
                }, {
                    key: 'aspects',
                    value: function aspects(injection) {
                        var oneshot = arguments[1] === undefined ? false : arguments[1];

                        if (this.aspects === undefined || this.aspects === null) {
                            this.aspects = [];
                        }
                        if (this.once_aspects === undefined || this.once_aspects === null) {
                            this.once_aspects = [];
                        }
                        if (onehost === true) {
                            this.once_aspects.push(injection);
                        } else {
                            this.aspects.push(injection);
                        }
                    }
                }, {
                    key: 'getData',
                    value: function getData(matcher) {
                        var _this4 = this;

                        return this.db.store.filter(function (el, i, arr) {
                            var _iteratorNormalCompletion5 = true;
                            var _didIteratorError5 = false;
                            var _iteratorError5 = undefined;

                            try {
                                for (var _iterator5 = _this4.constructor.iterate(matcher)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                    var _step5$value = _slicedToArray(_step5.value, 2);

                                    var k = _step5$value[0];
                                    var v = _step5$value[1];

                                    if (!(typeof v === 'function' && v(el[k]) || el[k] === v)) {
                                        return false;
                                    }
                                }
                            } catch (err) {
                                _didIteratorError5 = true;
                                _iteratorError5 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                                        _iterator5['return']();
                                    }
                                } finally {
                                    if (_didIteratorError5) {
                                        throw _iteratorError5;
                                    }
                                }
                            }

                            return true;
                        });
                    }
                }, {
                    key: 'setData',
                    value: function setData(opts) {
                        if (! ~opts.i) {
                            var _iteratorNormalCompletion6 = true;
                            var _didIteratorError6 = false;
                            var _iteratorError6 = undefined;

                            try {
                                for (var _iterator6 = this.db.store.entries()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                    var _step6$value = _slicedToArray(_step6.value, 2);

                                    var doc = _step6$value[0];
                                    var i = _step6$value[1];

                                    doc[opts.prop] = typeof opts.val === 'function' ? opts.val(this.db, doc.id) : opts.val;
                                }
                            } catch (err) {
                                _didIteratorError6 = true;
                                _iteratorError6 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                                        _iterator6['return']();
                                    }
                                } finally {
                                    if (_didIteratorError6) {
                                        throw _iteratorError6;
                                    }
                                }
                            }
                        } else {
                            var foo = this.db.store[typeof opts.i === 'function' ? opts.i(this.db) : opts.i];
                            if (foo !== undefined && foo !== null) {
                                foo[opts.prop] = typeof opts.val === 'function' ? opts.val(this.db, this.db.store[typeof opts.i === 'function' ? opts.i(this.db) : opts.i]) : opts.val;
                            }
                        }
                    }
                }, {
                    key: 'digest',
                    value: function digest() {
                        if (this.db.ready === false) {
                            return null;
                        }
                        if (this.db.resolved === undefined || this.db.resolved === null) {
                            this.db.resolved = false;
                        }
                        var _iteratorNormalCompletion7 = true;
                        var _didIteratorError7 = false;
                        var _iteratorError7 = undefined;

                        try {
                            for (var _iterator7 = this.once_aspects.entries()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                var _step7$value = _slicedToArray(_step7.value, 2);

                                var i = _step7$value[0];
                                var once_aspect = _step7$value[1];

                                typeof once_aspect === 'function' && once_aspect(this.db);
                                this.once_aspects[i] = null;
                            }
                        } catch (err) {
                            _didIteratorError7 = true;
                            _iteratorError7 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion7 && _iterator7['return']) {
                                    _iterator7['return']();
                                }
                            } finally {
                                if (_didIteratorError7) {
                                    throw _iteratorError7;
                                }
                            }
                        }

                        this.once_aspects = [];
                        var _iteratorNormalCompletion8 = true;
                        var _didIteratorError8 = false;
                        var _iteratorError8 = undefined;

                        try {
                            for (var _iterator8 = this.aspects.entries()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                var _step8$value = _slicedToArray(_step8.value, 2);

                                var i = _step8$value[0];
                                var aspect = _step8$value[1];

                                aspect(this.db);
                            }
                        } catch (err) {
                            _didIteratorError8 = true;
                            _iteratorError8 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion8 && _iterator8['return']) {
                                    _iterator8['return']();
                                }
                            } finally {
                                if (_didIteratorError8) {
                                    throw _iteratorError8;
                                }
                            }
                        }

                        var _iteratorNormalCompletion9 = true;
                        var _didIteratorError9 = false;
                        var _iteratorError9 = undefined;

                        try {
                            for (var _iterator9 = this.db.store.entries()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                                var _step9$value = _slicedToArray(_step9.value, 2);

                                var i = _step9$value[0];
                                var d = _step9$value[1];

                                if (d.deleted === true) {
                                    d.selected = false;
                                } else if (d.selected === true) {
                                    this.db.current = d;
                                } else if (d.selected === undefined || d.selected === null) {
                                    d.selected = false;
                                }
                            }
                        } catch (err) {
                            _didIteratorError9 = true;
                            _iteratorError9 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion9 && _iterator9['return']) {
                                    _iterator9['return']();
                                }
                            } finally {
                                if (_didIteratorError9) {
                                    throw _iteratorError9;
                                }
                            }
                        }

                        this.db.resolved = true;
                        var _iteratorNormalCompletion10 = true;
                        var _didIteratorError10 = false;
                        var _iteratorError10 = undefined;

                        try {
                            for (var _iterator10 = this.once_subscribers.entries()[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                                var _step10$value = _slicedToArray(_step10.value, 2);

                                var i = _step10$value[0];
                                var once_cb = _step10$value[1];

                                typeof once_cb === 'function' && once_cb(this.db);
                                this.once_subscribers[i] = null;
                            }
                        } catch (err) {
                            _didIteratorError10 = true;
                            _iteratorError10 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion10 && _iterator10['return']) {
                                    _iterator10['return']();
                                }
                            } finally {
                                if (_didIteratorError10) {
                                    throw _iteratorError10;
                                }
                            }
                        }

                        this.once_subscribers = [];
                        var _iteratorNormalCompletion11 = true;
                        var _didIteratorError11 = false;
                        var _iteratorError11 = undefined;

                        try {
                            for (var _iterator11 = this.subscribers.entries()[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                                var _step11$value = _slicedToArray(_step11.value, 2);

                                var i = _step11$value[0];
                                var cb = _step11$value[1];

                                cb(this.db);
                            }
                        } catch (err) {
                            _didIteratorError11 = true;
                            _iteratorError11 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion11 && _iterator11['return']) {
                                    _iterator11['return']();
                                }
                            } finally {
                                if (_didIteratorError11) {
                                    throw _iteratorError11;
                                }
                            }
                        }

                        return true;
                    }
                }]);

                return DynamicDataService;
            })(DataService);

            _export('DynamicDataService', DynamicDataService);

            Component = (function (_Ctrl) {
                function Component() {
                    var _this5 = this;

                    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        args[_key3] = arguments[_key3];
                    }

                    _classCallCheck(this, Component);

                    _get(Object.getPrototypeOf(Component.prototype), 'constructor', this).apply(this, args);
                    this.$scope.model = {};
                    this.transform = [{
                        descriptor: 'Name', //of DataService without the DataService-suffix
                        init: [],
                        digest: []
                    }];
                    this.$scope.state = {
                        loading: true,
                        selected: null,
                        busy: null,
                        error: null
                    };
                    var _iteratorNormalCompletion12 = true;
                    var _didIteratorError12 = false;
                    var _iteratorError12 = undefined;

                    try {
                        var _loop3 = function () {
                            _step12$value = _slicedToArray(_step12.value, 2);
                            var i = _step12$value[0];
                            var dataset = _step12$value[1];

                            var Service = _this5['' + dataset.descriptor[0].toUpperCase() + '' + dataset.descriptor.substr(1) + 'DataService'];
                            _iteratorNormalCompletion15 = true;
                            _didIteratorError15 = false;
                            _iteratorError15 = undefined;

                            try {
                                var _loop4 = function () {
                                    _step15$value = _slicedToArray(_step15.value, 2);
                                    var i = _step15$value[0];
                                    var rule = _step15$value[1];

                                    Service.aspects(function () {
                                        Service.set(rule);
                                    }, true);
                                };

                                for (_iterator15 = dataset.init.entries()[Symbol.iterator](); !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                                    _loop4();
                                }
                            } catch (err) {
                                _didIteratorError15 = true;
                                _iteratorError15 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion15 && _iterator15['return']) {
                                        _iterator15['return']();
                                    }
                                } finally {
                                    if (_didIteratorError15) {
                                        throw _iteratorError15;
                                    }
                                }
                            }

                            _iteratorNormalCompletion16 = true;
                            _didIteratorError16 = false;
                            _iteratorError16 = undefined;

                            try {
                                var _loop5 = function () {
                                    _step16$value = _slicedToArray(_step16.value, 2);
                                    var i = _step16$value[0];
                                    var rule = _step16$value[1];

                                    Service.aspects(function () {
                                        Service.set(rule);
                                    });
                                };

                                for (_iterator16 = dataset.digest.entries()[Symbol.iterator](); !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                                    _loop5();
                                }
                            } catch (err) {
                                _didIteratorError16 = true;
                                _iteratorError16 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion16 && _iterator16['return']) {
                                        _iterator16['return']();
                                    }
                                } finally {
                                    if (_didIteratorError16) {
                                        throw _iteratorError16;
                                    }
                                }
                            }
                        };

                        for (var _iterator12 = this.transform.entries()[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                            var _step12$value;

                            var _iteratorNormalCompletion15;

                            var _didIteratorError15;

                            var _iteratorError15;

                            var _iterator15, _step15;

                            var _step15$value;

                            var _iteratorNormalCompletion16;

                            var _didIteratorError16;

                            var _iteratorError16;

                            var _iterator16, _step16;

                            var _step16$value;

                            _loop3();
                        }
                    } catch (err) {
                        _didIteratorError12 = true;
                        _iteratorError12 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion12 && _iterator12['return']) {
                                _iterator12['return']();
                            }
                        } finally {
                            if (_didIteratorError12) {
                                throw _iteratorError12;
                            }
                        }
                    }

                    var _iteratorNormalCompletion13 = true;
                    var _didIteratorError13 = false;
                    var _iteratorError13 = undefined;

                    try {
                        for (var _iterator13 = this.constructor.iterate(this)[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                            var _step13$value = _slicedToArray(_step13.value, 2);

                            var key = _step13$value[0];
                            var Service = _step13$value[1];

                            if (!/DataService/.test(key)) {
                                continue;
                            }
                            descriptor = key.remove('DataService').toLowerCase();
                            Service.subscribe(this._transform.bind(this, descriptor));
                            if (Service.db && Service.db.ready === true) {
                                Service.digest();
                            }
                        }
                    } catch (err) {
                        _didIteratorError13 = true;
                        _iteratorError13 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion13 && _iterator13['return']) {
                                _iterator13['return']();
                            }
                        } finally {
                            if (_didIteratorError13) {
                                throw _iteratorError13;
                            }
                        }
                    }

                    var _iteratorNormalCompletion14 = true;
                    var _didIteratorError14 = false;
                    var _iteratorError14 = undefined;

                    try {
                        for (var _iterator14 = this.constructor.iterate(this.$scope.state)[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                            var _step14$value = _slicedToArray(_step14.value, 2);

                            var k = _step14$value[0];
                            var v = _step14$value[1];

                            var className = this.$element.className.split(/\s+/);
                            var hasClass = !! ~className.indexOf(k);
                            if (v === true && !hasClass) {
                                this.$element.addClass(k);
                            }
                            (function (_k, _v, _hasClass, _className) {
                                _this5.$scope.$watch('state.' + _k, function (after, before) {
                                    if (after === true && !_hasClass) {
                                        _this5.$element.className += ' ' + _k;
                                    } else if (_hasClass) {
                                        _this5.$element.className = _className.filter(function (el, i, arr) {
                                            return el !== _k;
                                        }).join(' ');
                                    }
                                    if (before === after || (before === undefined || before === null) && (after === undefined || after === null)) {
                                        return null;
                                    }
                                    _this5.$scope.$emit('state.' + _k, {
                                        obj: _this5.toString(),
                                        val: after
                                    });
                                });
                            })(k, v, hasClass, className);
                        }
                    } catch (err) {
                        _didIteratorError14 = true;
                        _iteratorError14 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion14 && _iterator14['return']) {
                                _iterator14['return']();
                            }
                        } finally {
                            if (_didIteratorError14) {
                                throw _iteratorError14;
                            }
                        }
                    }
                }

                _inherits(Component, _Ctrl);

                _createClass(Component, [{
                    key: '_transform',
                    value: function _transform(descriptor, db) {
                        if (this.$scope.model[descriptor] === undefined || this.$scope.model[descriptor] === null) {
                            this.$scope.model[descriptor] = this[descriptor[1].toUpperCase() + descriptor.substring(1) + 'DataService'].db.store;
                        }
                        if (this.$scope.model.current === undefined || this.$scope.model.current === null) {
                            this.$scope.model.current = {};
                        }
                        this.$scope.model.current[descriptor] = db.current || null;
                        if (this.$scope.model[descriptor] === undefined || this.$scope.model[descriptor] === null || this.$scope.model[descriptor].length === 0) {
                            console.warn('' + this.toString() + '::_transform: the dataset of ' + descriptor + ' was empty');
                            return false;
                        } else {
                            return true;
                        }
                    }
                }]);

                return Component;
            })(Ctrl);

            _export('Component', Component);

            Component.$inject = '$element';
        }
    };
});

// i is the id ... 0 - length-1 ... or -1 for all datasets
//{ i: 0, prop: "loading", val: false },
//{ i: -1, prop: "selected", val: (db, id) => { return id is 0; } }

//{ i: -1, prop: "selected", val: (db, id) -> (db.store.find((el, i, arr) => { return el.id is id; }).special is this.$scope.someConditional }

//# sourceMappingURL=system_module.js.map