import { Model, model, prop } from 'mobx-keystone';
import { UiStore } from '../../ui/utils/UiStore';
import { Portfolio } from './Portfolio';
import { AvailableStocks } from './AvailableStocks';

@model('Store')
export class Store extends Model({
  ui: prop<UiStore>(() => new UiStore()),
  portfolio: prop<Portfolio>(() => new Portfolio()),
  availableStocks: prop<AvailableStocks>(() => new AvailableStocks([])),
}) {
}

// import { makeAutoObservable } from 'mobx';
// import { UiStore } from '../../ui/utils/UiStore';
// import { Portfolio } from './Portfolio';
// import AvailableStocks from './AvailableStocks';
//
// /** The main store that contains the sub-stores that hold the state of the application. */
// export class Store {
//
//   ui: UiStore = new UiStore();
//   portfolio: Portfolio = new Portfolio();
//   availableStocks: AvailableStocks = new AvailableStocks([]);
//
//   constructor() {
//     makeAutoObservable(this);
//   }
// }
