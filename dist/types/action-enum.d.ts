import { Enum, EnumValue } from 'ts-enums';
import { Action } from '@ngrx/store';
/**
 * A version of Action that uses generics to express the type of the payload.
 */
export declare class TypedAction<T> implements Action {
    type: string;
    payload: T | undefined;
    constructor(type: string, payload?: T | undefined);
}
/**
 * The abstract base for the action enum instances.
 */
export declare abstract class ActionEnumValue<T> extends EnumValue {
    constructor(_name: string);
    toAction<T>(payload?: T): TypedAction<T>;
    readonly type: string;
    readonly fullName: string;
}
/**
 * The abstract base for the action enum types.
 */
export declare abstract class ActionEnum<V extends ActionEnumValue<any>> extends Enum<V> {
    fromAction(action: TypedAction<any>): V | undefined;
}
