import "package:flutter/cupertino.dart";
import "package:flutter/material.dart";
import "package:mobile_app_flutter_redux/business/infra/basic/routes_transitions.dart";
import "package:mobile_app_flutter_redux/business/infra/basic/screen.dart";
import "package:mobile_app_flutter_redux/client/infra/base_screen_chooser.dart";
import "package:mobile_app_flutter_redux/client/utils/errors_and_exceptions.dart";
import "package:mobile_app_flutter_redux/portfolio_and_cash_balance_screen.dart";

class AppRoutes {
  //
  static Route onGenerateRoute(RouteSettings settings) {
    return AppRoutes(settings)._generate();
  }

  final RouteSettings settings;

  AppRoutes(this.settings);

  Route _generate() {
    //
    // TODO: REMOVE
    // List<String> args = settings.name!.split("/");
    // String nome = args[0];
    // args.removeAt(0);

    if (settings.name == '/') {
      return NoAnimationRoute(const BaseScreenChooser());
    }
    //
    else {
      throw NotYetImplementedError();
    }
  }
}

/// If the route is from this screen, return true.
/// The route should start with the [Screen] class name (without the "_Screen" suffix),
/// followed by arguments separated by '/'.
///
/// For example: "MyUser/mark" may start screen `MyUser_Screen(user: 'mark')`
bool ifScreen(String name, Type ScreenRuntimeType) {
  return "${name}_Screen" == ScreenRuntimeType.toString();
}

Type getReturnType<T extends Type>(T Function(List<String>) method) => T;

