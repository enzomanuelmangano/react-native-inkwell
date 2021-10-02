import { useCallback } from 'react';
import type {
  GestureEventPayload,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import type { InkWellProps } from 'react-native-inkwell';
import Animated, {
  cancelAnimation,
  runOnJS,
  runOnUI,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { DEFAULT_SCALE_EASING } from '../constants';

interface UseAnimatedHandlers extends Pick<InkWellProps, 'childRef'> {
  highlightOpacity: Animated.SharedValue<number>;
  rippleOpacity: Animated.SharedValue<number>;
  maxRippleRadius: Animated.SharedValue<number>;
  scale: Animated.SharedValue<number>;
  scaleTimingConfig?: Animated.WithTimingConfig;
  centerX: Animated.SharedValue<number>;
  centerY: Animated.SharedValue<number>;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useAnimatedHandlers = ({
  childRef,
  highlightOpacity,
  rippleOpacity,
  maxRippleRadius,
  scale,
  scaleTimingConfig,
  centerX,
  centerY,
}: UseAnimatedHandlers) => {
  const isInChildLayout = useCallback(
    (touchX: number, touchY: number) => {
      if (!childRef?.current) return false;
      const childRefLayout = childRef?.current?.getLayout?.();
      // Unfortunately, if the UI is clicked very quickly
      // in the component initialization phase,
      // it is possible that the child's getLayout
      // function has not yet been created.
      // In this situation, if the InkWell has a child,
      // I don't start the animation assuming by
      // default that it is clicking on the child.
      if (childRefLayout === null) return true;

      if (!childRefLayout) return false;
      const { x, y, width, height } = childRefLayout;
      return (
        touchX > x && touchX < x + width && touchY > y && touchY < y + height
      );
    },
    [childRef]
  );

  const onStartAnimation = useCallback(
    (event: Readonly<GestureEventPayload & TapGestureHandlerEventPayload>) => {
      'worklet';
      cancelAnimation(highlightOpacity);
      highlightOpacity.value = 0;
      highlightOpacity.value = withTiming(1);

      cancelAnimation(rippleOpacity);
      rippleOpacity.value = 1;

      centerX.value = event.x - maxRippleRadius.value;
      centerY.value = event.y - maxRippleRadius.value;

      cancelAnimation(scale);
      scale.value = 0;

      scale.value = withTiming(1, {
        duration:
          scaleTimingConfig?.duration ??
          Math.max(maxRippleRadius.value / 0.3, 500),
        easing: scaleTimingConfig?.easing ?? DEFAULT_SCALE_EASING,
      });
    },
    [
      centerX,
      centerY,
      highlightOpacity,
      maxRippleRadius.value,
      rippleOpacity,
      scale,
      scaleTimingConfig,
    ]
  );

  const onStartWrapper = useCallback(
    (event: Readonly<GestureEventPayload & TapGestureHandlerEventPayload>) => {
      if (isInChildLayout(event.x, event.y)) return;
      runOnUI(onStartAnimation)(event);
    },
    [isInChildLayout, onStartAnimation]
  );

  const onStart = useCallback(
    (event: Readonly<GestureEventPayload & TapGestureHandlerEventPayload>) => {
      'worklet';
      runOnJS(onStartWrapper)(event);
    },
    [onStartWrapper]
  );

  const onFinishAnimation = useCallback(() => {
    'worklet';
    highlightOpacity.value = withTiming(0, { duration: 100 });

    rippleOpacity.value = withDelay(
      150,
      withTiming(0, {
        duration: 250,
      })
    );

    const duration =
      maxRippleRadius.value - scale.value * maxRippleRadius.value;
    cancelAnimation(scale);
    scale.value = withTiming(1, {
      duration,
    });
  }, [highlightOpacity, maxRippleRadius.value, rippleOpacity, scale]);

  const onFinishWrapper = useCallback(
    (event: Readonly<GestureEventPayload & TapGestureHandlerEventPayload>) => {
      if (isInChildLayout(event.x, event.y)) return;
      runOnUI(onFinishAnimation)();
    },
    [isInChildLayout, onFinishAnimation]
  );

  const onFinish = useCallback(
    (event: Readonly<GestureEventPayload & TapGestureHandlerEventPayload>) => {
      'worklet';
      runOnJS(onFinishWrapper)(event);
    },
    [onFinishWrapper]
  );

  return { onStart, onFinish };
};

export { useAnimatedHandlers };
