import type {
  GestureEventPayload,
  LongPressGestureHandlerGestureEvent,
  TapGestureHandlerEventPayload,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import React, { useCallback, useEffect } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { TapGestureDetector } from './tap-gesture-detector';

interface InkWellProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onTapDown?: () => void;
  onTap?: () => void;
  onTapCancel?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  splashColor?: string;
  highlightColor?: string;
}

const DEFAULT_SPLASH_COLOR = 'rgba(0,0,0,0.1)';
const DEFAULT_HIGHLIGHT_COLOR = 'rgba(0,0,0,0.05)';

const InkWell: React.FC<InkWellProps> = ({
  children,
  style,
  onTap,
  onTapDown,
  onTapCancel,
  splashColor = DEFAULT_SPLASH_COLOR,
  highlightColor = DEFAULT_HIGHLIGHT_COLOR,
  onDoubleTap,
  onLongPress,
}) => {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);

  const maxRippleRadius = useSharedValue(0);
  const rippleOpacity = useSharedValue(1);
  const highlightOpacity = useSharedValue(0);

  const initialScale = !onDoubleTap ? 0.03 : 0;
  const scale = useSharedValue(initialScale);
  const aref = useAnimatedRef<View>();

  const onFinish = useCallback(() => {
    'worklet';
    scale.value = withTiming(1, {
      duration: Math.max(maxRippleRadius.value / 0.325, 500),
    });
    rippleOpacity.value = withDelay(
      150,
      withTiming(0, {
        duration: Math.max(maxRippleRadius.value / 2, 200),
      })
    );
    highlightOpacity.value = withTiming(0);
  }, [highlightOpacity, maxRippleRadius.value, rippleOpacity, scale]);

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
      scale.value = initialScale;
      scale.value = withTiming(1, {
        duration: Math.max(maxRippleRadius.value / 0.3, 500),
      });
    },
    [
      centerX,
      centerY,
      highlightOpacity,
      initialScale,
      maxRippleRadius.value,
      rippleOpacity,
      scale,
    ]
  );

  const tapHandler = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onStart: (event) => {
      if (onTapDown) runOnJS(onTapDown)();
      onStart(event);
    },
    onActive: () => {
      if (onTap) runOnJS(onTap)();
    },
    onCancel: () => {
      if (onTapCancel) runOnJS(onTapCancel)();
    },
    onFinish,
  });

  const onDoubleTapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart,
      onActive: () => {
        if (onDoubleTap) runOnJS(onDoubleTap)();
      },
      onFinish,
    });

  const onLongPressGestureEvent =
    useAnimatedGestureHandler<LongPressGestureHandlerGestureEvent>({
      onActive: (event) => {
        // TODO: Investigate on event.oldState
        if (onLongPress && (event as any).oldState !== 0)
          runOnJS(onLongPress)();
      },
      onFinish,
    });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!aref || !aref.current) return;
      aref.current.measure((_, __, width, height) => {
        maxRippleRadius.value = Math.sqrt(width ** 2 + height ** 2);
      });
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [aref, maxRippleRadius]);

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

  return (
    <View ref={aref} style={style}>
      <TapGestureDetector
        longPressOnGestureEvent={onLongPress && onLongPressGestureEvent}
        doubleTapOnGestureEvent={onDoubleTap && onDoubleTapGestureEvent}
        singleTapOnGestureEvent={tapHandler}
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
            style={[styles.ripple, { backgroundColor: splashColor }, rStyle]}
          />
          {children}
        </Animated.View>
      </TapGestureDetector>
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

export { InkWell };
