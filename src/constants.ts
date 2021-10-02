import { Easing } from 'react-native-reanimated';

const DEFAULT_SPLASH_COLOR = 'rgba(0,0,0,0.1)';
const DEFAULT_HIGHLIGHT_COLOR = 'rgba(0,0,0,0.03)';
const DEFAULT_TAP_MAX_DURATION_MS = 3000;
const DEFAULT_SCALE_EASING = Easing.bezier(0.25, 0.5, 0.4, 1.0);

const INKWELL_CHILD_LAYOUT_PROPS = ['alignItems', 'justifyContent'];

export {
  DEFAULT_SPLASH_COLOR,
  DEFAULT_HIGHLIGHT_COLOR,
  DEFAULT_TAP_MAX_DURATION_MS,
  DEFAULT_SCALE_EASING,
  INKWELL_CHILD_LAYOUT_PROPS,
};
