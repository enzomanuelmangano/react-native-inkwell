import type { ReactNode, Ref } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type {
  LongPressGestureHandlerProps as LongPressGestureProps,
  TapGestureHandlerProps,
} from 'react-native-gesture-handler';

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
} & Pick<LongPressGestureProps, 'minDurationMs'>;

type InkWellProps = {
  enabled?: boolean;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
  splashColor?: string;
  highlightColor?: string;
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
};
