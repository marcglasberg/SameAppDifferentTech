import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/business/infra/basic/screen.dart';
import 'package:mobile_app_flutter_redux/business/state/app_state.dart';
import 'package:mobile_app_flutter_redux/business/utils/app_vm_factory.dart';
import 'package:mobile_app_flutter_redux/client/configuration_screen/configuration_screen.dart';
import 'package:mobile_app_flutter_redux/client/portfolio_and_cash_balance/portfolio_and_cash_balance_screen.dart';
import 'package:mobile_app_flutter_redux/client/sign_up/sign_up_screen.dart';

enum ScreenChoice {
  signup,
  configuration,
  portfolioAndCashBalance;
}

/// This would be extended in a real app, to return different first screens depending on
/// the situation. For example, if the user is not logged in, this could return a login
/// screen instead.
///
/// An alternative would be to choose the first screen directly in [AppRoutes],
/// and from there navigate with the router. This is specially important for web apps,
/// because we want the screen to display the URL, so that the user can bookmark it.
///
/// In this simplified demo app I'm showing the Configuration screen from here.
/// But in the real app I should instead use a [NavigateAction] to navigate to it,
/// when the settings-icon button is tapped in the app bar.
///
class BaseScreenChooser extends StatelessWidget with Screen {
  const BaseScreenChooser({super.key});

  @override
  Widget build(BuildContext context) => StoreConnector<AppState, _Vm>(
        vm: () => _Factory(),
        builder: (context, vm) {
          return switch (vm.screen) {
            ScreenChoice.signup => const SignupScreen(),
            // ScreenChoice.configuration => MaterialApp(home: Text('lalalala')),
            ScreenChoice.configuration => const ConfigurationScreen_Connector(),
            ScreenChoice.portfolioAndCashBalance => const PortfolioAndCashBalanceScreen(),
          };
        },
      );
}

class _Factory extends AppVmFactory<_Vm, BaseScreenChooser> {
  @override
  _Vm fromStore() => _Vm(screen: state.screenChoice);
}

class _Vm extends Vm {
  final ScreenChoice screen;

  _Vm({required this.screen}) : super(equals: [screen]);
}
