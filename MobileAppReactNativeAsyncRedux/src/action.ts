import { ReduxAction } from './AsyncRedux/ReduxAction.ts';
import { State } from './State.ts';

export abstract class Action extends ReduxAction<State> {
}


