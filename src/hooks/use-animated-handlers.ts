import { useCallback } from 'react';
import type {
  GestureEventPayload,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import type { InkWellProps, InkWellRefType } from 'react-native-inkwell';
import Animated, {
  cancelAnimation,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { DEFAULT_SCALE_EASING } from '../constants';
import { clamp } from '../utils/clamp';
import { measureView } from '../utils/measure';

interface UseAnimatedHandlers extends Pick<InkWellProps, 'childrenRefs'> {
  animatedRef: InkWellRefType;
  radius?: number;
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
  childrenRefs,
  radius,
  highlightOpacity,
  rippleOpacity,
  maxRippleRadius,
  scale,
  scaleTimingConfig,
  centerX,
  centerY,
  animatedRef,
}: UseAnimatedHandlers) => {
  const isInChildLayout = useCallback(
    (childRef: InkWellRefType, touchX: number, touchY: number) => {
      'worklet';
      if (!childRef) return;
      const childRefLayout = measureView(childRef);

      // Unfortunately, if the UI is clicked very quickly
      // in the component initialization phase,
      // it is possible that the child's layout
      // is not ready to be measured.
      // In this situation, if the InkWell has a child,
      // I don't start the animation assuming by
      // default that it is clicking on the child.
      if (!childRefLayout) return true;
      const { pageX, pageY, width, height } = childRefLayout;

      return (
        touchX > pageX &&
        touchX < pageX + width &&
        touchY > pageY &&
        touchY < pageY + height
      );
    },
    []
  );

  const isInChildrenLayout = useCallback(
    (touchX: number, touchY: number) => {
      'worklet';
      if (!childrenRefs) return false;
      const refs = Array.isArray(childrenRefs) ? childrenRefs : [childrenRefs];

      for (let i = 0; i < refs.length; i++) {
        const childRef = refs[i];
        if (isInChildLayout(childRef, touchX, touchY)) {
          return true;
        }
      }
      return false;
    },
    [childrenRefs, isInChildLayout]
  );

  const onStartAnimation = useCallback(
    async (
      event: Readonly<GestureEventPayload & TapGestureHandlerEventPayload>
    ) => {
      'worklet';
      const viewLayout = measureView(animatedRef);
      if (!viewLayout) return;
      const { width, height } = viewLayout;

      const rippleRadius = Math.sqrt(width ** 2 + height ** 2);
      maxRippleRadius.value = radius
        ? clamp(0, radius, rippleRadius)
        : rippleRadius;

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
      animatedRef,
      centerX,
      centerY,
      highlightOpacity,
      maxRippleRadius,
      radius,
      rippleOpacity,
      scale,
      scaleTimingConfig?.duration,
      scaleTimingConfig?.easing,
    ]
  );

  const onStart = useCallback(
    (event: Readonly<GestureEventPayload & TapGestureHandlerEventPayload>) => {
      'worklet';
      if (isInChildrenLayout(event.absoluteX, event.absoluteY)) return;
      onStartAnimation(event);
    },
    [isInChildrenLayout, onStartAnimation]
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

  const onFinish = useCallback(
    (event: Readonly<GestureEventPayload & TapGestureHandlerEventPayload>) => {
      'worklet';
      if (isInChildrenLayout(event.absoluteX, event.absoluteY)) return;
      onFinishAnimation();
    },
    [isInChildrenLayout, onFinishAnimation]
  );

  return { onStart, onFinish };
};

export { useAnimatedHandlers };
