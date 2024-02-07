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

# How Celest works under the hood

The structure below represents a mobile app using Flutter and Celest:

```
mobile_app_flutter_celest/
├── celest/                 # Local Celest package
|   ├── functions/  
|   ├── lib/
|   ├── test/
|   └── pubspec.yaml
├── lib/                    # Your frontend code
├── test/
└── pubspec.yaml
```

Upon executing `celest start`, a local Dart package named `celest_backend` is generated within your
application's directory, in the [celest](celest) subdirectory. This local package contains
its own `pubspec.yaml`, `analysis_options.yaml` etc.

The `celest_backend` package is integrated into your app via the app's
own [pubspec.yaml](pubspec.yaml) file,
which points to the `celest` directory. The dependency is specified as follows:

```
dependencies:
  celest_backend:
    path: celest/
```

As a result, your frontend app code in the [lib](lib) directory can import and use the backend code
that's present in the [celest/lib](celest/lib) directory; But the backend code in
the [celest/lib](celest/lib) **cannot** see the frontend code you added in your app's [lib](lib)
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

* `celest/functions`
    - Inaccessible from both your app's `lib` and from `celest/lib`.
    - Only accessible from `celest/test`, for testing purposes.

* `celest/lib`
    - Accessible from your app's `lib` directory. This means that files in `celest/lib` can be
      shared between backend and frontend.
    - Accessible from both `test` and `celest/test`, for testing purposes.

* `lib`
    - Frontend-specific code that cannot be imported into `celest/lib`.
    - Only accessible from `test`, for testing purposes.

By reading the code in [celest/functions](celest/functions), Celest will then auto generate code
inside the [celest/lib](celest/lib) directory.

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

This generated `sayHello()` method is what your frontend app files in `lib` interact with,
not the original one in the functions directory, due to the previously mentioned access limitations.

The generated `sayHello()` starts by sending an HTTP POST request to the backend,
by doing `await celest.httpClient.post(url, ...)` and will resolve the URL
with `baseUri.resolve('/greeting/say-hello')`, where:

```
baseUri = kIsWeb || !Platform.isAndroid
    ? Uri.parse('http://localhost:7777')
    : Uri.parse('http://10.0.2.2:7777');
```

At the moment, Celest can only run locally via the CLI. In the near future, when Celest can run
in a real server, the Celest server URL will be one of the options above.

But for the moment, we have only `http://localhost:7777` for web, and `http://10.0.2.2:7777`
for Android, where `10.0.2.2` is a special alias to the host loopback interface
(i.e., `127.0.0.1` on my development machine) when using the Android Emulator.

By running locally, Celest will then spin up a local server on port 7777
and the generated `sayHello()` function will send the HTTP POST request
to `http://...:7777/greeting/say-hello`.

In the backend, as seen in file `celest-0.1.1\lib\src\runtime\serve.dart`
from https://pub.dev/packages/celest, Celest will: Decode the Json with `request.decodeJson()`; Run
the original `sayHello()` function from the `greetings.dart` file
with `final response = ... handle(bodyJson)`; And encode the response
with `jsonEncode(response.body)` to send it back to the frontend:

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



