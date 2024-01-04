import { Model, model, modelAction, prop } from 'mobx-keystone';

const palette = {

  /** Always white, even in dark mode. */
  white: '#fff',

  /** Always black, even in dark mode. */
  black: '#000',

  /** Light in light mode, dark in dark mode. */
  background: '#fff',
  backgroundDimmed: '#fff',
  backgroundSemiTransparent: 'rgba(255, 255, 255, 0.55)',

  /** Dark in light mode, light in dark mode. */
  foreground: '#000',
  foregroundSemiTransparent: 'rgba(0, 0, 0, 0.55)',

  transparent: 'rgba(0, 0, 0, 0)',

  base10: '#eee',
  base20: '#ccc',
  base30: '#aaa',
  base40: '#888',
  base50: '#555',
  base60: '#222',

  red: '#aa2222',
  lightGreen: '#30F030',
  green: '#309030',
  blue: '#2196F3',
  darkBlue: '#263073'
} as const;

// Define types for your theme properties
type Theme = {
  transparent: string;
  text: string;
  invertedText: string;
  textDimmed: string;
  appBar: string;
  blueText: string;
  background: string;
  backgroundDimmed: string;
  error: string;
  up: string;
  down: string;
  disabledBackground: string;
  divider: string;
  disabledText: string;
};

const lightTheme: Theme = {
  transparent: palette.transparent,
  text: palette.foreground,
  invertedText: palette.background,
  textDimmed: palette.foregroundSemiTransparent,
  appBar: palette.blue,
  blueText: palette.blue,
  background: palette.background,
  backgroundDimmed: palette.base10,
  error: palette.red,
  up: palette.green,
  down: palette.red,
  disabledBackground: palette.base20,
  divider: palette.base30,
  disabledText: palette.base40
} as const;

const darkTheme: Theme = {
  transparent: palette.transparent,
  text: palette.background,
  invertedText: palette.foreground,
  textDimmed: palette.backgroundSemiTransparent,
  appBar: palette.darkBlue,
  blueText: palette.blue,
  background: palette.foreground,
  backgroundDimmed: palette.base60,
  error: palette.red,
  up: palette.green,
  down: palette.red,
  disabledBackground: palette.base50,
  divider: palette.base30,
  disabledText: palette.base40
} as const;

@model('_Color')
export class _Color extends Model({
  transparent: prop<string>(() => '' as const),
  text: prop<string>(() => '' as const),
  invertedText: prop<string>(() => '' as const),
  textDimmed: prop<string>(() => '' as const),
  appBar: prop<string>(() => '' as const),
  blueText: prop<string>(() => '' as const),
  background: prop<string>(() => '' as const),
  backgroundDimmed: prop<string>(() => '' as const),
  error: prop<string>(() => '' as const),
  up: prop<string>(() => '' as const),
  down: prop<string>(() => '' as const),
  disabledBackground: prop<string>(() => '' as const),
  divider: prop<string>(() => '' as const),
  disabledText: prop<string>(() => '' as const)
}) {
  palette = palette;

  // constructor() {
  //   super({
  //   this.setLightTheme();
  // }

  @modelAction
  setTheme(theme: Theme) {
    Object.assign(this, theme);
  }

  @modelAction
  setLightTheme() {
    this.setTheme(lightTheme);
  }

  @modelAction
  setDarkTheme() {
    this.setTheme(darkTheme);
  }
}

const Color = new _Color({});

/**
 * Usage example:
 *
 * const $title: TextStyle = { color: Color.text, fontSize: 20 };
 * const $name: TextStyle = { fontSize: 16, color: Color.textDimmed };
 * const $price: TextStyle = { fontSize: 23, color: Color.blueText, fontWeight: 'bold' };
 *
 * if (this.isLightMode) Color.setLightTheme();
 * else Color.setDarkTheme();
 */

export default Color;
