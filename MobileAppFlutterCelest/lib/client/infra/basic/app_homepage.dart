import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:async_redux/async_redux.dart';
import 'package:celest_backend/client.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:i18n_extension/i18n_extension.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/ACTION_process_lifecycle_change.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/client.dart';
import 'package:mobile_app_flutter_celest/client/infra/navigation/app_routes.dart';
import 'package:mobile_app_flutter_celest/client/infra/theme/app_themes.dart';
import 'package:themed/themed.dart';

import 'business.dart';

class AppHomePage extends StatelessWidget {
  const AppHomePage();

  static const I18nWidgetId = "I18nWidget";

  @override
  Widget build(BuildContext context) {
    //
    var navigatorRoutesWrapper = (BuildContext context, Widget? child) {
      return MediaQuery(
        data: MediaQuery.of(context).copyWith(textScaler: const TextScaler.linear(1.0)),
        child: Box(
          child: I18n(
            id: I18nWidgetId,
            // initialLocale: const Locale("en", "US"),
            child: (child == null) //
                ? const Box()
                :
                // This dialog gets error messages from AsyncRedux, and shows a dialog.
                UserExceptionDialog<AppState>(child: child),
          ),
        ),
      );
    };

    return Themed(
      currentTheme: Business.store.state.ui.isDarkMode ? darkTheme : null,
      child: CelestLocalBanner(
        child: StoreProvider<AppState>(
          store: Business.store,
          child: AppLifecycleManager(
            child: MaterialApp(
              theme: ThemeData(
                primaryColor: Colors.green.shade800,
                colorScheme: ThemeData().colorScheme.copyWith(secondary: Colors.green.shade600),
              ),
              title: "Demo App",
              navigatorKey: Client.navigatorKey,
              debugShowCheckedModeBanner: false,
              builder: navigatorRoutesWrapper,
              initialRoute: '/',
              navigatorObservers: [
                Client.routeObserver,
                //
                // TODO: Hook for analytics.
                // FirebaseAnalyticsObserver(analytics: Dao.firebaseAnalytics),
              ],
              localizationsDelegates: AppLocalizations.delegates,
              supportedLocales: AppLocalizations.supportedLocales(),
              onGenerateRoute: AppRoutes.onGenerateRoute,
            ),
          ),
        ),
      ),
    );
  }
}

class AppLifecycleManager extends StatefulWidget {
  //
  final Widget child;

  const AppLifecycleManager({
    super.key,
    required this.child,
  });

  @override
  _AppLifecycleManagerState createState() => _AppLifecycleManagerState();
}

class _AppLifecycleManagerState extends State<AppLifecycleManager> with WidgetsBindingObserver {
  //
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState lifecycle) {
    Business.store.dispatch(ProcessLifecycleChange_Action(lifecycle));
  }

  @override
  Widget build(BuildContext context) => widget.child;
}

class AppLocalizations {
  //
  static List<LocalizationsDelegate> get delegates => [
        GlobalCupertinoLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        DefaultCupertinoLocalizations.delegate,
      ];

  static List<Locale> supportedLocales() {
    return [
      const Locale('en', 'US'),
      const Locale('es', 'ES'),
    ];
  }
}

class CelestLocalBanner extends StatelessWidget {
  final Widget child;

  const CelestLocalBanner({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return (celest.currentEnvironment != CelestEnvironment.local)
        ? child
        : Banner(
            message: 'Celest local',
            location: BannerLocation.topEnd,
            layoutDirection: TextDirection.ltr,
            textDirection: TextDirection.ltr,
            child: child,
          );
  }
}
