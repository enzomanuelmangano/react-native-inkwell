import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { TapGestureHandlerProps } from 'react-native-gesture-handler';

type SingleTapGestureHandlerProps = {
  onTapDown?: () => void;
  onTap?: () => void;
  onTapCancel?: () => void;
};

type DoubleTapGestureHandlerProps = {
  onDoubleTap?: () => void;
} & Pick<TapGestureHandlerProps, 'maxDelayMs'>;

type LongPressGestureHandlerProps = {
  onLongPress?: () => void;
};

type InkWellProps = {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  splashColor?: string;
  highlightColor?: string;
} & SingleTapGestureHandlerProps &
  DoubleTapGestureHandlerProps &
  LongPressGestureHandlerProps;

export {
  SingleTapGestureHandlerProps,
  DoubleTapGestureHandlerProps,
  LongPressGestureHandlerProps,
  InkWellProps,
};
