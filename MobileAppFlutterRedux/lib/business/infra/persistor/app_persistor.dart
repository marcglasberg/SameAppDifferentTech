import "dart:async";
import "dart:io";

import 'package:async_redux/async_redux.dart';
import 'package:async_redux/local_persist.dart';
import 'package:flutter/foundation.dart';
import 'package:mobile_app_flutter_redux/business/state/app_state.dart';
import 'package:mobile_app_flutter_redux/business/state/portfolio.dart';

typedef Json = Map<String, dynamic>;
typedef JsonList = List<dynamic>;

class AppPersistor extends Persistor<AppState> {
  //
  static const dbName_Portfolio = "portfolio";

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
      // We should log this error, but we should not throw it.
      print('\n'
          'Error while reading from the local persistence:\n'
          'Error: $error.'
          'StackTrace: $stackTrace.\n');
    }

    // If we managed to read the saved that, return it.
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

    var state = AppState.initialState().copy(
      portfolio: portfolio,
    );

    print('Just read the state from disk: $state.');

    return state;
  }

  /// Here I demonstrate throwing an exception if the file does not contain a valid map with
  /// the correct key/value types (int for the key, and String for the value).
  /// This means it will delete all the persistence if this read value is corrupted.
  Future<Portfolio> _readPortfolio() async {

    return Portfolio();

    // TODO: MARCELO !!!
    // print('Reading $dbName_descriptionCache.db.');
    //
    // LocalPersist localPersist = LocalPersist(dbName_descriptionCache);
    // List<Object?>? result = await localPersist.load();
    //
    // if (result == null) return const IMapConst({});
    //
    // if ((result.length != 1) || (result.single is! Map)) throw AppError();
    //
    // // JSON keys are be strings, by definition, but our map needs int keys.
    // var mapOfStringString = result.single as Map<String, dynamic>;
    // return mapOfStringString
    //     .map((String key, dynamic value) => MapEntry<int, String>(int.parse(key), value as String))
    //     .lock;
  }

  @override
  Future<void> deleteState() async {
    print('Deleting the state from disk.');
    var rootDir = await findRootDireForLocalPersist();
    if (rootDir.existsSync()) await rootDir.delete(recursive: true);
  }

  /// Return the directory `LocalPersist` saves the files and create subdirectories.
  @visibleForTesting
  Future<Directory> findRootDireForLocalPersist() async {
    // Hack to get the dir, since this info is not shared.
    var fileInRoot = await LocalPersist("file-in-root").file();
    return fileInRoot.parent;
  }

  @override
  Future<void> persistDifference({
    required AppState? lastPersistedState,
    required AppState newState,
  }) async {
    bool ifPersisted = false;

    // ---

    /// Here I compare the last saved Portfolio with the current Portfolio in the state.
    /// If the Portfolio changed, I save it to a file. I could have saved it to a database instead.
    if (newState.portfolio != lastPersistedState?.portfolio) {
      print('Persisting the portfolio to disk.');
      ifPersisted = true;

      LocalPersist localPersist = LocalPersist(dbName_Portfolio);

      await localPersist.save([newState.portfolio]);
    }

    if (!ifPersisted) print('It was not necessary to persist the state to disk.');
  }

  @override
  Future<void> saveInitialState(AppState state) =>
      persistDifference(lastPersistedState: null, newState: state);

  @override
  Duration get throttle => const Duration(seconds: 2);
}
