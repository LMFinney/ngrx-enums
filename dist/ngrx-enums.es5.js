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
var TypedAction = (function () {
    function TypedAction(type, payload) {
        this.type = type;
        this.payload = payload;
    }
    return TypedAction;
}());
/**
 * The abstract base for the action enum instances.
 */
var ActionEnumValue = (function (_super) {
    __extends(ActionEnumValue, _super);
    function ActionEnumValue(_name) {
        return _super.call(this, _name) || this;
    }
    // Create the Action that contains the optional payload.
    ActionEnumValue.prototype.toAction = function (payload) {
        return new TypedAction(this.description, payload);
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
var ActionEnum = (function (_super) {
    __extends(ActionEnum, _super);
    function ActionEnum() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActionEnum.prototype.fromAction = function (action) {
        return this.byDescription(action.type);
    };
    return ActionEnum;
}(Enum));

var isArray_1 = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });

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
var ReducerEnumValue = (function (_super) {
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
var ReducerEnum = (function (_super) {
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
