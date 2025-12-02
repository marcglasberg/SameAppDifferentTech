import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:async_redux/async_redux.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:i18n_extension/i18n_extension.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/basic/ACTION_process_lifecycle_change.dart';
import 'package:mobile_app_flutter_redux/client/infra/basic/client.dart';
import 'package:mobile_app_flutter_redux/client/infra/navigation/app_routes.dart';
import 'package:mobile_app_flutter_redux/client/infra/theme/app_themes.dart';
import 'package:themed/themed.dart';

import 'business.dart';

class App extends StatelessWidget {
  const App();

  static const I18nWidgetId = "I18nWidget";

  @override
  Widget build(BuildContext context) {
    return StoreProvider<AppState>(
      store: Business.store,
      child: const _HomePage(),
    );
  }
}

class _HomePage extends StatelessWidget {
  const _HomePage();

  @override
  Widget build(BuildContext context) {
    //
    var navigatorRoutesWrapper = (BuildContext context, Widget? child) {
      return MediaQuery(
        data: MediaQuery.of(context).copyWith(
          textScaler: const TextScaler.linear(1.0),
        ),
        child: I18n(
          initialLocale: const Locale("en", "US"),
          child: (child == null) //
              ? const Box()
              :
              // Get errors messages from AsyncRedux, and show a dialog.
              UserExceptionDialog<AppState>(child: child),
        ),
      );
    };

    return AppLifecycleManager(
      child: Themed(
        currentTheme: context.read().ui.isDarkMode ? darkTheme : null,
        child: MaterialApp(
          theme: ThemeData(
            primaryColor: Colors.green.shade800,
            colorScheme: ThemeData()
                .colorScheme
                .copyWith(secondary: Colors.green.shade600),
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
    );
  }
}

class AppLifecycleManager extends StatefulWidget {
  //
  final Widget child;

  const AppLifecycleManager({
    required this.child,
  });

  @override
  _AppLifecycleManagerState createState() => _AppLifecycleManagerState();
}

class _AppLifecycleManagerState extends State<AppLifecycleManager>
    with WidgetsBindingObserver {
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
    Business.store.dispatch(ProcessLifecycleChange(lifecycle));
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
