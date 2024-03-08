import 'dart:convert';
import 'package:async_redux/async_redux.dart';
import 'package:celest_backend/exceptions.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_celest/client/utils/errors_and_exceptions.dart';

extension CombineMatchers on Matcher {
  Matcher operator &(Matcher other) => allOf(this, other);
}

/// Checks if the [errorType] of the actual error is correct.
/// Checks if the msg of the actual error contains the piece of [msg] passed.
/// To compare the entire msg, pass [isExactMessage] as true.
Matcher isAError<T>(String msg, {bool isExactMessage = false}) {
  return ThrowsWithMessage<T>(msg, isExactMessage: isExactMessage);
}

class ThrowsWithMessage<T> extends Matcher {
  final String msg;
  final bool isExactMessage;

  ThrowsWithMessage(this.msg, {this.isExactMessage = false});

  @override
  Description describe(Description description) => (msg != '')
      ? description.add('Error of type "$T" that contains this text in its message: "$msg".')
      : description.add('Error of type "$T".');

  @override
  bool matches(Object? item, Map matchState) {
    if (item is! T) return false;

    var msgActual = getMsgActual(item);

    return isExactMessage //
        ? msgActual == msg
        : msgActual!.contains(msg);
  }

  String? getMsgActual(Object? error) {
    if (error is AssertionError) return (error.message == null) ? null : error.message.toString();
    if (error is AppError) return (error.message == null) ? null : error.message.toString();
    if (error is ValidateError) return error.msg;
    if (error is NotYetImplementedError) return error.msg.toString();
    if (error is UserException) return error.message;
    if (error is InterruptControlFlowException) return "";
    return error.toString();
  }

  @override
  Description describeMismatch(
    Object? item,
    Description mismatchDescription,
    Map matchState,
    bool verbose,
  ) {
    if (item is! T)
      return mismatchDescription
          .add("Expected error of type '$T' but threw a '${item.runtimeType}'.");

    return mismatchDescription
        .add("Correctly threw an error of type '$T', but the error message should contain:\n"
            "  '$msg'\n"
            "but the actual message was:\n"
            "  '${getMsgActual(item)}'\n");
  }
}

final isAppError = isA<AppError>();
final throwsPidError = throwsA(isAppError);

final isUserException = isA<UserException>();
final throwsUserException = throwsA(isUserException);

final isValidateError = isA<ValidateError>();
final throwsValidateError = throwsA(isValidateError);

final isTypeError = isA<TypeError>();
final throwsTypeError = throwsA(isTypeError);

// Same elements, same number of elements, in the EXACT same order.
// Example: expect([1,2,3], isExactList([1,2,3]));
Matcher Function(Iterable expected) isExactList = orderedEquals;

// Same elements, same number of elements, in ANY order.
// Example: expect([3,1,2], isListInAnyOrder([1,2,3]));
Matcher Function(Iterable expected) isListInAnyOrder = unorderedEquals;

const Matcher isNotNullOrEmpty = _IsNotNullOrEmpty();

class _IsNotNullOrEmpty extends Matcher {
  //
  const _IsNotNullOrEmpty();

  @override
  bool matches(dynamic item, Map matchState) {
    return (item != null) && (item.isNotEmpty);
  }

  @override
  Description describe(Description description) => description.add('not null');
}

void expectTrue(dynamic obj) => expect(obj, isTrue);

void expectFalse(dynamic obj) => expect(obj, isFalse);

/// Matches if the function throws an `AssertionError` whose message is `msg`.
Matcher throwsAssertionErrorWithMsg(String msg) {
  return throwsA(
    isA<AssertionError>().having((error) => error.message, 'message', msg),
  );
}

/// Matches if the function throws a `AssertionError` whose message is `msg`.
Matcher throwsValidErrorWithMsg(String msg) {
  return throwsA(
    isA<ValidateError>().having((error) => error.msg, 'msg', msg),
  );
}

/// Matcher used in serialization tests. For example:
/// expect(myObj.toSimple(), isSimpleObject);
Matcher get isSimpleObject => _IsSimpleObject();

class _IsSimpleObject extends Matcher {
  //
  _IsSimpleObject();

  @override
  bool matches(item, Map matchState) {
    var jsonEncoder = const JsonEncoder();
    bool ifConverted = true;
    try {
      jsonEncoder.convert(item);
    } catch (error) {
      ifConverted = false;
    }
    return ifConverted;
  }

  @override
  Description describe(Description description) {
    return description.add('That the object would be a simple-object');
  }

  @override
  Description describeMismatch(
    Object? item,
    Description mismatchDescription,
    Map matchState,
    bool verbose,
  ) {
    return mismatchDescription.add("Cannot be converted to JSON");
  }
}

Matcher isNotIdentical<T>(T obj) => _IsNotIdentical(obj);

class _IsNotIdentical<T> extends Matcher {
  //
  final T obj;

  _IsNotIdentical(this.obj);

  @override
  bool matches(item, Map matchState) {
    if (item is! T)
      throw ArgumentError("$item is not of type $T.");
    else
      return !identical(item, obj);
  }

  @override
  Description describe(Description description) {
    return description.add('$T with instance different than ').addDescriptionOf(obj);
  }
}

Matcher isUserExceptionWithHardCause(Object cause) => _IsUserExceptionWithHardCause(cause);

/// A hard-cause is the the first error cause which, recursively, is NOT a UserException.
/// If not found, returns null.
class _IsUserExceptionWithHardCause extends Matcher {
  final Object _cause;

  _IsUserExceptionWithHardCause(this._cause);

  @override
  bool matches(item, Map matchState) {
    if (item is UserException) {
      final hardCause = item.hardCause;
      return _cause is Type ? (hardCause.runtimeType == _cause) : (hardCause == _cause);
    } else
      return false;
  }

  @override
  Description describe(Description description) {
    return description.add('UserException containing cause ').addDescriptionOf(_cause);
  }

  @override
  Description describeMismatch(
    item,
    Description mismatchDescription,
    Map matchState,
    bool verbose,
  ) {
    if (item is! UserException)
      return mismatchDescription.add('Is not UserException');
    else
      return mismatchDescription.add('UserException that does NOT contain the expected hard-cause');
  }
}
