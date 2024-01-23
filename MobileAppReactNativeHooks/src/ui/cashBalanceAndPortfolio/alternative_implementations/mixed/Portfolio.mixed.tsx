// TODO: REMOVE
// import React from 'react';
// import {Text} from 'react-native';
// import {store} from '../../../../inject';
// import { Stock } from '../../../../business/state/Stock';
// import {Space} from '../../../theme/Space';
// import {Column, Row} from '../../../utils/Layout';
// import {Font} from '../../../theme/Font';
//
// export const Portfolio_Mixed = () => {
//
//     return (
//         <Column style={{paddingVertical: 16, paddingHorizontal: 16, alignItems: 'flex-start'}}>
//
//             <Row>
//                 <Text style={Font.medium()}>Portfolio:</Text>
//                 <Space.px8/>
//                 {store.portfolio.isEmpty && <Text style={Font.medium()}>—</Text>}
//             </Row>
//
//             <Space.px4/>
//
//             {store.portfolio.stocks.map((stock, index) => (
//                 <StockInPortfolio key={index} stock={stock}/>
//             ))}
//
//         </Column>
//     );
// };
//
// const StockInPortfolio: React.FC<{ stock: Stock }>
//     = ({stock}) => {
//
//     return (
//         <Text style={{...Font.small(), paddingTop: 2}}>
//             {`${stock.ticker} (${stock.howManyShares} shares @ US$ ${stock.averagePriceStr})`}
//         </Text>
//     );
// };
