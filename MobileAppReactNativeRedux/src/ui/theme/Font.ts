import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import Color from './Color';

export class Font {

  /** Small text. No need to pass the color if it's Color.text. */
  static small(color: string = Color.text): TextStyle {
    return { fontSize: 16, fontWeight: 'normal', color };
  }

  /** Medium text. No need to pass the color if it's Color.text. */
  static medium(color: string = Color.text): TextStyle {
    return { fontSize: 20, fontWeight: 'normal', color };
  }

  /** Same as medium text, but bold. No need to pass the color if it's Color.text. */
  static bold(color: string = Color.text): TextStyle {
    return { fontSize: 20, fontWeight: 'bold', color };
  }

  /** Big and bold. No need to pass the color if it's Color.text. */
  static big(color: string = Color.text): TextStyle {
    return { fontSize: 23, fontWeight: 'bold', color };
  }

  /** Large, not bold. No need to pass the color if it's Color.text. */
  static large(color: string = Color.text): TextStyle {
    return { fontSize: 26, fontWeight: 'normal', color };
  }
}
