import type { MutableRefObject, ReactNode, Ref, RefObject } from 'react';
import type { LayoutRectangle, StyleProp, ViewStyle } from 'react-native';
import type {
  LongPressGestureHandlerProps as LongPressGestureProps,
  TapGestureHandlerProps,
} from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';

type SingleTapGestureHandlerProps = {
  /**
   * Called when the user taps down the InkWell.
   */
  onTapDown?: () => void;
  /**
   * Called when the InkWell is clicked.
   * If the onDoubleTap callback is not specified,
   * onTap will be called immediately,
   * otherwise it will be called after maxDelayMs.
   */
  onTap?: () => void;
  /**
   * Called when the user cancels a tap.
   */
  onTapCancel?: () => void;
};

type DoubleTapGestureHandlerProps = {
  /**
   * Called when the InkWell is clicked two consecutive times in less than maxDelayMs.
   */
  onDoubleTap?: () => void;
} & Pick<TapGestureHandlerProps, 'maxDelayMs'>;

type LongPressGestureHandlerProps = {
  /**
   * Called when the component is pressed for more than minDurationMs.
   */
  onLongPress?: () => void;
} & Pick<LongPressGestureProps, 'minDurationMs'>;

type InkWellRefType = { getLayout?: () => LayoutRectangle | null };

type InkWellChildRef =
  | RefObject<InkWellRefType>
  | MutableRefObject<InkWellRefType>;

type InkWellProps = {
  childrenRefs?: InkWellChildRef | InkWellChildRef[];
  /**
   * Indicates whether InkWell should be active or not.
   */
  enabled?: boolean;
  /**
   * Decides the maximum radius of the Ripple Effect.
   * By default the Ripple effect will determine the radius
   * from the height and width of the component so that
   * it can expand as much as possible.
   */
  radius?: number;
  /**
   * A React Native style.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * The React Native style of the content.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
  /**
   * The splash color of the ripple effect.
   */
  splashColor?: string;
  /**
   * The backgroundColor of the View when the InkWell is activated.
   */
  highlightColor?: string;
  /**
   * The Reanimated EasingFunction.
   * Default: Easing.bezier(0.25, 0.5, 0.4, 1.0) (https://cubic-bezier.com/#.25,.5,.4,1)
   */
  easing?: Animated.WithTimingConfig['easing'];
  /**
   * The duration of ink scale animation.
   * The default value depends on the component's width and height.
   */
  scaleDuration?: number;
  waitFor?: Ref<unknown>;
  simultaneousHandlers?: Ref<unknown>;
} & SingleTapGestureHandlerProps &
  DoubleTapGestureHandlerProps &
  LongPressGestureHandlerProps;

export {
  SingleTapGestureHandlerProps,
  DoubleTapGestureHandlerProps,
  LongPressGestureHandlerProps,
  InkWellProps,
  InkWellRefType,
  InkWellChildRef,
};
