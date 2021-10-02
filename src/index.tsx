import React, {
  useImperativeHandle,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import {
  LongPressGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import {
  DEFAULT_HIGHLIGHT_COLOR,
  DEFAULT_SCALE_EASING,
  DEFAULT_SPLASH_COLOR,
  DEFAULT_TAP_MAX_DURATION_MS,
  INKWELL_CHILD_LAYOUT_PROPS,
} from './constants';
import { useAnimatedHandlers } from './hooks/use-animated-handlers';
import { useTapGestureEvent } from './hooks/use-tap-gesture-event';
import type { InkWellProps, InkWellRefType } from './types';
import { clamp } from './utils/clamp';

const InkWell = React.forwardRef<InkWellRefType, InkWellProps>(
  (props, inkwellRef) => {
    const {
      enabled,
      children,
      radius,
      style,
      contentContainerStyle,
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
      easing = DEFAULT_SCALE_EASING,
      scaleDuration,
      childrenRefs,
    } = props;

    const centerX = useSharedValue(0);
    const centerY = useSharedValue(0);

    const maxRippleRadius = useSharedValue(0);
    const rippleOpacity = useSharedValue(1);
    const highlightOpacity = useSharedValue(0);

    const scale = useSharedValue(0);
    const layout = useRef<LayoutRectangle | null>(null);

    const getLayout = useCallback(() => layout?.current, []);

    useImperativeHandle(inkwellRef, () => ({ getLayout }), [getLayout]);

    const containerStyle = StyleSheet.flatten(style ?? {});

    useEffect(() => {
      if (!__DEV__) return;

      const incorrectStyleAssignments = Object.keys(containerStyle).filter(
        (value) => INKWELL_CHILD_LAYOUT_PROPS.includes(value)
      );

      if (incorrectStyleAssignments.length > 0) {
        // eslint-disable-next-line no-console
        console.warn(
          `InkWell child layout (${incorrectStyleAssignments}) must be applied through the contentContainerStyle prop`
        );
      }
    }, [containerStyle]);

    const onLayout: ViewProps['onLayout'] = useCallback(
      (event: LayoutChangeEvent) => {
        layout.current = event.nativeEvent.layout;
        const { width, height } = event.nativeEvent.layout;

        const rippleRadius = Math.sqrt(width ** 2 + height ** 2);
        maxRippleRadius.value = radius
          ? clamp(0, radius, rippleRadius)
          : rippleRadius;
      },
      [maxRippleRadius, radius]
    );

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

    const { onStart, onFinish } = useAnimatedHandlers({
      childrenRefs,
      highlightOpacity,
      rippleOpacity,
      maxRippleRadius,
      scale,
      scaleTimingConfig: {
        easing,
        duration: scaleDuration,
      },
      centerX,
      centerY,
    });

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

    return (
      <View onLayout={onLayout} style={style}>
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
                  <Animated.View
                    style={[
                      { borderRadius: containerStyle.borderRadius },
                      contentContainerStyle,
                      styles.content,
                    ]}
                  >
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
  }
);

const styles = StyleSheet.create({
  ripple: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  content: { overflow: 'hidden', width: '100%', height: '100%' },
});

export type { InkWellProps, InkWellRefType };
export default InkWell;
