import { ReduxAction } from './AsyncRedux/ReduxAction.ts';
import { State } from './state.ts';

export abstract class Action extends ReduxAction<State> {
}


