import { ActionReducer } from '@ngrx/store';
import { Enum, EnumValue } from 'ts-enums';
import { ActionEnumValue, TypedAction } from './action-enum';
export declare type ReducerFunction<S, T> = (state: S, action: TypedAction<T>) => S;
export declare function simplePropertyReducer<S, T>(propName: string): ReducerFunction<S, T>;
export declare abstract class ReducerEnumValue<S, T> extends EnumValue {
    private _reduce;
    readonly actions: ActionEnumValue<T>[];
    constructor(action: ActionEnumValue<T> | ActionEnumValue<T>[], _reduce: ReducerFunction<S, T>);
    readonly reduce: ReducerFunction<S, T>;
}
export declare abstract class ReducerEnum<V extends ReducerEnumValue<S, any>, S> extends Enum<V> {
    private initialState;
    constructor(initialState: S);
    reducer<T>(): ActionReducer<S>;
    protected initEnum(name: string): void;
    private fromAction(action);
}
