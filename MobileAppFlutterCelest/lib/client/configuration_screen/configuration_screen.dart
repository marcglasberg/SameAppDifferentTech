import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:i18n_extension/i18n_widget.dart';
import 'package:i18n_extension_core/i18n_extension_core.dart';
import 'package:mobile_app_flutter_celest/client/app_bar/ACTION_navigate_to_screen.dart';
import 'package:mobile_app_flutter_celest/client/app_bar/stocks_app_bar.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/client/infra/basic/app_vm_factory.dart';
import 'package:mobile_app_flutter_celest/client/infra/dao/real_dao.dart';
import 'package:mobile_app_flutter_celest/client/infra/run_config/run_config.dart';
import 'package:mobile_app_flutter_celest/client/infra/theme/app_themes.dart';
import 'package:themed/themed.dart';

import '../utils/divider.dart';
import 'ACTION_toggle_light_and_dark_mode.dart';
import 'configuration_screen.i18n.dart';

class ConfigurationScreen_Connector extends StatelessWidget {
  const ConfigurationScreen_Connector({super.key});

  @override
  Widget build(BuildContext context) => StoreConnector<AppState, _Vm>(
        vm: () => _Factory(),
        builder: (context, vm) {
          return ConfigurationScreen(
            isDarkMode: vm.isDarkMode,
            toggleLightAndDarkMode: vm.toggleLightAndDarkMode,
            toggleShowRunConfigInTheConfigScreen: vm.toggleShowRunConfigInTheConfigScreen,
            toggleAbTesting: vm.toggleAbTesting,
            onDone: vm.onDone,
          );
        },
      );
}

class _Factory extends AppVmFactory<_Vm, ConfigurationScreen_Connector> {
  @override
  _Vm fromStore() => _Vm(
        isDarkMode: state.ui.isDarkMode,
        toggleLightAndDarkMode: _toggleLightAndDarkMode,
        toggleShowRunConfigInTheConfigScreen: _toggleShowRunConfigInTheConfigScreen,
        toggleAbTesting: _toggleAbTesting,
        onDone: _onDone,
      );

  void _toggleLightAndDarkMode() => dispatch(ToggleLightAndDarkMode_Action());

  void _toggleShowRunConfigInTheConfigScreen() {
    var newRunConfig = RunConfig.instance.copy(
        ifShowRunConfigInTheConfigScreen: !RunConfig.instance.ifShowRunConfigInTheConfigScreen);
    RunConfig.setInstance(newRunConfig);
  }

  void _toggleAbTesting() {
    var newRunConfig = RunConfig.instance.copy(abTesting: RunConfig.instance.abTesting.next);
    RunConfig.setInstance(newRunConfig);
  }

  void _onDone() => dispatch(NavigateToPortfolioAndCashBalanceScreen_Action());
}

class _Vm extends Vm {
  //
  final bool isDarkMode;
  final VoidCallback toggleLightAndDarkMode,
      toggleShowRunConfigInTheConfigScreen,
      toggleAbTesting,
      onDone;

  _Vm({
    required this.isDarkMode,
    required this.toggleLightAndDarkMode,
    required this.toggleShowRunConfigInTheConfigScreen,
    required this.toggleAbTesting,
    required this.onDone,
  }) : super(equals: [isDarkMode]);
}

class ConfigurationScreen extends StatefulWidget {
  //
  final bool isDarkMode;
  final VoidCallback toggleLightAndDarkMode,
      toggleShowRunConfigInTheConfigScreen,
      toggleAbTesting,
      onDone;

  ConfigurationScreen({
    super.key,
    required this.isDarkMode,
    required this.toggleLightAndDarkMode,
    required this.toggleShowRunConfigInTheConfigScreen,
    required this.toggleAbTesting,
    required this.onDone,
  });

  @override
  State<ConfigurationScreen> createState() => _ConfigurationScreenState();
}

class _ConfigurationScreenState extends State<ConfigurationScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: ValueKey(widget.isDarkMode),
      appBar: SimpleAppBar(title: 'Configuration'.i18n),
      backgroundColor: AppColor.bkgGray,
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                _option1(),
                _option2(),
                if (RunConfig.instance.ifShowRunConfigInTheConfigScreen) _runConfigOptions(),
                if (Translations.missingKeys.isNotEmpty) _missingTranslationKeys(),
                if (Translations.missingTranslations.isNotEmpty) _missingTranslations(),
              ],
            ),
          ),
          const Spacer(),
          Padding(
            padding: const Pad(all: 8.0),
            child: MaterialButton(
              minWidth: double.infinity,
              padding: const EdgeInsets.all(16),
              color: AppColor.green,
              child: Text('Done'.i18n, style: Font.small + AppColor.invertedText),
              onPressed: widget.onDone,
            ),
          ),
        ],
      ),
    );
  }

  Widget _missingTranslationKeys() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        space16,
        const ThinDivider(),
        space16,
        Text('Missing translation keys'.i18n, style: Font.small + AppColor.textDimmed),
        space12,
        for (TranslatedString ts in Translations.missingKeys)
          Text('${ts.locale}: "${ts.key}"', style: Font.small)
      ],
    );
  }

  Widget _missingTranslations() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        space16,
        const ThinDivider(),
        space16,
        Text('Missing translations'.i18n, style: Font.small + AppColor.textDimmed),
        space12,
        for (TranslatedString ts in Translations.missingTranslations)
          Text('${ts.locale}: "${ts.key}"', style: Font.small)
      ],
    );
  }

  Widget _option1() {
    return Item(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child:
                Text(widget.isDarkMode ? 'Dark mode'.i18n : 'Light mode'.i18n, style: Font.medium),
          ),
          Switch(
            activeColor: AppColor.blue,
            value: widget.isDarkMode,
            onChanged: (_) {
              setState(() {
                widget.toggleLightAndDarkMode();
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _option2() {
    bool isSpanish = (I18n.language == 'es');

    return Item(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(isSpanish ? 'Español' : 'English', style: Font.medium),
          ),
          Switch(
            activeColor: AppColor.blue,
            value: isSpanish,
            onChanged: (_) {
              setState(() {
                var newLocale = isSpanish ? const Locale("en", "US") : const Locale("es", "ES");
                print('Changing locale to $newLocale.');

                I18n.of(context).locale = newLocale;
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _runConfigOptions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        space16,
        const ThinDivider(),
        space16,
        Text('Run Configuration'.i18n, style: Font.small + AppColor.textDimmed),
        space12,
        _runConfigOption1(),
        _runConfigOption3(),
        _runConfigOption4(),
      ],
    );
  }

  Widget _runConfigOption1() {
    return Item(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text('Show Run Configuration'.i18n, style: Font.medium),
          ),
          Switch(
            activeColor: AppColor.blue,
            value: RunConfig.instance.ifShowRunConfigInTheConfigScreen,
            onChanged: (_) {
              setState(() {
                widget.toggleShowRunConfigInTheConfigScreen();
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _runConfigOption3() {
    return Item(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text('A/B Testing'.i18n, style: Font.medium),
          ),
          MaterialButton(
            color: AppColor.blue,
            minWidth: 100,
            child: Text(
              RunConfig.instance.abTesting.toString(),
              style: Font.medium + AppColor.white,
            ),
            onPressed: () {
              setState(() {
                widget.toggleAbTesting();
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _runConfigOption4() {
    return Item(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            (RunConfig.instance.dao is RealDao)
                ? 'Simulation is OFF'.i18n
                : 'Simulation is ON'.i18n,
            style: Font.medium,
          ),
        ],
      ),
    );
  }
}

class Item extends StatelessWidget {
  final Widget child;

  const Item({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: child,
    );
  }
}
