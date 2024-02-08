import "dart:async";
import "dart:io";

import 'package:async_redux/async_redux.dart';
import "package:async_redux/local_json_persist.dart";
import 'package:flutter/foundation.dart';
import 'package:mobile_app_flutter_celest/client/infra/app_state.dart';
import 'package:mobile_app_flutter_celest/models/portfolio.dart';
import 'package:mobile_app_flutter_celest/models/ui.dart';
import 'package:mobile_app_flutter_celest/models/utils/map_deserialization_extension.dart';

/// Saves/Loads the state to/from the local device disk.
class AppPersistor extends Persistor<AppState> {
  //
  static const dbName_Portfolio = "portfolio";
  static const dbName_Ui = "ui";

  /// Read the saved state from the persistence. Should return null if the state is not yet
  /// persisted. This method should be called only once, the app starts, before the store is
  /// created. The state it returns may become the store's initial state. If some error
  /// occurs while loading the info, we have to deal with it, by fixing the problem. In the worse
  /// case, if we think the state is corrupted and cannot be fixed, one alternative is deleting
  /// all persisted files and returning null.
  @override
  Future<AppState?> readState() async {
    AppState? state;

    try {
      print('Reading state from disk.');
      state = await _readFromDisk();
    }
    //
    catch (error, stackTrace) {
      // We should log this error, not throw it.
      print('\n'
          'Error while reading from the local persistence:\n'
          'Error: $error.'
          'StackTrace: $stackTrace.\n');
    }

    // If we managed to read the saved state, return it.
    // It will later become the store's initial state.
    if (state != null)
      return state;
    //
    // When an error happens, state is null.
    else {
      print('Creating an empty state.');

      // So, we delete the old corrupted state from disk.
      await deleteState();

      // And them recreate the empty state and save it to disk.
      AppState state = AppState.initialState();
      await saveInitialState(state);

      // The empty state will later become the store's initial state.
      return state;
    }
  }

  Future<AppState?> _readFromDisk() async {
    //
    /// We are reading in sequence, but the correct here is reading both in parallel,
    /// by using `Future.wait([...])`
    Portfolio portfolio = await _readPortfolio();
    Ui ui = await _readUi();

    var state = AppState.initialState().copy(
      portfolio: portfolio,
      ui: ui,
    );
    print('State read from disk: $state.');
    return state;
  }

  /// This method throws an exception if the file does not contain a valid Json for the Portfolio.
  /// If that happens, the caller assumes the file is corrupted, and will treat the error.
  Future<Portfolio> _readPortfolio() async {
    return Portfolio();

    // TODO: MARCELO
    // print('Reading $dbName_Portfolio.db...');
    // LocalJsonPersist localPersist = LocalJsonPersist(dbName_Portfolio);
    // Object? result = await localPersist.load();
    // var portfolio = Portfolio.fromJson(result as Json?);
    // print('Read the Portfolio from disk: $portfolio');
    // return portfolio;
  }

  /// This method throws an exception if the file does not contain a valid Json for the Portfolio.
  /// If that happens, the caller assumes the file is corrupted, and will treat the error.
  Future<Ui> _readUi() async {
    print('Reading $dbName_Ui.db...');
    LocalJsonPersist localPersist = LocalJsonPersist(dbName_Ui);
    Object? result = await localPersist.load();
    var ui = Ui.fromJson(result as Json?);
    print('Read the Ui from disk: $ui');
    return ui;
  }

  @override
  Future<void> deleteState() async {
    print('Deleting the state from disk.');
    var rootDir = await findRootDirForLocalPersist();
    if (rootDir.existsSync()) await rootDir.delete(recursive: true);
  }

  /// Return the directory `LocalPersist` saves the files and create subdirectories.
  @visibleForTesting
  Future<Directory> findRootDirForLocalPersist() async {
    // Hack to get the dir, since this info is not shared.
    var fileInRoot = await LocalJsonPersist("file-in-root").file();
    return fileInRoot.parent;
  }

  /// Here I compare the last saved state with the current state.
  /// If the state changed, I save it to a file. I could have saved it to a database instead.
  @override
  Future<void> persistDifference({
    required AppState? lastPersistedState,
    required AppState newState,
  }) async {
    return;

    // TODO: MARCELO
    // /// Here I compare the last saved Portfolio with the current Portfolio in the state.
    // /// If the Portfolio changed, I save it to a file. I could have saved it to a database instead.
    // if (newState.portfolio != lastPersistedState?.portfolio) {
    //   print('Persisting the Portfolio to disk: ${newState.portfolio}');
    //   var localPersist = LocalJsonPersist(dbName_Portfolio);
    //   await localPersist.save(newState.portfolio.toJson());
    // }
    //
    // if (newState.ui != lastPersistedState?.ui) {
    //   print('Persisting the Ui to disk: ${newState.ui}');
    //   var localPersist = LocalJsonPersist(dbName_Ui);
    //   await localPersist.save(newState.ui.toJson());
    // }
  }
}
