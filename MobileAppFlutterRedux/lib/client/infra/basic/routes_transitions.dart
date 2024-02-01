import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import "package:flutter/cupertino.dart";
import "package:flutter/material.dart";
import 'screen.dart';

abstract class ScreenRoute<T> implements Route<Route<T>> {
  Screen get screen;
}

/// To choose the route animation: `SmartRoute.choose(screen)`.
class SmartRoute {
  static PageRoute choose(Screen screen) {
    //
    if (_oneOf(screen.runtimeType, noAnimationRoutes))
      return NoAnimationRoute(screen);
    //
    else if (_oneOf(screen.runtimeType, slideUpRoutes))
      return SlideUpRoute(screen);
    //
    else
      return SlideLeftRoute(screen);
  }

  static bool _oneOf(Type screen, List<Type> screens) {
    final String screenStr = screen.toString();
    for (Type _screen in screens) {
      if (screenStr == _screen.toString()) return true;
    }
    return false;
  }

  // These routes will have no animation.
  static const noAnimationRoutes = <Type>[
    // TODO: MARCELO
    // Main_Screen,
  ];

  // These routes will come from below.
  static const slideUpRoutes = <Type>[
    // TODO: MARCELO
    // Main_Screen,
  ];
}

class SlideLeftRoute extends CupertinoPageRoute<Route> implements ScreenRoute {
  //
  @override
  final Screen screen;

  SlideLeftRoute(this.screen)
      : super(
          settings: RouteSettings(name: screen.runtimeType.toString()),
          builder: (_) => _BarrierRoute(screen),
        );

  @override
  String toString() => '${screen.runtimeType}|SlideLeftRoute';

  @override
  Widget buildTransitions(BuildContext context, Animation<double> animation,
      Animation<double> secondaryAnimation, Widget child) {
    return buildPageTransitions<Route>(this, context, animation, secondaryAnimation, child);
  }

  static Widget buildPageTransitions<T>(
    PageRoute<T> route,
    BuildContext context,
    Animation<double> animation,
    Animation<double> secondaryAnimation,
    Widget child,
  ) {
    if (route.fullscreenDialog) {
      return CupertinoRouteTransitionMixin.buildPageTransitions(
        route,
        context,
        animation,
        secondaryAnimation,
        child,
      );
    } else {
      return Stack(
        children: [
          CupertinoRouteTransitionMixin.buildPageTransitions(
            route,
            context,
            animation,
            secondaryAnimation,
            child,
          ),
          _nonClickableBarrier(),
        ],
      );
    }
  }

  /// Can't swipe back from the very bottom left of the screen.
  /// This protects the "swipe to submit button".
  static Positioned _nonClickableBarrier() {
    return const Positioned(
      bottom: 0,
      left: 0,
      child: AbsorbPointer(child: Box(width: 20, height: 110)),
    );
  }
}

/// The route will not visibly change anything for 500 milliseconds,
/// and then will complete immediately, with no transition.
/// This is meant to be used with [Navigate_Action.pushAndRemoveAll_DelayedNoAnimationRoute].
///
class DelayedNoAnimationRoute extends PageRouteBuilder<Route> implements ScreenRoute {
  //
  @override
  final Screen screen;

  DelayedNoAnimationRoute(
    this.screen, {
    bool ifScreenIsOpaque = true,
    Duration transitionDuration = const Duration(milliseconds: 500),
  }) : super(
          opaque: ifScreenIsOpaque,
          settings: RouteSettings(name: screen.runtimeType.toString()),
          transitionDuration: transitionDuration,
          pageBuilder: (context, animation, secondaryAnimation) => screen,
          transitionsBuilder: (context, animation, secondaryAnimation, widget) {
            if (animation.value == 1.0)
              return widget;
            else
              return const Box();
          },
        );

  @override
  String toString() => '${screen.runtimeType}|DelayedNoAnimationRoute';
}

class SlideUpRoute extends CupertinoPageRoute<Route> implements ScreenRoute {
  //
  @override
  final Screen screen;

  SlideUpRoute(this.screen)
      : super(
          settings: RouteSettings(name: screen.runtimeType.toString()),
          builder: (_) => _BarrierRoute(screen),
          fullscreenDialog: true,
        );

  @override
  String toString() => '${screen.runtimeType}|SlideUpRoute';
}

/// This is the default route animation.
class NoAnimationRoute extends MaterialPageRoute<Route> implements ScreenRoute {
  @override
  final Screen screen;

  NoAnimationRoute(this.screen)
      : super(
          settings: RouteSettings(name: screen.runtimeType.toString()),
          builder: (_) => _BarrierRoute(screen),
        );

  @override
  String toString() => '${screen.runtimeType}|NoAnimationRoute';

  @override
  Widget buildTransitions(
    BuildContext context,
    Animation<double> animation,
    Animation<double> secondaryAnimation,
    Widget child,
  ) {
    return child;
  }
}

class FadeTransitionRoute extends PageRouteBuilder<Route> implements ScreenRoute {
  //
  @override
  final Screen screen;

  FadeTransitionRoute(
    this.screen, {
    bool ifScreenIsOpaque = true,
    Duration transitionDuration = const Duration(milliseconds: 500),
  }) : super(
          opaque: ifScreenIsOpaque,
          settings: RouteSettings(name: screen.runtimeType.toString()),
          transitionDuration: transitionDuration,
          pageBuilder: (context, animation, secondaryAnimation) => screen,
          transitionsBuilder: (context, animation, secondaryAnimation, widget) => FadeTransition(
            opacity: Tween<double>(begin: 0, end: 1).animate(
              CurvedAnimation(
                parent: animation,
                curve: const Interval(0.5, 1, curve: Curves.linear),
              ),
            ),
            child: FadeTransition(
              opacity: Tween<double>(begin: 1, end: 0).animate(
                CurvedAnimation(
                  parent: secondaryAnimation,
                  curve: const Interval(0, 0.5, curve: Curves.linear),
                ),
              ),
              child: widget,
            ),
          ),
        );

  @override
  String toString() => '${screen.runtimeType}|FadeTransitionRoute';
}

/// Prevents user interaction with the screen for a few milliseconds, while the screen is opening.
/// This prevents the user to double-click and end-up pressing something in the screen that is
/// opening.
///
class _BarrierRoute extends StatefulWidget {
  final Widget child;

  _BarrierRoute(this.child);

  @override
  _BarrierRouteState createState() => _BarrierRouteState();
}

class _BarrierRouteState extends State<_BarrierRoute> {
  //
  static const Duration _duration = Duration(milliseconds: 300);

  late bool ifPreventsInteraction;

  @override
  void initState() {
    super.initState();
    ifPreventsInteraction = true;

    Future.delayed(_duration, () {
      if (mounted) setState(() => ifPreventsInteraction = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(children: [
      widget.child,
      _barrier(),
    ]);
  }

  /// So that we don't change the widget tree, we should always draw the Container.
  /// However, when we don't want the barrier, the Container ignores pointers.
  Widget _barrier() => IgnorePointer(
        ignoring: !ifPreventsInteraction,
        child: Container(color: const Color(0x00FFFFFF)),
      );
}
