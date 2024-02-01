import 'package:async_redux/async_redux.dart';
import 'package:mobile_app_flutter_redux/client/infra/app_state.dart';

abstract class AppAction extends ReduxAction<AppState> {
  @override
  String toString() => runtimeType.toString();
}
