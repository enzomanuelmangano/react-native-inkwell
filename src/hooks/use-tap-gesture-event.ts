import type {
  GestureEventPayload,
  LongPressGestureHandlerEventPayload,
  LongPressGestureHandlerGestureEvent,
  TapGestureHandlerEventPayload,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import type {
  DoubleTapGestureHandlerProps,
  SingleTapGestureHandlerProps,
  LongPressGestureHandlerProps,
} from 'src/types';

type UseTapGestureEventProps = SingleTapGestureHandlerProps &
  DoubleTapGestureHandlerProps &
  LongPressGestureHandlerProps & {
    defaultHandlers?: Animated.GestureHandlers<
      Readonly<
        GestureEventPayload &
          (TapGestureHandlerEventPayload | LongPressGestureHandlerEventPayload)
      >,
      {}
    >;
  };

export const useTapGestureEvent = ({
  onTap,
  onTapCancel,
  onTapDown,
  onDoubleTap,
  onLongPress,
  defaultHandlers: handlers,
}: UseTapGestureEventProps) => {
  const onSingleTapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: (event) => {
        if (onTapDown) runOnJS(onTapDown)();
        handlers?.onStart?.(event, {});
      },
      onActive: () => {
        if (onTap) runOnJS(onTap)();
      },
      onCancel: () => {
        if (onTapCancel) runOnJS(onTapCancel)();
      },
      onFinish: handlers?.onFinish,
    });

  const onDoubleTapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: handlers?.onStart,
      onActive: () => {
        if (onDoubleTap) runOnJS(onDoubleTap)();
      },
      onFinish: handlers?.onFinish,
    });

  const onLongPressGestureEvent =
    useAnimatedGestureHandler<LongPressGestureHandlerGestureEvent>({
      onActive: (event) => {
        // TODO: Investigate on event.oldState
        if (onLongPress && (event as any).oldState === 2) {
          runOnJS(onLongPress)();
        }
      },
      onFinish: handlers?.onFinish,
    });

  return {
    onSingleTapGestureEvent,
    onDoubleTapGestureEvent,
    onLongPressGestureEvent,
  };
};