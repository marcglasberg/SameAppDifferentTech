import { makeAutoObservable } from 'mobx';
import { UiStore } from '../../ui/utils/UiStore';
import Portfolio from './Portfolio';
import AvailableStocks from './AvailableStocks';

/** The main store that contains the sub-stores that hold the state of the application. */
export class Store {

  ui: UiStore = new UiStore();
  portfolio: Portfolio = new Portfolio();
  availableStocks: AvailableStocks = new AvailableStocks([]);

  constructor() {
    makeAutoObservable(this);
  }
}
