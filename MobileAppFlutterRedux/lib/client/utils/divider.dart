import 'package:flutter/material.dart';
import 'package:mobile_app_flutter_redux/client/infra/theme/app_themes.dart';

class ThinDivider extends StatelessWidget {
  const ThinDivider();

  @override
  Widget build(BuildContext context) {
    return const Divider(
      height: 8,
      thickness: 0.25,
      color: AppColor.textDimmed,
    );
  }
}
