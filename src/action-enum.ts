import {Enum, EnumValue} from 'ts-enums';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'

export interface Actions {
  ofType(...allowedTypes: string[]): Observable<TypedAction<any>>;
}

/**
 * A version of Action that uses generics to express the type of the payload.
 */
export class TypedAction<T> implements Action {
  constructor(public type: string, public payload?: T) {}
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
  fromAction(action: TypedAction<T>): T | undefined {
    return action.payload;
  }

  /**
   * Insert a map to payload operation into an observable chain
   */
  map(observable: Observable<TypedAction<T>>): Observable<T | undefined> {
    return observable.map(this.fromAction);
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
  fromAction(action: TypedAction<any>): V | undefined {
    return this.byDescription(action.type);
  }
}
