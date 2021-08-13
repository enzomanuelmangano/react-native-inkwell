import type { TapGestureHandlerProps } from 'react-native-gesture-handler';
import type { StyleProp, ViewStyle } from 'react-native';

export type SingleTapGestureHandlerProps = {
  onTapDown?: () => void;
  onTap?: () => void;
  onTapCancel?: () => void;
};

export type DoubleTapGestureHandlerProps = {
  onDoubleTap?: () => void;
} & Pick<TapGestureHandlerProps, 'maxDelayMs'>;

export type LongPressGestureHandlerProps = {
  onLongPress?: () => void;
};

export type InkWellProps = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  splashColor?: string;
  highlightColor?: string;
} & SingleTapGestureHandlerProps &
  DoubleTapGestureHandlerProps &
  LongPressGestureHandlerProps;
