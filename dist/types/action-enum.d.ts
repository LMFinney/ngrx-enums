import { Enum, EnumValue } from 'ts-enums';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
export interface Actions {
    ofType(...allowedTypes: string[]): Observable<TypedAction<any>>;
}
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
    /**
     * Create the Action that contains the optional payload.
     */
    toAction(payload?: T): TypedAction<T>;
    /**
     * Get the payload from an action of this type.
     */
    toPayload(action: TypedAction<T>): T | undefined;
    /**
     * Insert a map to payload operation into an observable chain
     */
    map(observable: Observable<TypedAction<T>>): Observable<T | undefined>;
    /**
     * Create an observable of the payload of actions of this type (for creating effects)
     *
     * ex:
     *   @Effect() getHero$ = HeroActionEnum.GET_HERO.of(this.actions$)
     *       .switchMap(id => this.svc.getHero(id))
     *       .map(hero => HeroActionEnum.GET_HERO_SUCCESS.toAction(hero))
     *       .catch(handleError);
     */
    of(actions$: Actions): Observable<T | undefined>;
    readonly type: string;
    readonly fullName: string;
}
/**
 * The abstract base for the action enum types.
 */
export declare abstract class ActionEnum<V extends ActionEnumValue<any>> extends Enum<V> {
    static of<T>(actions$: Actions, ...actions: ActionEnumValue<T>[]): Observable<T | undefined>;
    of<T>(actions$: Actions, ...actions: ActionEnumValue<T>[]): Observable<T | undefined>;
    fromAction(action: TypedAction<any>): V | undefined;
}
