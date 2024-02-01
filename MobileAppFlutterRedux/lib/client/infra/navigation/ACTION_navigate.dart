import 'package:async_redux/async_redux.dart';
import "package:flutter/material.dart";
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';

import '../basic/routes_transitions.dart';
import '../basic/screen.dart';
import '../run_config/run_config.dart';

class Navigate_Action extends NavigateAction<AppState> {
  //
  static late VoidCallback _closeKeyboardFunction;

  static void init({
    required GlobalKey<NavigatorState> navigatorKey,
    required VoidCallback closeKeyboardFunc,
  }) {
    NavigateAction.setNavigatorKey(navigatorKey);
    _closeKeyboardFunction = closeKeyboardFunc;
  }

  // ---

  Navigate_Action.push(Screen screen) : super.push(SmartRoute.choose(screen));

  Navigate_Action.pushNamed(String routeName) : super.pushNamed(routeName);

  Navigate_Action.pop([Object? result]) : super.pop(result);

  Navigate_Action.pushAndRemoveAll(Screen screen)
      : super.pushAndRemoveUntil(SmartRoute.choose(screen), (_) => false);

  /// Same as [pushAndRemoveAll] but forces DelayedNoAnimationRoute.
  Navigate_Action.pushAndRemoveAll_DelayedNoAnimationRoute(Screen screen)
      : super.pushAndRemoveUntil(DelayedNoAnimationRoute(screen), (_) => false);

  Navigate_Action.pushReplacement(Screen screen) : super.pushReplacement(SmartRoute.choose(screen));

  Navigate_Action.pushAndRemoveUntil(Screen screen, RoutePredicate predicate)
      : super.pushAndRemoveUntil(SmartRoute.choose(screen), predicate);

  /// Replaces a screen on the navigator that most tightly encloses the given
  /// context with a new screen. The screen to be replaced is the one below the
  /// given `anchorScreen`.
  ///
  /// The old screen must not be current visible, as this method skips the
  /// animations and therefore the removal would be jarring if it was visible.
  /// To replace the top-most screen, consider [pushReplacement] instead, which
  /// _does_ animate the new screen, and delays removing the old screen until the
  /// new screen has finished animating.
  ///
  /// The removed screen is removed without being completed, so this method does
  /// not take a return value argument.
  ///
  Navigate_Action.replaceRouteBelow({
    required Screen anchorScreen,
    required Screen newScreen,
  }) : super.replaceRouteBelow(
          anchorRoute: SmartRoute.choose(anchorScreen),
          newRoute: SmartRoute.choose(newScreen),
        );

  Navigate_Action.pushNamedAndRemoveAll(String routeName) : super.pushNamedAndRemoveAll(routeName);

  Navigate_Action.popUntil(Type screenRuntimeType)
      : super.popUntilRouteName(screenRuntimeType.toString());

  Navigate_Action.popUntilRouteName(String routeName) : super.popUntilRouteName(routeName);

  Navigate_Action.popUntil_Predicate(RoutePredicate predicate) : super.popUntil(predicate);

  Navigate_Action.popUntil_ScreenIsDifferentThan(List<Type> screenRuntimeType)
      : super.popUntil((Route<dynamic> route) {
          String? routeName = route.settings.name;
          return !screenRuntimeType.map((type) => type.toString()).contains(routeName);
        });

  /// Use this to find the route name only.
  /// Then you can use [Navigate_Action.popUntilRouteName].
  @visibleForTesting
  Navigate_Action.popAndPrintAllRouteNames()
      : this.popUntil_Predicate((route) {
          print('\n\nRoute name = ${route.settings.name}\n\n');
          return false;
        });

  @override
  AppState? reduce() {
    if (!RunConfig.instance.disablePlatformChannels) _closeKeyboardFunction.call();
    // ---

    AppState? state;
    try {
      state = super.reduce();
    } catch (error, stacktrace) {
      //
      print(error);
      print(stacktrace);
    }

    return state;
  }

  @override
  String runtimeTypeString() => '${super.runtimeTypeString()}${details.toString()}';

  @override
  String toString() => runtimeTypeString();
}
