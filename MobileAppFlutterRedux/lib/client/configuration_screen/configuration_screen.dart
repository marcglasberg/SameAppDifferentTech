import 'package:assorted_layout_widgets/assorted_layout_widgets.dart';
import 'package:async_redux/async_redux.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/client/app_bar/ACTION_navigate_to_screen.dart';
import 'package:mobile_app_flutter_redux/client/app_bar/stocks_app_bar.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';
import 'package:mobile_app_flutter_redux/client/infra/basic/app_vm_factory.dart';
import 'package:mobile_app_flutter_redux/client/infra/dao/real_dao/real_dao.dart';
import 'package:mobile_app_flutter_redux/client/infra/run_config/run_config.dart';
import 'package:mobile_app_flutter_redux/client/infra/theme/app_themes.dart';
import 'package:themed/themed.dart';

import '../utils/divider.dart';
import 'ACTION_toggle_light_and_dark_mode.dart';

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
      appBar: const SimpleAppBar(title: "Configuration"),
      backgroundColor: AppColor.bkgGray,
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                option1(),
                if (RunConfig.instance.ifShowRunConfigInTheConfigScreen) runConfigOptions(),
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
              child: Text("Done", style: Font.small + AppColor.white),
              onPressed: widget.onDone,
            ),
          ),
        ],
      ),
    );
  }

  Widget option1() {
    return Item(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(widget.isDarkMode ? 'Dark mode' : 'Light mode', style: Font.medium),
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

  Widget runConfigOptions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        space16,
        const ThinDivider(),
        space16,
        Text('Run Configuration', style: Font.small + AppColor.textDimmed),
        space12,
        runConfigOption1(),
        runConfigOption3(),
        runConfigOption4(),
      ],
    );
  }

  Widget runConfigOption1() {
    return Item(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text('Show Run Configuration', style: Font.medium),
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

  Widget runConfigOption3() {
    return Item(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text('A/B Testing', style: Font.medium),
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

  Widget runConfigOption4() {
    return Item(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text('Simulation is ' + (RunConfig.instance.dao is RealDao ? 'OFF' : 'ON'),
              style: Font.medium),
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
