import '../dao.dart';
import 'sim_backend.dart';

mixin GetInitialAppInfo implements Dao {
  //
  @override
  Future<Numbers_RESPONSE> loadNumberDescription({required int number}) async {
    //
    // Waits half a second, to simulate the latency of the real internet connection.
    await simulatesWaiting(500);

    return Numbers_RESPONSE(
      description: "This is a simulated description for number $number!",
    );
  }
}
