import 'package:celest/celest.dart';

typedef Json = Map<String, dynamic>;
typedef JsonList = List<dynamic>;

/// Uses Celest serializer.
Object? serialize<T>(T obj) => Serializers.instance.serialize<T>(obj);

/// Uses Celest deserializer.
T deserialize<T>(Object? value) => Serializers.instance.deserialize<T>(value);
