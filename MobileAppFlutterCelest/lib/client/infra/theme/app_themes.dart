import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:themed/themed.dart';

class Font {
  Font._();

  static const fontFeatures = const <FontFeature>[
    FontFeature.tabularFigures(),
    FontFeature.liningFigures(),
    FontFeature.slashedZero(),
  ];

  static const small = TextStyleRef(
    TextStyle(
      inherit: false,
      fontSize: 16,
      color: AppColor.text,
      fontWeight: FontWeight.normal,
      textBaseline: TextBaseline.alphabetic,
      fontFeatures: fontFeatures,
      leadingDistribution: TextLeadingDistribution.even,
    ),
  );

  static const medium = TextStyleRef(
    TextStyle(
      inherit: false,
      fontSize: 20,
      color: AppColor.text,
      fontWeight: FontWeight.normal,
      textBaseline: TextBaseline.alphabetic,
      fontFeatures: fontFeatures,
      leadingDistribution: TextLeadingDistribution.even,
    ),
  );

  static const bold = TextStyleRef(
    TextStyle(
      inherit: false,
      fontSize: 20,
      color: AppColor.text,
      fontWeight: FontWeight.bold,
      textBaseline: TextBaseline.alphabetic,
      fontFeatures: fontFeatures,
      leadingDistribution: TextLeadingDistribution.even,
    ),
  );

  static const large = TextStyleRef(
    TextStyle(
      inherit: false,
      fontSize: 20,
      color: AppColor.text,
      fontWeight: FontWeight.normal,
      textBaseline: TextBaseline.alphabetic,
      fontFeatures: fontFeatures,
      leadingDistribution: TextLeadingDistribution.even,
    ),
  );

  static const giant = TextStyleRef(
    TextStyle(
      inherit: false,
      fontSize: 26,
      color: AppColor.text,
      fontWeight: FontWeight.normal,
      textBaseline: TextBaseline.alphabetic,
      fontFeatures: fontFeatures,
      leadingDistribution: TextLeadingDistribution.even,
    ),
  );
}

class AppColor {
  AppColor._();

  static const text = ColorRef(const Color(0xF0000000), id: 'text');
  static const textDimmed = ColorRef(const Color(0x60000000), id: 'dimmed');
  static const invertedText = ColorRef(const Color(0xFFFFFFFF), id: 'invertedText');
  static const bkg = ColorRef(const Color(0xFFFFFFFF), id: 'bkg');
  static const bkgGray = ColorRef(const Color(0xFFE0E0E0), id: 'bkgGray');
  static const disabledGray = ColorRef(const Color(0x70777777), id: 'disabledGray');
  static const blue = ColorRef(const Color(0xFF2196F3), id: 'blue');
  static const darkBlue = ColorRef(const Color(0xFF263073), id: 'darkBlue');
  static const green = ColorRef(const Color(0xFF309030), id: 'green');
  static const buttonGreen = ColorRef(const Color(0xFF309030), id: 'buttonGreen');
  static const darkGreen = ColorRef(const Color(0xFF306030), id: 'darkGreen');
  static const red = ColorRef(const Color(0xFFAA2222), id: 'red');
  static const buttonRed = ColorRef(const Color(0xFFAA2222), id: 'buttonRed');
  static const white = ColorRef(const Color(0xFFFFFFFF), id: 'white');
}

Map<ThemeRef, Object> darkTheme = {
  AppColor.text: const Color(0xFFFFFFFF),
  AppColor.textDimmed: const Color(0x60FFFFFF),
  AppColor.invertedText: const Color(0xF0000000),
  AppColor.bkg: const Color(0xF0000000),
  AppColor.bkgGray: const Color(0xF0222222),
  AppColor.disabledGray: const Color(0x70777777),
  AppColor.blue: const Color(0xFF2196F3),
  AppColor.darkBlue: const Color(0xFF263073),
  AppColor.green: const Color(0xFF26FF5C),
  AppColor.buttonGreen: const Color(0xFF306030),
  AppColor.darkGreen: const Color(0xFF306030),
  AppColor.red: const Color(0xFFAA2222),
  AppColor.buttonRed: const Color(0xFFAA2222),
  AppColor.white: const Color(0xFFFFFFFF),
};

const SystemUiOverlayStyle appBarSystemUiOverlayStyle = SystemUiOverlayStyle(
  //
  // Only Android:
  statusBarColor: Colors.transparent,
  statusBarIconBrightness: Brightness.dark,
  //
  // Only iOS:
  statusBarBrightness: Brightness.light,
);

void statusBarWithWhiteText([statusBarColor = Colors.transparent]) {
  SystemChrome.setSystemUIOverlayStyle(
    SystemUiOverlayStyle(
      //
      // Only Android:
      statusBarColor: statusBarColor,
      statusBarIconBrightness: Brightness.light,
      //
      // Only iOS:
      statusBarBrightness: Brightness.dark,
    ),
  );
}

void statusBarWithDarkText([statusBarColor = Colors.transparent]) {
  SystemChrome.setSystemUIOverlayStyle(
    SystemUiOverlayStyle(
      //
      // Only Android:
      statusBarColor: statusBarColor,
      statusBarIconBrightness: Brightness.dark,
      //
      // Only iOS:
      statusBarBrightness: Brightness.light,
    ),
  );
}

const double px4 = 4;
const double px8 = 8;
const double px12 = 12;
const double px16 = 16;
const double px20 = 20;
const double px24 = 24;
const double px28 = 28;
const double px32 = 32;
const double px36 = 36;
const double px48 = 48;
const double px64 = 64;
const double px80 = 80;

const Widget space0 = SizedBox();
const Widget space4 = SizedBox(width: px4, height: px4);
const Widget space8 = SizedBox(width: px8, height: px8);
const Widget space12 = SizedBox(width: px12, height: px12);
const Widget space16 = SizedBox(width: px16, height: px16);
const Widget space20 = SizedBox(width: px20, height: px20);
const Widget space24 = SizedBox(width: px24, height: px24);
const Widget space28 = SizedBox(width: px28, height: px28);
const Widget space32 = SizedBox(width: px32, height: px32);
const Widget space36 = SizedBox(width: px36, height: px36);
const Widget space48 = SizedBox(width: px48, height: px48);
const Widget space80 = SizedBox(width: px80, height: px80);
