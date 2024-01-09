// TODO: REMOVE
// import React from 'react';
// import {Text} from 'react-native';
// import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
// import {store} from '../../../../inject';
// import CircleButton from '../../../utils/CircleButton';
// import {Space} from '../../../theme/Space';
// import {Row, Spacer} from '../../../utils/Layout';
// import {Font} from '../../../theme/Font';
//
// export const CashBalance_Mixed = () => {
//
//     const $cashBalance: ViewStyle = {paddingTop: 16, paddingLeft: 16, paddingRight: 8, alignItems: 'center'};
//
//     return (
//         <Row style={$cashBalance}>
//
//             <Text style={Font.medium()}>{`Cash Balance: ${store.portfolio.cashBalance}`}</Text>
//
//             <Space.px8/>
//             <Spacer/>
//
//             <CircleButton
//                 color={'white'}
//                 backgroundColor={'#388E3C'}
//                 icon={'add'}
//                 onPress={() => store.portfolio.cashBalance.add(100)}
//             />
//
//             <Space.px4/>
//
//             <CircleButton
//                 color={'white'}
//                 backgroundColor={'#C62828'}
//                 icon={'remove'}
//                 onPress={() => store.portfolio.cashBalance.remove(100)}
//             />
//
//         </Row>
//     );
// };
//
//
