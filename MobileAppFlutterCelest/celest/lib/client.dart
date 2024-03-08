// Generated by Celest. This file should not be modified manually, but
// it can be checked into version control.
// ignore_for_file: type=lint, unused_local_variable, unnecessary_cast, unnecessary_import

library; // ignore_for_file: no_leading_underscores_for_library_prefixes

import 'dart:io' as _$io;

import 'package:celest_core/src/util/globals.dart';
import 'package:http/http.dart' as _$http;

import 'src/client/functions.dart';
import 'src/client/serializers.dart';

final Celest celest = Celest();

enum CelestEnvironment {
  local,
  production;

  Uri get baseUri => switch (this) {
        local => kIsWeb || !_$io.Platform.isAndroid
            ? Uri.parse('http://localhost:7778')
            : Uri.parse('http://10.0.2.2:7778'),
        production => Uri.parse(
            'https://mobile-app-flutter-celest-jhmx-v76lntiq7q-rj.a.run.app'),
      };
}

class Celest {
  var _initialized = false;

  late CelestEnvironment _currentEnvironment;

  late _$http.Client httpClient = _$http.Client();

  late Uri _baseUri;

  final _functions = CelestFunctions();

  T _checkInitialized<T>(T Function() value) {
    if (!_initialized) {
      throw StateError(
          'Celest has not been initialized. Make sure to call `celest.init()` at the start of your `main` method.');
    }
    return value();
  }

  CelestEnvironment get currentEnvironment =>
      _checkInitialized(() => _currentEnvironment);

  Uri get baseUri => _checkInitialized(() => _baseUri);

  CelestFunctions get functions => _checkInitialized(() => _functions);

  void init({CelestEnvironment environment = CelestEnvironment.local}) {
    _currentEnvironment = environment;
    _baseUri = environment.baseUri;
    if (!_initialized) {
      initSerializers();
    }
    _initialized = true;
  }
}
