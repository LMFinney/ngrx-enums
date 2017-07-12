import {Enum, EnumValue} from 'ts-enums';
import {Action} from '@ngrx/store';

/**
 * A version of Action that uses generics to express the type of the payload.
 */
export class TypedAction<T> implements Action {
  constructor(public type: string, public payload?: T) {
  }
}

/**
 * The abstract base for the action enum instances.
 */
export abstract class ActionEnumValue<T> extends EnumValue {
  constructor(_name: string) {
    super(_name);
  }

  // Create the Action that contains the optional payload.
  toAction<T>(payload?: T): TypedAction<T> {
    return new TypedAction(this.description, payload);
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
export abstract class ActionEnum<V extends ActionEnumValue<any>> extends Enum<V> {
  fromAction(action: TypedAction<any>): V | undefined {
    return this.byDescription(action.type);
  }
}
