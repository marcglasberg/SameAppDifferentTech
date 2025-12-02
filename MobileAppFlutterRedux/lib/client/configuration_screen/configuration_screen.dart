import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:i18n_extension/i18n_extension.dart';
import 'package:mobile_app_flutter_redux/client/app_bar/ACTION_navigate_to_screen.dart';
import 'package:mobile_app_flutter_redux/client/app_bar/stocks_app_bar.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/dao/real_dao/real_dao.dart';
import 'package:mobile_app_flutter_redux/client/infra/run_config/run_config.dart';
import 'package:mobile_app_flutter_redux/client/infra/theme/app_themes.dart';
import 'package:themed/themed.dart';

import '../utils/divider.dart';
import 'ACTION_toggle_light_and_dark_mode.dart';
import 'configuration_screen.i18n.dart';

class ConfigurationScreen_Connector extends StatefulWidget {
  const ConfigurationScreen_Connector();

  @override
  State<ConfigurationScreen_Connector> createState() =>
      _ConfigurationScreen_ConnectorState();
}

class _ConfigurationScreen_ConnectorState
    extends State<ConfigurationScreen_Connector> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: ValueKey(context.state.ui.isDarkMode),
      appBar: SimpleAppBar(title: 'Configuration'.i18n),
      backgroundColor: AppColor.bkgGray,
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                // Choice between light mode and dark mode.
                _optionLightOrDarkMode(),
                //
                // Choice between English and Spanish.
                _optionLangEnglishOrSpanish(),
                //
                // Shows run-configuration options, if requested.
                if (RunConfig.instance.ifShowRunConfigInTheConfigScreen)
                  _runConfigOptions(),
                //
                // Shows missing translation keys and translations, if any.
                if (Translations.missingKeys.isNotEmpty)
                  _missingTranslationKeys(),
                //
                // Missing translations, if any.
                if (Translations.missingTranslations.isNotEmpty)
                  _missingTranslations(),
              ],
            ),
          ),
          const Spacer(),
          Padding(
            padding: const Pad(all: 8.0),
            child: MaterialButton(
              minWidth: double.infinity,
              padding: const EdgeInsets.all(16),
              color: Colors.green,
              child: Text('Done'.i18n, style: Font.small + AppColor.white),
              onPressed: () =>
                  context.dispatch(NavigateToPortfolioAndCashBalanceScreen()),
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
        Text('Missing translation keys'.i18n,
            style: Font.small + AppColor.textDimmed),
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
        Text('Missing translations'.i18n,
            style: Font.small + AppColor.textDimmed),
        space12,
        for (TranslatedString ts in Translations.missingTranslations)
          Text('${ts.locale}: "${ts.key}"', style: Font.small)
      ],
    );
  }

  Widget _optionLightOrDarkMode() {
    final isDarkMode = context.state.ui.isDarkMode;

    return Item(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(isDarkMode ? 'Dark mode'.i18n : 'Light mode'.i18n,
                style: Font.medium),
          ),
          Switch(
            activeThumbColor: AppColor.blue,
            value: isDarkMode,
            onChanged: (_) {
              setState(() {
                context.dispatch(ToggleLightAndDarkMode());
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _optionLangEnglishOrSpanish() {
    bool isSpanish = (I18n.of(context).locale.languageCode == 'es');

    return Item(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(isSpanish ? 'Español' : 'English', style: Font.medium),
          ),
          Switch(
            activeThumbColor: AppColor.blue,
            value: isSpanish,
            onChanged: (_) {
              setState(() {
                var newLocale = isSpanish
                    ? const Locale('en', 'US')
                    : const Locale('es', 'ES');
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
        _optionShowRunConfig(),
        _optionAOrBTesting(),
        _optionsSimulationOnOrOff(),
      ],
    );
  }

  Widget _optionShowRunConfig() {
    return Item(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text('Show Run Configuration'.i18n, style: Font.medium),
          ),
          Switch(
            activeThumbColor: AppColor.blue,
            value: RunConfig.instance.ifShowRunConfigInTheConfigScreen,
            onChanged: (_) {
              setState(() {
                RunConfig.setInstance(
                  RunConfig.instance.copy(
                      ifShowRunConfigInTheConfigScreen:
                          !RunConfig.instance.ifShowRunConfigInTheConfigScreen),
                );
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _optionAOrBTesting() {
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
                RunConfig.setInstance(
                  RunConfig.instance
                      .copy(abTesting: RunConfig.instance.abTesting.next),
                );
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _optionsSimulationOnOrOff() {
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

  const Item({required this.child});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: child,
    );
  }
}
