@public
import 'dart:async';

import 'package:async_redux_core/async_redux_core.dart';
import 'package:celest/celest.dart';
import 'package:celest_backend/models.dart';

import 'database.dart';

/// Some admin functions should NOT work in production.
/// Those that do should make sure it's really the admin who's calling them.
void _assertIsNotProduction() {
  // TODO: It's currently not possible to access `celest` and check if the environment is production.
  // TODO: See https://github.com/celest-dev/celest/issues/47
  // if (celest.currentEnvironment == CelestEnvironment.production)
  //   throw Exception('This function should only be used in local and staging environments.');
}

// TODO: REMOVE
Future<void> doSomething() async {
  throw const UserException('Some text');
}

Future<void> setDatabase(Portfolio portfolio, Iterable<AvailableStock> availableStocks) async {
  _assertIsNotProduction();
  db.setState(portfolio, availableStocks);
}
