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

The `celest_backend` package is integrated into your app via the app's own `pubspec.yaml` file,
which points to the `celest` directory. The dependency is specified as follows:

```
dependencies:
  celest_backend:
    path: celest/
```

This means your app can use the code you add to the [celest/lib](celest/lib) directory, but the
backend code there cannot see the code in your app's [lib](lib) directory.
This means that code you want to share between the backend and the frontend should be put in the
celest package.

However, the [celest/functions](celest/functions) directory, which is
outside [celest/lib](celest/lib), cannot be accessed by your app, and cannot be accessed from
[celest/lib](celest/lib) as well. The functions directory will be used by the Celest CLI to
create generated code inside the [celest/lib](celest/lib) directory.

The [celest/functions](celest/functions) directory can, however, be imported from the tests in
[celest/test](celest/test).

* `celest/functions`
    - Cannot be imported from your app's `lib`.
    - Cannot be imported from `celest/lib`.
    - Can be imported from the tests in `celest/test`.

* `celest/lib`
    - Can be imported from your app's `lib`. Put here code that you want to share between
      backend and frontend.

* `lib`
    - Cannot be imported from `celest/lib`. Frontend code only.

By reading the code in [celest/functions](celest/functions), Celest will then auto generate code
inside the [celest/lib](celest/lib) directory.

For example, if file `celest/functions/greetings.dart` contains:

```dart
Future<String> sayHello(String name) async {
  print('Saying hello to $name');
  return 'Hello, $name!';
}
```

Then Celest will generate this
in [celest/lib/src/client/functions.dart](celest/lib/src/client/functions.dart):

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

This generated `sayHello()` function is the one accessed from your app's code when you write
`await celest.functions.greeting.sayHello('Celest');`, and NOT the one in the functions directory,
since, as explained above, the functions directory cannot be imported from your app's `lib`.

The generated `sayHello()` starts by sending an HTTP POST request to the backend,
by doing `await celest.httpClient.post(url, ...)` and will resolve the URL
with `baseUri.resolve('/greeting/say-hello')`, where:

```
baseUri = kIsWeb || !Platform.isAndroid
    ? Uri.parse('http://localhost:7777')
    : Uri.parse('http://10.0.2.2:7777');
```

At the moment Celest is not yet running on a server. When it does, I believe the Celest URL
will be one of the options, for when we want to run against the real server. But for the moment
we have `http://localhost:7777` for web, and `http://10.0.2.2:7777`
for Android, where `10.0.2.2` is a special alias to my host loopback interface
(i.e., `127.0.0.1` on my development machine) when using the Android Emulator.

When running locally, Celest will spin up a local server on port 7777
(see: `celest-0.1.1\lib\src\runtime\serve.dart` from https://pub.dev/packages/celest),
and the generated `sayHello()` function will send the HTTP POST request
to `http://...:7777/greeting/say-hello`.

In the backend (which for the moment is our local server), Celest will decode the Json with
`request.decodeJson()`, run the original `sayHello()` function we wrote in the `greetings.dart` file
with `final response = ... handle(bodyJson)`, encode the response with `jsonEncode(response.body)`,
and send it back to the frontend:

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



