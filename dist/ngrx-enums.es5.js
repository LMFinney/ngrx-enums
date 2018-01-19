var INITIALIZED = Symbol();
/**
 * An instance of the enum (for example, if you have an enumeration of seasons,
 * Winter would be an EnumValue.
 */
var EnumValue = (function () {
    /**
     * `initEnum()` on Enum closes the class, so subsequence calls to this
     * constructor throw an exception.
     */
    function EnumValue(_description) {
        var _newTarget = this.constructor;
        this._description = _description;
        if ({}.hasOwnProperty.call(_newTarget, INITIALIZED)) {
            throw new Error('EnumValue classes can’t be instantiated individually');
        }
    }
    Object.defineProperty(EnumValue.prototype, "description", {
        /**
         * The description of the instance passed into the constructor - may be the
         * same as the propName.
         *
         * @returns {string} The description
         */
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    EnumValue.prototype.toString = function () {
        return this.constructor.name + "." + this.propName;
    };
    Object.defineProperty(EnumValue.prototype, "ordinal", {
        /**
         * Returns the index of the instance in the enum (0-based)
         *
         * @returns {number} The index of the instance in the enum (0-based)
         */
        get: function () {
            return this._ordinal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnumValue.prototype, "propName", {
        /**
         * Returns the property name used for this instance in the Enum.
         *
         * @returns {string} the property name used for this instance in the Enum
         */
        get: function () {
            return this._propName;
        },
        enumerable: true,
        configurable: true
    });
    return EnumValue;
}());
/**
 * This is an abstract class that is not intended to be used directly. Extend it
 * to turn your class into an enum (initialization is performed via
 * `this.initEnum()` within the constructor).
 */
var Enum = (function () {
    function Enum() {
    }
    /**
     * Set up the enum and close the class. This must be called after the
     * constructor to set up the logic.
     *
     * @param name The name that will be used for internal storage - must be
     * unique
     * @param theEnum The enum to process
     */
    Enum.initEnum = function (name, theEnum) {
        if (Enum.enumValues.has(theEnum.name)) {
            throw new Error("Duplicate name: " + theEnum.name);
        }
        var enumValues = this.enumValuesFromObject(theEnum);
        Object.freeze(theEnum);
        Enum.enumValues.set(theEnum.name, enumValues);
    };
    /**
     * Extract the enumValues from the Enum. We set the ordinal and propName
     * properties on the EnumValue. We also freeze the objects and lock the Enum
     * and EnumValue to prevent future instantiation.
     *
     * @param theEnum The enum to process
     * @returns {T[]} The array of EnumValues
     */
    Enum.enumValuesFromObject = function (theEnum) {
        var values = Object.getOwnPropertyNames(theEnum)
            .filter(function (propName) { return theEnum[propName] instanceof EnumValue; })
            .map(function (propName, index) {
            var enumValue = theEnum[propName];
            Object.defineProperty(enumValue, '_ordinal', {
                value: index,
                configurable: false,
                writable: false,
                enumerable: true
            });
            Object.defineProperty(enumValue, '_propName', {
                value: propName,
                configurable: false,
                writable: false,
                enumerable: true
            });
            Object.freeze(enumValue);
            return enumValue;
        });
        if (values.length) {
            values[0].constructor[INITIALIZED] = true;
        }
        var descriptions = values.map(function (value) { return value.description; });
        if (values.length !== this.unique(descriptions).length) {
            throw new Error('All descriptions must be unique for a given enum type.' +
                ("Instead, there are multiples in " + theEnum.name));
        }
        return values;
    };
    /**
     * Extract the unique values from an array. Based on
     * https://stackoverflow.com/a/23282057.
     */
    Enum.unique = function (values) {
        return values.filter(function (value, i) { return values.indexOf(value) === i; });
    };
    Enum.values = function (name) {
        var values = this.enumValues.get(name);
        return values ? values.slice() : [];
    };
    /**
     * Given the property name of an enum constant, return its value.
     *
     * @param propName The property name to search by
     * @returns {undefined|T} The matching instance
     */
    Enum.prototype.byPropName = function (propName) {
        return this.values.find(function (x) { return x.propName === propName; });
    };
    /**
     * Given the description of an enum constant, return its value.
     *
     * @param description The property name to search by
     * @returns {undefined|T} The matching instance
     */
    Enum.prototype.byDescription = function (description) {
        return this.values.find(function (x) { return x.description === description; });
    };
    Object.defineProperty(Enum.prototype, "values", {
        /**
         * Return a defensively-copied array of all the elements of the enum.
         *
         * @returns {T[]} The array of EnumValues
         */
        get: function () {
            return Enum.values(this.name);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a simple representation of the type.
     *
     * @returns {string} a simple representation of the type
     */
    Enum.prototype.toString = function () {
        return this.name;
    };
    /**
     * Set up the enum and close the class.
     *
     * @param name The name that will be used for internal storage - must be unique
     */
    Enum.prototype.initEnum = function (name) {
        this.name = name;
        Enum.initEnum(name, this);
    };
    Enum.enumValues = new Map();
    return Enum;
}());

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var isFunction_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;

});

unwrapExports(isFunction_1);

var isArray = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });

});

unwrapExports(isArray);
var isArray_1 = isArray.isArray;

var isObject_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isObject(x) {
    return x != null && typeof x === 'object';
}
exports.isObject = isObject;

});

unwrapExports(isObject_1);

var errorObject = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// typeof any so that it we don't have to cast when comparing a result to the error object
exports.errorObject = { e: {} };

});

unwrapExports(errorObject);

var tryCatch_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        errorObject.errorObject.e = e;
        return errorObject.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
exports.tryCatch = tryCatch;


});

unwrapExports(tryCatch_1);

var UnsubscriptionError_1 = createCommonjsModule(function (module, exports) {
"use strict";
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
var UnsubscriptionError = /** @class */ (function (_super) {
    __extends(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        var _this = _super.call(this) || this;
        _this.errors = errors;
        var err = Error.call(_this, errors ?
            errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '');
        _this.name = err.name = 'UnsubscriptionError';
        _this.stack = err.stack;
        _this.message = err.message;
        return _this;
    }
    return UnsubscriptionError;
}(Error));
exports.UnsubscriptionError = UnsubscriptionError;

});

unwrapExports(UnsubscriptionError_1);

var Subscription_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });






/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
var Subscription = /** @class */ (function () {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    function Subscription(unsubscribe) {
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        // null out _subscriptions first so any child subscriptions that attempt
        // to remove themselves from this subscription will noop
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        // if this._parent is null, then so is this._parents, and we
        // don't have to remove ourselves from any parent subscriptions.
        while (_parent) {
            _parent.remove(this);
            // if this._parents is null or index >= len,
            // then _parent is set to null, and the loop exits
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject.errorObject) {
                hasErrors = true;
                errors = errors || (errorObject.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ?
                    flattenUnsubscriptionErrors(errorObject.errorObject.e.errors) : [errorObject.errorObject.e]);
            }
        }
        if (isArray.isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject.errorObject.e;
                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
    /**
     * Adds a tear down to be called during the unsubscribe() of this
     * Subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    Subscription.prototype.add = function (teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (typeof subscription._addParent !== 'function' /* quack quack */) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.prototype._addParent = function (parent) {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        if (!_parent || _parent === parent) {
            // If we don't have a parent, or the new parent is the same as the
            // current parent, then set this._parent to the new parent.
            this._parent = parent;
        }
        else if (!_parents) {
            // If there's already one parent, but not multiple, allocate an Array to
            // store the rest of the parent Subscriptions.
            this._parents = [parent];
        }
        else if (_parents.indexOf(parent) === -1) {
            // Only add the new parent to the _parents list if it's not already there.
            _parents.push(parent);
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
exports.Subscription = Subscription;
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
}

});

unwrapExports(Subscription_1);

var Observer = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empty = {
    closed: true,
    next: function (value) { },
    error: function (err) { throw err; },
    complete: function () { }
};

});

unwrapExports(Observer);

var root = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// CommonJS / Node have global context exposed as "global" variable.
// We don't want to include the whole node.d.ts this this compilation unit so we'll just fake
// the global "global" var for now.
var __window = typeof window !== 'undefined' && window;
var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope && self;
var __global = typeof commonjsGlobal !== 'undefined' && commonjsGlobal;
var _root = __window || __global || __self;
exports.root = _root;
// Workaround Closure Compiler restriction: The body of a goog.module cannot use throw.
// This is needed when used with angular/tsickle which inserts a goog.module statement.
// Wrap in IIFE
(function () {
    if (!_root) {
        throw new Error('RxJS could not find any global context (window, self, global)');
    }
})();

});

unwrapExports(root);

var rxSubscriber = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var Symbol = root.root.Symbol;
exports.rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
    Symbol.for('rxSubscriber') : '@@rxSubscriber';
/**
 * @deprecated use rxSubscriber instead
 */
exports.$$rxSubscriber = exports.rxSubscriber;

});

unwrapExports(rxSubscriber);

var Subscriber_1 = createCommonjsModule(function (module, exports) {
"use strict";
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });




/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
var Subscriber = /** @class */ (function (_super) {
    __extends(Subscriber, _super);
    /**
     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
     * defined Observer or a `next` callback function.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     */
    function Subscriber(destinationOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this.syncErrorValue = null;
        _this.syncErrorThrown = false;
        _this.syncErrorThrowable = false;
        _this.isStopped = false;
        switch (arguments.length) {
            case 0:
                _this.destination = Observer.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    _this.destination = Observer.empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        _this.destination = destinationOrNext;
                        _this.destination.add(_this);
                    }
                    else {
                        _this.syncErrorThrowable = true;
                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
                    }
                    break;
                }
            default:
                _this.syncErrorThrowable = true;
                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                break;
        }
        return _this;
    }
    Subscriber.prototype[rxSubscriber.rxSubscriber] = function () { return this; };
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     */
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached {@link Error}. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        return this;
    };
    return Subscriber;
}(Subscription_1.Subscription));
exports.Subscriber = Subscriber;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SafeSubscriber = /** @class */ (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this._parentSubscriber = _parentSubscriber;
        var next;
        var context = _this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== Observer.empty) {
                context = Object.create(observerOrNext);
                if (isFunction_1.isFunction(context.unsubscribe)) {
                    _this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = _this.unsubscribe.bind(_this);
            }
        }
        _this._context = context;
        _this._next = next;
        _this._error = error;
        _this._complete = complete;
        return _this;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._error) {
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            }
            else {
                _parentSubscriber.syncErrorValue = err;
                _parentSubscriber.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function () { return _this._complete.call(_this._context); };
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            throw err;
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));

});

unwrapExports(Subscriber_1);

var map_1 = createCommonjsModule(function (module, exports) {
"use strict";
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Applies a given `project` function to each value emitted by the source
 * Observable, and emits the resulting values as an Observable.
 *
 * <span class="informal">Like [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
 * it passes each source value through a transformation function to get
 * corresponding output values.</span>
 *
 * <img src="./img/map.png" width="100%">
 *
 * Similar to the well known `Array.prototype.map` function, this operator
 * applies a projection to each value and emits that projection in the output
 * Observable.
 *
 * @example <caption>Map every click to the clientX position of that click</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var positions = clicks.map(ev => ev.clientX);
 * positions.subscribe(x => console.log(x));
 *
 * @see {@link mapTo}
 * @see {@link pluck}
 *
 * @param {function(value: T, index: number): R} project The function to apply
 * to each `value` emitted by the source Observable. The `index` parameter is
 * the number `i` for the i-th emission that has happened since the
 * subscription, starting from the number `0`.
 * @param {any} [thisArg] An optional argument to define what `this` is in the
 * `project` function.
 * @return {Observable<R>} An Observable that emits the values from the source
 * Observable transformed by the given `project` function.
 * @method map
 * @owner Observable
 */
function map(project, thisArg) {
    return function mapOperation(source) {
        if (typeof project !== 'function') {
            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
        }
        return source.lift(new MapOperator(project, thisArg));
    };
}
exports.map = map;
var MapOperator = /** @class */ (function () {
    function MapOperator(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
    }
    MapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
    };
    return MapOperator;
}());
exports.MapOperator = MapOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MapSubscriber = /** @class */ (function (_super) {
    __extends(MapSubscriber, _super);
    function MapSubscriber(destination, project, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.count = 0;
        _this.thisArg = thisArg || _this;
        return _this;
    }
    // NOTE: This looks unoptimized, but it's actually purposefully NOT
    // using try/catch optimizations.
    MapSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.project.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return MapSubscriber;
}(Subscriber_1.Subscriber));

});

unwrapExports(map_1);
var map_2 = map_1.map;

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * A version of Action that uses generics to express the type of the payload.
 */
var TypedAction = /** @class */ (function () {
    function TypedAction(type, payload) {
        this.type = type;
        this.payload = payload;
    }
    return TypedAction;
}());
function matches(action) {
    var actions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        actions[_i - 1] = arguments[_i];
    }
    return !!actions.find(function (actionEVal) { return action.type === actionEVal.type; });
}
/**
 * The abstract base for the action enum instances.
 */
var ActionEnumValue = /** @class */ (function (_super) {
    __extends(ActionEnumValue, _super);
    function ActionEnumValue(_name) {
        return _super.call(this, _name) || this;
    }
    /**
     * Create the Action that contains the optional payload.
     */
    ActionEnumValue.prototype.toAction = function (payload) {
        return new TypedAction(this.description, payload);
    };
    /**
     * Get the payload from an action of this type.
     */
    ActionEnumValue.prototype.toPayload = function (action) {
        return action.payload;
    };
    /**
     * Insert a map to payload operation into an observable chain
     */
    ActionEnumValue.prototype.map = function (observable) {
        return observable.pipe(map_2(this.toPayload));
    };
    /**
     * Create an observable of the payload of actions of this type (for creating effects)
     *
     * ex:
     *   @Effect() getHero$ = HeroActionEnum.GET_HERO.of(this.actions$)
     *       .switchMap(id => this.svc.getHero(id))
     *       .map(hero => HeroActionEnum.GET_HERO_SUCCESS.toAction(hero))
     *       .catch(handleError);
     */
    ActionEnumValue.prototype.of = function (actions$) {
        return this.map(actions$.ofType(this.type));
    };
    /**
     * For use in reducer. Acts as both a Typescript type guard and a means for
     * determining which reducer code to execute.
     */
    ActionEnumValue.prototype.matches = function (action) {
        var otherActions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            otherActions[_i - 1] = arguments[_i];
        }
        return action.type === this.type || matches.apply(void 0, [action].concat(otherActions));
    };
    Object.defineProperty(ActionEnumValue.prototype, "type", {
        get: function () {
            return this.description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionEnumValue.prototype, "fullName", {
        get: function () {
            return "[" + this.constructor.name + "] " + this.description;
        },
        enumerable: true,
        configurable: true
    });
    return ActionEnumValue;
}(EnumValue));
/**
 * The abstract base for the action enum types.
 */
var ActionEnum = /** @class */ (function (_super) {
    __extends(ActionEnum, _super);
    function ActionEnum() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Create an observable of the payload of actions of this type (for creating effects)
     *
     * ex:
     *   @Effect() getHero$ = HeroActionEnum.of(this.actions$, HeroActionEnum.ADD_HERO, HeroActionEnum.SAVE_HERO)
     *       .switchMap(hero => this.svc.saveHero(hero)) // type-safe
     *       .map(hero => HeroActionEnum.UPDATE_HERO_SUCCESS.toAction(hero))
     *       .catch(handleError);
     */
    ActionEnum.of = function (actions$) {
        var actions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            actions[_i - 1] = arguments[_i];
        }
        var observable = actions$.ofType.apply(actions$, actions.map(function (action) { return action.type; }));
        return observable.pipe(map_2(function (action) { return action.payload; }));
    };
    /**
     * For use in reducer. Acts as both a Typescript type guard and a means for
     * determining which reducer code to execute.
     */
    ActionEnum.matches = function (action) {
        var actions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            actions[_i - 1] = arguments[_i];
        }
        return matches.apply(void 0, [action].concat(actions));
    };
    /**
     * Create an observable of the payload of actions of this type (for creating effects)
     *
     * ex:
     *   @Effect() getHero$ = HeroActionEnum.of(this.actions$, HeroActionEnum.ADD_HERO, HeroActionEnum.SAVE_HERO)
     *       .switchMap(hero => this.svc.saveHero(hero)) // type-safe
     *       .map(hero => HeroActionEnum.UPDATE_HERO_SUCCESS.toAction(hero))
     *       .catch(handleError);
     */
    ActionEnum.prototype.of = function (actions$) {
        var actions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            actions[_i - 1] = arguments[_i];
        }
        return ActionEnum.of.apply(ActionEnum, [actions$].concat(actions));
    };
    /**
     * For use in reducer. Acts as both a Typescript type guard and a means for
     * determining which reducer code to execute.
     */
    ActionEnum.prototype.matches = function (action) {
        var actions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            actions[_i - 1] = arguments[_i];
        }
        return matches.apply(void 0, [action].concat(actions));
    };
    ActionEnum.prototype.fromAction = function (action) {
        return this.byDescription(action.type);
    };
    return ActionEnum;
}(Enum));

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function simplePropertyReducer(propName) {
    return function (state, action) {
        return Object.assign({}, state, (_a = {}, _a[propName] = action.payload, _a));
        var _a;
    };
}
function extractDescriptions(action) {
    if (isArray_1(action)) {
        return action.map(function (value) { return value.fullName; }).join(';');
    }
    else {
        return action.fullName;
    }
}
var ReducerEnumValue = /** @class */ (function (_super) {
    __extends$1(ReducerEnumValue, _super);
    function ReducerEnumValue(action, _reduce) {
        var _this = 
        // if there's only one action value, use its fullName. Otherwise, concat
        // the fullName of all the action values.
        _super.call(this, extractDescriptions(action)) || this;
        _this._reduce = _reduce;
        // accumulate the action types to check against when reducing
        _this.actions = isArray_1(action) ? action : [action];
        return _this;
    }
    Object.defineProperty(ReducerEnumValue.prototype, "reduce", {
        get: function () {
            return this._reduce;
        },
        enumerable: true,
        configurable: true
    });
    return ReducerEnumValue;
}(EnumValue));
var ReducerEnum = /** @class */ (function (_super) {
    __extends$1(ReducerEnum, _super);
    function ReducerEnum(initialState) {
        var _this = _super.call(this) || this;
        _this.initialState = initialState;
        return _this;
    }
    ReducerEnum.prototype.reducer = function () {
        var _this = this;
        // Find the appropriate enum instance for the action, if any, and return
        // its reducer.
        return function (state, action) {
            if (state === void 0) { state = _this.initialState; }
            var reducerInstance = _this.fromAction(action);
            return reducerInstance ? reducerInstance.reduce(state, action) : state;
        };
    };
    ReducerEnum.prototype.initEnum = function (name) {
        _super.prototype.initEnum.call(this, name);
        // ensure that each enum is used at most once per reducer
        var allActions = new Set();
        this.values.forEach(function (value) {
            value.actions.forEach(function (action) {
                if (allActions.has(action)) {
                    var message = "Action " + action.fullName + " is used multiple times in " + name + " - this is not allowed";
                    throw new Error(message);
                }
                else {
                    allActions.add(action);
                }
            });
        });
    };
    ReducerEnum.prototype.fromAction = function (action) {
        // look through all of the reducer enum instances to find one that has the
        // current action in its array of actions
        return this.values.find(function (value) {
            return value.actions.some(function (type) { return type.description === action.type; });
        });
    };
    return ReducerEnum;
}(Enum));

export { TypedAction, ActionEnumValue, ActionEnum, simplePropertyReducer, ReducerEnumValue, ReducerEnum };
//# sourceMappingURL=ngrx-enums.es5.js.map
