import 'package:http/http.dart';

import '../dao.dart';

mixin GetInitialAppInfo implements Dao {
  //
  static const notFound = 'not-found';

  @override
  Future<Numbers_RESPONSE> loadNumberDescription({required int number}) async {
    //
    String description = await read(Uri.http("numbersapi.com", "$number", {'default': notFound}));

    if (description == notFound)
      throw DaoGeneralError('We cannot find a description for number $number.');
    else
      return Numbers_RESPONSE(description: description);
  }
}
