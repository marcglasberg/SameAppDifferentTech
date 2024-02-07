import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_flutter_celest/models/utils/utils.dart';

void main() {
  test('round', () {
    expect(round(1.2345), 1.23);
    expect(round(1.23), 1.23);
    expect(round(1.239), 1.24);
    expect(round(0), 0);
    expect(round(-1.2345), -1.23);
  });
}
