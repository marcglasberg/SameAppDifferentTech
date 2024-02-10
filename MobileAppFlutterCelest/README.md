# Flutter with Celest

> This is part of the <a href='https://github.com/marcglasberg/SameAppDifferentTech'>**Same App,
> Different Tech**</a> project.
>
> It contains the same simple but non-trivial **mobile app** implemented using a
> variety of *different tech stacks*.

### Why is this repository useful?

* It helps you learn **backend development with [Celest](https://celest.dev/), using Dart**.


* Feel free to clone this repository as a foundation for your own mobile apps using Celest as the
  backend. It's a starting point for clean, well organized, well documented code, which is easy to
  understand, develop, refactor, change, maintain and test.

## This app demonstrates the following:

* Using [Celest](https://celest.dev/) for backend development with Dart, including cloud-functions
  and authentication.

* How to test the app.

* Uncoupling the backend communication by using a DAO (Data Access Object) pattern, featuring:
    * Using a "fake" backend for development and testing
    * Using a "real" backend for production
    * On-demand fetching (REST get), or continuous streaming (websocket)

* And also:
    - State management.
    - Theming, and changing between light and dark modes.
    - Localization (translations).
    - Saving data to the local device storage.
    - Configuring the app.
    - Organizing the app directories.

This is the app:

![Alt text](readme_images/App_Description.png)

# How to run the app

Clone the app to your computer, and open it in your IDE (e.g. IntelliJ, Android Studio, VSCode).

Before running the app, you need to start the Celest service. To do that, open a terminal and run:

```shell
celest start
```

The `start` command will run Celest locally, in your machine.

Alternatively, to deploy the app to your Celest account in the cloud, try instead:

```shell
celest deploy
```  

The `deploy` command will run Celest in the cloud.

# How Celest works under the hood

The structure below represents a mobile app using Flutter and Celest:

```
mobile_app/
├── celest/           # Local Celest package
|   ├── functions/    # Backend only code
|   ├── lib/          # Shared code between frontend and backend
|   ├── test/
|   └── pubspec.yaml  # For the local Celest package
├── lib/              # Frontend only code
├── test/
└── pubspec.yaml      # For the frontend. Includes the local Celest package
``` 

Upon executing `celest start`, a local Dart package named `celest_backend` is generated within your
application's directory, in the [celest](celest) subdirectory. This local package contains
its own `pubspec.yaml`, `analysis_options.yaml` etc.

The `celest_backend` package is integrated into your app via the app's
own [pubspec.yaml](pubspec.yaml) file,
which points to the `celest` directory. The dependency is specified as follows:

```yaml
dependencies:
  celest_backend:
    path: celest/
```

As a result, your frontend app code in the [lib](lib) directory can import and use the backend code
that's present in the [celest/lib](celest/lib) directory; But the backend code in
the [celest/lib](celest/lib) cannot see the frontend code you added in your app's [lib](lib)
directory.

For this reason, all code that you want to share between the backend and the frontend should be put
into the [celest/lib](celest/lib) directory.

On the other hand, the [celest/functions](celest/functions) directory (which is
outside [celest/lib](celest/lib)) cannot be seen by any of those: You cannot import it
from files in [lib](lib), and you cannot import it from files in [celest/lib](celest/lib).
These files in the [celest/functions](celest/functions) directory are to be used exclusively by the
Celest service (started with `celest start`), which will use them as a base to auto-generate some
code inside the [celest/lib](celest/lib) directory.

To sum up:

* `celest/lib`
    - Accessible from your app's `lib` directory. This means that files in `celest/lib` can be
      shared between backend and frontend.
    - Accessible from both `test` and `celest/test`, for testing purposes.

* `lib`
    - Frontend-specific code that cannot be imported into `celest/lib`.
    - Only accessible from `test`, for testing purposes.

* `celest/functions`
    - Inaccessible from both your app's `lib` and from `celest/lib`.
    - Only accessible from `celest/test`, for testing purposes.

## Generated code

As explained, the Celest service will read the code in [celest/functions](celest/functions), and use
it to auto generate some more code inside the [celest/lib](celest/lib) directory.

For example, a `celest/functions/greetings.dart` file containing this:

```dart
Future<String> sayHello(String name) async {
  print('Saying hello to $name');
  return 'Hello, $name!';
}
```

Will lead the Celest service to automatically generate a corresponding method
in [celest/lib/src/client/functions.dart](celest/lib/src/client/functions.dart), like so:

```dart
class CelestFunctionsGreeting {
  Future<String> sayHello(String name) async {
    final $response = await celest.httpClient.post(
      celest.baseUri.resolve('/greeting/say-hello'),
      headers: const {'Content-Type': 'application/json; charset=utf-8'},
      body: jsonEncode({r'name': name}),
    );
    final $body = (jsonDecode($response.body) as Map<String, Object?>);
    if ($response.statusCode == 200) {
      return ($body['response'] as String);
    }
    final $error = ($body['error'] as Map<String, Object?>);
    final $code = ($error['code'] as String);
    final $details = ($error['details'] as Map<String, Object?>?);
    switch ($code) {
      case r'BadRequestException':
        throw Serializers.instance.deserialize<BadRequestException>($details);
      case r'InternalServerException':
        throw Serializers.instance
            .deserialize<InternalServerException>($details);
      case _:
        switch ($response.statusCode) {
          case 400:
            throw BadRequestException($code);
          case _:
            throw InternalServerException($code);
        }
    }
  }
}
```

This generated `sayHello()` method is the one your frontend app code in `lib` actually interacts
with, not the original `sayHello()` function in the functions directory (which cannot even be
imported, due to the previously mentioned access limitations).

The generated `sayHello()` starts by sending an HTTP POST request to the backend,
by doing `await celest.httpClient.post(url, ...)`, and will resolve the URL
with `baseUri.resolve('/greeting/say-hello')`.

If you ran Celest with `celest start`, this will be your `baseUri`:

```dart
baseUri = kIsWeb || !Platform.isAndroid
    ? Uri.parse('http://localhost:7777')
    : Uri.parse('http://10.0.2.2:7777');
```

We have `http://localhost:7777` for web, and `http://10.0.2.2:7777` for Android, where `10.0.2.2` is
a special alias to the host loopback interface (i.e., `127.0.0.1` on my development machine) when
using the Android Emulator.

By running locally, Celest will then spin up a local server on port `7777`
and the generated `sayHello()` function will send the HTTP POST request
to `http://...:7777/greeting/say-hello`.

If instead you ran Celest with `celest deploy`, your `baseUri` will be something like this

```dart
late final Uri baseUri = Uri.parse('https://mobile-app-flutter-celest-xxxx-xxxxxxxxxx-xx.a.run.app');
```

In the backend, as seen in file `celest-0.1.1\lib\src\runtime\serve.dart`
from https://pub.dev/packages/celest, Celest will:

* Decode the Json with `request.decodeJson()`
* Run the original `sayHello()` function from the `greetings.dart` file
  with `final response = ... handle(bodyJson)`
* Encode the response with `jsonEncode(response.body)` and send it back to the frontend

```dart
Future<Response> _handler(Request request) async {
  final bodyJson = await request.decodeJson();
  final response = await runZoned(
        () => handle(bodyJson),
    zoneSpecification: ZoneSpecification(
      print: (self, parent, zone, message) {
        parent.print(zone, '[$name] $message');
      },
    ),
  );
  return Response(
    response.statusCode,
    body: jsonEncode(response.body),
    headers: {
      contentTypeHeader: jsonContentType,
    },
  );
}
```

## How to use the Celest functions

To recap, the original `sayHello()` function you wrote
in [celest/functions](celest/functions)/greeting.dart is turned into a
generated method
inside [celest/lib/src/client/functions.dart](celest/lib/src/client/functions.dart).

To access this generated `sayHello()` method from your frontend app code (in [lib](lib))
you must import [celest/lib/client.dart](celest/lib/client.dart) and use the global `celest` object:

```dart
import 'package:celest_backend/client.dart';

var result = await celest.functions.greeting.sayHello('Celest');
```

Since Celest functions are _cloud functions_, they are always asynchronous, and can always fail,
for example, because of network issues, or because the server is down, etc.

This means you must always `await` the result of a Celest function, and you must always handle
the possibility of an error.

If you use a `FutureBuilder` to call a Celest function, you must always handle the `snapshot.error`:

```dart
FutureBuilder(
   future: celest.functions.greeting.sayHello('Celest'),
   builder: (_, snapshot) => switch (snapshot) {
      AsyncSnapshot(:final data?) => Text(data),
      AsyncSnapshot(:final error?) =>
         Text('${error.runtimeType}: $error'),
      _ => const CircularProgressIndicator(),
    }));
```

In the case of a `try/catch` block:

```dart
try {
    var result = await celest.functions.greeting.sayHello('Celest');
    print('Result: $result');
  } catch (error) {
    print('Error: $error');
  }
```

In the case of a `then/catchError`:

```dart
celest.functions.greeting.sayHello('Celest').then((result) {
  print('Result: $result');
}).catchError((error) {
  print('Error: $error');
});
```

Or, when using a state management solution, you'll follow its principles for handling
asynchronous operations that may fail.

In this example app we are using **[Async Redux](https://pub.dev/packages/async_redux)**,
which allows you to simply define a local `wrapError` in the action:

```dart
class GreetingAction extends ReduxAction<AppState> {

  Future<AppState?> reduce() async {
    var newGreeting = await celest.functions.greeting.sayHello('Celest');    
    return state.copy(greeting: newGreeting);
  }
  
  Object wrapError(Object error, StackTrace stackTrace) => 
      UserException("The greeting failed.", cause: error);  
}
```

Or a global `wrapError` when creating the store:

```dart
store = Store<AppState>(
   initialState: state,
   wrapError: MyWrapError(), // A custom WrapError
);

class MyWrapError extends WrapError<AppState> {  
  Object? wrap(Object error, [StackTrace? st, ReduxAction<AppState>? action]) {  
    if (error is InternalServerException) {
      return UserException("The greeting failed.", cause: error);
    else
      return null;
  }}
```

Note: When
a [wrapError](https://github.com/marcglasberg/async_redux/blob/master/lib/src/wrap_error.dart)
converts some error into
a [UserException](https://github.com/marcglasberg/async_redux/blob/master/lib/src/user_exception.dart),
this is a special exception that will be displayed to the user in
a [dialog](https://github.com/marcglasberg/async_redux/blob/master/lib/src/user_exception_dialog.dart).
However, if your Celest function directly throws a `UserException` (or a subclass
of `UserException`), it will also be displayed to the user in a dialog, no error wrapping needed.

# The functions

_[In development]_
