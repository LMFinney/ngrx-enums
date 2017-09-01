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
    /**
     * For use in reducer. Acts as both a Typescript type guard and a means for
     * determining which reducer code to execute.
     */
    matches(action: TypedAction<any>): action is TypedAction<T>;
    readonly type: string;
    readonly fullName: string;
}
/**
 * The abstract base for the action enum types.
 */
export declare abstract class ActionEnum<V extends ActionEnumValue<any>> extends Enum<V> {
    /**
     * Create an observable of the payload of actions of this type (for creating effects)
     *
     * ex:
     *   @Effect() getHero$ = HeroActionEnum.of(this.actions$, HeroActionEnum.ADD_HERO, HeroActionEnum.SAVE_HERO)
     *       .switchMap(hero => this.svc.saveHero(hero)) // type-safe
     *       .map(hero => HeroActionEnum.UPDATE_HERO_SUCCESS.toAction(hero))
     *       .catch(handleError);
     */
    static of<T>(actions$: Actions, ...actions: ActionEnumValue<T>[]): Observable<T | undefined>;
    /**
     * For use in reducer. Acts as both a Typescript type guard and a means for
     * determining which reducer code to execute.
     */
    static matches<T>(action: TypedAction<T>, ...actions: ActionEnumValue<T>[]): action is TypedAction<T>;
    /**
     * Create an observable of the payload of actions of this type (for creating effects)
     *
     * ex:
     *   @Effect() getHero$ = HeroActionEnum.of(this.actions$, HeroActionEnum.ADD_HERO, HeroActionEnum.SAVE_HERO)
     *       .switchMap(hero => this.svc.saveHero(hero)) // type-safe
     *       .map(hero => HeroActionEnum.UPDATE_HERO_SUCCESS.toAction(hero))
     *       .catch(handleError);
     */
    of<T>(actions$: Actions, ...actions: ActionEnumValue<T>[]): Observable<T | undefined>;
    /**
     * For use in reducer. Acts as both a Typescript type guard and a means for
     * determining which reducer code to execute.
     */
    matches<T>(action: TypedAction<T>, ...actions: ActionEnumValue<T>[]): action is TypedAction<T>;
    fromAction(action: TypedAction<any>): V | undefined;
}
