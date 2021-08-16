import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  GestureEventPayload,
  LongPressGestureHandler,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { useTapGestureEvent } from './hooks/use-tap-gesture-event';
import type { InkWellProps } from './types';

const DEFAULT_SPLASH_COLOR = 'rgba(0,0,0,0.1)';
const DEFAULT_HIGHLIGHT_COLOR = 'rgba(0,0,0,0.03)';
const DEFAULT_TAP_MAX_DURATION_MS = 3000;

const clamp = (min: number, max: number, val: number) => {
  'worklet';
  return Math.min(Math.max(min, val), max);
};

const InkWell: React.FC<InkWellProps> = ({
  enabled,
  children,
  radius,
  style,
  onTap,
  onTapDown,
  onTapCancel,
  splashColor = DEFAULT_SPLASH_COLOR,
  highlightColor = DEFAULT_HIGHLIGHT_COLOR,
  onDoubleTap,
  onLongPress,
  maxDelayMs,
  simultaneousHandlers,
  waitFor,
  minDurationMs,
}) => {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);

  const maxRippleRadius = useSharedValue(0);
  const rippleOpacity = useSharedValue(1);
  const highlightOpacity = useSharedValue(0);

  const scale = useSharedValue(0);
  const aref = useAnimatedRef<View>();

  const onStart = useCallback(
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
        duration: Math.max(maxRippleRadius.value / 0.3, 500),
      });
    },
    [
      centerX,
      centerY,
      highlightOpacity,
      maxRippleRadius.value,
      rippleOpacity,
      scale,
    ]
  );

  const onFinish = useCallback(() => {
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

  const {
    onSingleTapGestureEvent,
    onDoubleTapGestureEvent,
    onLongPressGestureEvent,
  } = useTapGestureEvent({
    onTap,
    onTapCancel,
    onTapDown,
    onDoubleTap,
    onLongPress,
    defaultHandlers: {
      onStart,
      onFinish,
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!aref || !aref.current) return;
      aref.current.measure((_, __, width, height) => {
        const rippleRadius = Math.sqrt(width ** 2 + height ** 2);
        maxRippleRadius.value = radius
          ? clamp(0, radius, rippleRadius)
          : rippleRadius;
      });
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [aref, maxRippleRadius, radius]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: centerX.value,
        },
        { translateY: centerY.value },
        { scale: scale.value },
      ],
      width: maxRippleRadius.value * 2,
      height: maxRippleRadius.value * 2,
      borderRadius: maxRippleRadius.value,
      opacity: rippleOpacity.value,
    };
  });

  const rHighlightStyle = useAnimatedStyle(() => ({
    opacity: highlightOpacity.value,
  }));

  const singleTapRef = useRef(null);
  const doubleTapRef = useRef(null);

  return (
    <View ref={aref} style={style}>
      <LongPressGestureHandler
        enabled={Boolean(onLongPress) && enabled}
        onGestureEvent={onLongPressGestureEvent}
        simultaneousHandlers={simultaneousHandlers}
        waitFor={waitFor}
        minDurationMs={minDurationMs}
      >
        <Animated.View style={StyleSheet.absoluteFill}>
          <TapGestureHandler
            enabled={Boolean(onDoubleTap) && enabled}
            ref={doubleTapRef}
            numberOfTaps={2}
            onGestureEvent={onDoubleTapGestureEvent}
            maxDurationMs={DEFAULT_TAP_MAX_DURATION_MS}
            maxDelayMs={maxDelayMs}
            simultaneousHandlers={simultaneousHandlers}
            waitFor={waitFor}
          >
            <Animated.View style={StyleSheet.absoluteFill}>
              <TapGestureHandler
                enabled={enabled}
                ref={singleTapRef}
                waitFor={waitFor ? [doubleTapRef, waitFor] : doubleTapRef}
                simultaneousHandlers={simultaneousHandlers}
                onGestureEvent={onSingleTapGestureEvent}
                maxDurationMs={DEFAULT_TAP_MAX_DURATION_MS}
              >
                <Animated.View style={[style, styles.content]}>
                  <Animated.View
                    style={[
                      {
                        ...StyleSheet.absoluteFillObject,
                        backgroundColor: highlightColor,
                      },
                      rHighlightStyle,
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.ripple,
                      { backgroundColor: splashColor },
                      rStyle,
                    ]}
                  />
                  {children}
                </Animated.View>
              </TapGestureHandler>
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </LongPressGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  ripple: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  content: { overflow: 'hidden', width: '100%', height: '100%' },
});

export type { InkWellProps };
export default InkWell;
