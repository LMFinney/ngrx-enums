import {Enum, EnumValue} from 'ts-enums';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators/map';

export interface Actions {
  ofType(...allowedTypes: string[]): Observable<TypedAction<any>>;
}

/**
 * A version of Action that uses generics to express the type of the payload.
 */
export class TypedAction<T> implements Action {
  constructor(public type: string, public payload?: T) {}
}

function matches<T>(
  action: TypedAction<T>,
  ...actions: ActionEnumValue<T>[]
): action is TypedAction<T> {
  return !!actions.find(
    (actionEVal: ActionEnumValue<T>) => action.type === actionEVal.type
  );
}

/**
 * The abstract base for the action enum instances.
 */
export abstract class ActionEnumValue<T> extends EnumValue {
  constructor(_name: string) {
    super(_name);
  }

  /**
   * Create the Action that contains the optional payload.
   */
  toAction(payload?: T): TypedAction<T> {
    return new TypedAction(this.description, payload);
  }

  /**
   * Get the payload from an action of this type.
   */
  toPayload(action: TypedAction<T>): T | undefined {
    return action.payload;
  }

  /**
   * Insert a map to payload operation into an observable chain
   */
  map(observable: Observable<TypedAction<T>>): Observable<T | undefined> {
    return observable.pipe(map(this.toPayload));
  }

  /**
   * Create an observable of the payload of actions of this type (for creating effects)
   *
   * ex:
   *   @Effect() getHero$ = HeroActionEnum.GET_HERO.of(this.actions$)
   *       .switchMap(id => this.svc.getHero(id))
   *       .map(hero => HeroActionEnum.GET_HERO_SUCCESS.toAction(hero))
   *       .catch(handleError);
   */
  of(actions$: Actions): Observable<T | undefined> {
    return this.map(actions$.ofType(this.type));
  }

  /**
   * For use in reducer. Acts as both a Typescript type guard and a means for
   * determining which reducer code to execute.
   */
  matches(
    action: TypedAction<any>,
    ...otherActions: ActionEnumValue<T>[]
  ): action is TypedAction<T> {
    return action.type === this.type || matches(action, ...otherActions);
  }

  get type(): string {
    return this.description;
  }

  get fullName(): string {
    return `[${this.constructor.name}] ${this.description}`;
  }
}

/**
 * The abstract base for the action enum types.
 */
export abstract class ActionEnum<V extends ActionEnumValue<any>> extends Enum<
  V
> {
  /**
   * Create an observable of the payload of actions of this type (for creating effects)
   *
   * ex:
   *   @Effect() getHero$ = HeroActionEnum.of(this.actions$, HeroActionEnum.ADD_HERO, HeroActionEnum.SAVE_HERO)
   *       .switchMap(hero => this.svc.saveHero(hero)) // type-safe
   *       .map(hero => HeroActionEnum.UPDATE_HERO_SUCCESS.toAction(hero))
   *       .catch(handleError);
   */
  static of<T>(
    actions$: Actions,
    ...actions: ActionEnumValue<T>[]
  ): Observable<T | undefined> {
    const observable = actions$.ofType(
      ...actions.map((action: ActionEnumValue<T>) => action.type)
    );
    return observable.pipe(map((action: TypedAction<T>) => action.payload));
  }

  /**
   * For use in reducer. Acts as both a Typescript type guard and a means for
   * determining which reducer code to execute.
   */
  static matches<T>(
    action: TypedAction<T>,
    ...actions: ActionEnumValue<T>[]
  ): action is TypedAction<T> {
    return matches(action, ...actions);
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
  of<T>(
    actions$: Actions,
    ...actions: ActionEnumValue<T>[]
  ): Observable<T | undefined> {
    return ActionEnum.of(actions$, ...actions);
  }

  /**
   * For use in reducer. Acts as both a Typescript type guard and a means for
   * determining which reducer code to execute.
   */
  matches<T>(
    action: TypedAction<T>,
    ...actions: ActionEnumValue<T>[]
  ): action is TypedAction<T> {
    return matches(action, ...actions);
  }

  fromAction(action: TypedAction<any>): V | undefined {
    return this.byDescription(action.type);
  }
}
