import {ActionEnum, ActionEnumValue} from '../src/action-enum';
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
  OPEN_SIDENAV: LayoutAction<void> = new LayoutAction<void>(
    '[Layout] Open Sidenav'
  );
  SET_SIDENAV: LayoutAction<boolean> = new LayoutAction<boolean>(
    '[Layout] Set Sidenav'
  );

  constructor() {
    super();
    this.initEnum('layoutActions');
  }
}

const LayoutActionEnum: LayoutActionEnumType = new LayoutActionEnumType();

interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false
};

class LayoutReducer<T> extends ReducerEnumValue<State, T> {
  constructor(action: ActionEnumValue<T>, reduce: ReducerFunction<State, T>) {
    super(action, reduce);
  }
}

class LayoutReducerEnumType extends ReducerEnum<LayoutReducer<any>, State> {
  // a simple reducer that always sets the same value
  OPEN_SIDENAV: LayoutReducer<void> = new LayoutReducer<
    void
  >(LayoutActionEnum.OPEN_SIDENAV, (state: State) => ({showSidenav: true}));
  // a reducer that accepts a value and copies it as a property into state
  SET_SIDENAV: LayoutReducer<boolean> = new LayoutReducer<boolean>(
    LayoutActionEnum.SET_SIDENAV,
    simplePropertyReducer<State, boolean>('showSidenav')
  );

  constructor() {
    super(initialState);
    this.initEnum('layoutReducers');
  }
}

const LayoutReducerEnum: LayoutReducerEnumType = new LayoutReducerEnumType();

describe('Basic test', () => {
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
