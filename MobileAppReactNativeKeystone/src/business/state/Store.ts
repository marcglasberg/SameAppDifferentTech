import { Model, model, prop } from 'mobx-keystone';
import { UiStore } from '../../ui/utils/UiStore';
import { Portfolio } from './Portfolio';
import { AvailableStocks } from './AvailableStocks';

@model('Store')
export class Store extends Model({
  ui: prop<UiStore>(() => new UiStore({})),
  portfolio: prop<Portfolio>(() => new Portfolio({})),
  availableStocks: prop<AvailableStocks>(() => new AvailableStocks({ list: [] }))
}) {
}

