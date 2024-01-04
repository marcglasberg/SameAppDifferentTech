import { Model, model, modelAction, prop } from 'mobx-keystone';
import { runInAction } from 'mobx';
import { AvailableStock } from './AvailableStock';
import { dao } from '../../inject';
import { print } from '../utils/utils';

@model('AvailableStocks')
export class AvailableStocks extends Model({
  list: prop<AvailableStock[]>(() => [])
}) {

  @modelAction
  setList(list: AvailableStock[]): void {
    this.list = list;
  }

  findBySymbolOrNull(ticker: string): AvailableStock | null {
    const stock = this.list.find(s => s.ticker === ticker);
    return !stock ? null : stock;
  }

  findBySymbol(ticker: string): AvailableStock {
    const stock = this.findBySymbolOrNull(ticker);
    if (!stock) throw new Error('Stock not found: ' + ticker);
    return stock;
  }

  forEach(callback: (availableStock: AvailableStock) => void): void {
    this.list.forEach(callback);
  }

  async loadAvailableStocks(): Promise<void> {
    const newStocks = await dao.readAvailableStocks();

    runInAction(() => {
      this.setList(newStocks);
    });
  }

  startListeningToStockPriceUpdates() {
    print('Listening to stock price updates...');

    dao.listenToStockPriceUpdates(
      (ticker: string, price: number) => {
        let availableStock = this.findBySymbolOrNull(ticker);
        if (availableStock) {
          availableStock.setCurrentPrice(price);
          print('Updated ' + ticker + ' price to ' + price + '.');
        }
      }
    );
  }

  stopListeningToStockPriceUpdates() {
    print('Stopped listening to stock price updates.');

    dao.stopStockPriceUpdates();
  }

  toString(): string {
    return `AvailableStocks: ${this.list.length === 0 ? 'empty' : this.list}`;
  }
}
