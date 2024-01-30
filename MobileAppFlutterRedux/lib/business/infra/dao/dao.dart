import 'package:mobile_app_flutter_redux/business/infra/run_config/run_config.dart';

Dao get DAO => RunConfig.instance.dao;

abstract class Dao {
  //
  /// Initializes the DAO, if necessary.
  /// This is called in the app's initialization.
  Future<void> init();

  /// Given a [number], returns [Numbers_RESPONSE.description].
  /// Throw an error if the description cannot be found, or there is a connection error.
  Future<Numbers_RESPONSE> loadNumberDescription({required int number});
}

class Numbers_RESPONSE {
  String description;

  Numbers_RESPONSE({required this.description});
}

/// If the DAO cannot complete because of an error, it must throw this error.
class DaoGeneralError extends BackendError {
  DaoGeneralError([String? msg]) : super(msg);
}

/// If the DAO times out, it must throw this error.
class DaoTimeoutError extends BackendError {
  DaoTimeoutError()
      : super('We could not retrieve the information. '
            'Please, try again.');
}

class BackendError extends Error {
  final String? msg;

  BackendError([this.msg]);

  @override
  String toString() => '$runtimeType{msg: $msg}';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is BackendError && runtimeType == other.runtimeType && msg == other.msg;

  @override
  int get hashCode => msg.hashCode;
}
