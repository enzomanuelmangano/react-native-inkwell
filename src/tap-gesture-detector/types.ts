import type {
  LongPressGestureHandlerProps,
  TapGestureHandlerProps,
} from 'react-native-gesture-handler';

export type TapGestureHandlersTypes = 'singleTap' | 'doubleTap' | 'longPress';

export type TapGestureHandlersProps =
  | TapGestureHandlerProps
  | LongPressGestureHandlerProps;

export type GestureDetector<
  StringType extends TapGestureHandlersTypes,
  Type extends TapGestureHandlersProps
> = {
  [Property in keyof Type as `${StringType}${Capitalize<
    string & Property
  >}`]: Type[Property];
};

export type SingleTapGestureDetectorProps = GestureDetector<
  'singleTap',
  TapGestureHandlerProps
>;

export type DoubleTapGestureDetectorProps = GestureDetector<
  'doubleTap',
  Omit<TapGestureHandlerProps, 'numberOfTaps'>
>;

export type LongTapGestureDetectorProps = GestureDetector<
  'longPress',
  LongPressGestureHandlerProps
>;

export type TapGestureDetectorProps = SingleTapGestureDetectorProps &
  DoubleTapGestureDetectorProps &
  LongTapGestureDetectorProps;

export type { LongPressGestureHandlerProps, TapGestureHandlerProps };
