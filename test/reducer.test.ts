import {ActionEnum, ActionEnumValue, TypedAction} from '../src/action-enum';
import {
  ReducerEnum,
  ReducerEnumValue,
  ReducerFunction,
  simplePropertyReducer
} from '../src/reducer-enum';

class LayoutAction<T> extends ActionEnumValue<T> {
  constructor(name: string) {
    super(name);
  }
}

class LayoutActionEnumType extends ActionEnum<LayoutAction<any>> {
  OPEN_SIDENAV = new LayoutAction<void>('[Layout] Open Sidenav');
  OPEN_SIDENAV_ALSO = new LayoutAction<void>('[Layout] Open Sidenav Also');
  SET_SIDENAV = new LayoutAction<boolean>('[Layout] Set Sidenav');

  constructor() {
    super();
    this.initEnum('layoutActions');
  }
}

const LayoutActionEnum = new LayoutActionEnumType();

interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false
};

describe('enum version', () => {
  class LayoutReducer<T> extends ReducerEnumValue<State, T> {
    constructor(
      action: ActionEnumValue<T> | ActionEnumValue<T>[],
      reduce: ReducerFunction<State, T>
    ) {
      super(action, reduce);
    }
  }

  class LayoutReducerEnumType extends ReducerEnum<LayoutReducer<any>, State> {
    // a simple reducer that always sets the same value
    // this shows how to respond to multiple actions
    // (fall-through in switch)
    OPEN_SIDENAV = new LayoutReducer<void>(
      [LayoutActionEnum.OPEN_SIDENAV, LayoutActionEnum.OPEN_SIDENAV_ALSO],
      (state: State) => ({showSidenav: true})
    );
    // a reducer that accepts a value and copies it as a property into state
    SET_SIDENAV = new LayoutReducer<boolean>(
      LayoutActionEnum.SET_SIDENAV,
      simplePropertyReducer<State, boolean>('showSidenav')
    );

    constructor() {
      super(initialState);
      this.initEnum('layoutReducers');
    }
  }

  const LayoutReducerEnum = new LayoutReducerEnumType();

  describe('OPEN_SIDENAV', () => {
    it('should set the value', () => {
      let state: State = LayoutReducerEnum.OPEN_SIDENAV.reduce(
        initialState,
        LayoutActionEnum.OPEN_SIDENAV.toAction()
      );

      expect(state.showSidenav).toBe(true);
    });
  });

  describe('SET_SIDENAV', () => {
    it('should set the value', () => {
      let state: State = LayoutReducerEnum.SET_SIDENAV.reduce(
        initialState,
        LayoutActionEnum.SET_SIDENAV.toAction(true)
      );

      expect(state.showSidenav).toBe(true);

      state = LayoutReducerEnum.SET_SIDENAV.reduce(
        state,
        LayoutActionEnum.SET_SIDENAV.toAction(false)
      );

      expect(state.showSidenav).toBe(false);
    });
  });
});

describe('Matches version', () => {
  function layoutReducer(
    state = initialState,
    action: TypedAction<any>
  ): State {
    if (
      LayoutActionEnum.matches(
        action,
        LayoutActionEnum.OPEN_SIDENAV,
        LayoutActionEnum.OPEN_SIDENAV_ALSO
      )
    ) {
      // a simple reducer that always sets the same value
      // this shows how to respond to multiple actions
      // (fall-through in switch)
      return {...state, showSidenav: true};
    } else if (LayoutActionEnum.SET_SIDENAV.matches(action)) {
      // a reducer that accepts a value and copies it as a property into state
      return simplePropertyReducer<State, boolean>('showSidenav')(
        state,
        action
      );
    } else {
      return state;
    }
  }

  describe('OPEN_SIDENAV', () => {
    it('should set the value', () => {
      let state: State = layoutReducer(
        initialState,
        LayoutActionEnum.OPEN_SIDENAV.toAction()
      );

      expect(state.showSidenav).toBe(true);
    });
  });

  describe('SET_SIDENAV', () => {
    it('should set the value', () => {
      let state: State = layoutReducer(
        initialState,
        LayoutActionEnum.SET_SIDENAV.toAction(true)
      );

      expect(state.showSidenav).toBe(true);

      state = layoutReducer(
        state,
        LayoutActionEnum.SET_SIDENAV.toAction(false)
      );

      expect(state.showSidenav).toBe(false);
    });
  });
});
