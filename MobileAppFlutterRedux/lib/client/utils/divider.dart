import 'package:flutter/material.dart';

import '../theme/app_themes.dart';

class ThinDivider extends StatelessWidget {
  const ThinDivider({super.key});

  @override
  Widget build(BuildContext context) {
    return const Divider(
      height: 8,
      thickness: 0.25,
      color: AppColor.textDimmed,
    );
  }
}
