import React, { useEffect } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface InkWellProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onTapDown?: () => void;
  onTap?: () => void;
  onTapCancel?: () => void;
}

const InkWell: React.FC<InkWellProps> = ({
  children,
  style,
  onTap,
  onTapDown,
  onTapCancel,
}) => {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);

  const maxRippleSize = useSharedValue(0);
  const rippleOpacity = useSharedValue(1);
  const scale = useSharedValue(0);
  const aref = useAnimatedRef<View>();

  const tapHandler = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onStart: (event) => {
      if (onTapDown) runOnJS(onTapDown)();

      const halfRippleSize = maxRippleSize.value / 2;

      cancelAnimation(rippleOpacity);
      rippleOpacity.value = 1;

      centerX.value = event.x - halfRippleSize;
      centerY.value = event.y - halfRippleSize;

      cancelAnimation(scale);
      scale.value = 0;
      scale.value = withTiming(1, {
        duration: Math.max(halfRippleSize / 0.3, 500),
      });
    },
    onActive: () => {
      if (onTap) runOnJS(onTap)();
    },
    onCancel: () => {
      if (onTapCancel) runOnJS(onTapCancel)();
    },
    onFinish: () => {
      scale.value = withTiming(1, {
        duration: Math.max(maxRippleSize.value / 0.65, 500),
      });
      rippleOpacity.value = withTiming(0, {
        duration: Math.max(maxRippleSize.value / 4, 200),
      });
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!aref || !aref.current) return;
      aref.current.measure((_, __, width, height) => {
        maxRippleSize.value = Math.sqrt(width ** 2 + height ** 2) * 2;
      });
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [aref, maxRippleSize]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: centerX.value,
        },
        { translateY: centerY.value },
        { scale: scale.value },
      ],
      width: maxRippleSize.value,
      height: maxRippleSize.value,
      borderRadius: maxRippleSize.value / 2,
      opacity: rippleOpacity.value,
    };
  });

  return (
    <View ref={aref} style={style}>
      <TapGestureHandler onGestureEvent={tapHandler}>
        <Animated.View style={[style, styles.content]}>
          <Animated.View style={[styles.ripple, rStyle]} />
          {children}
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  ripple: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  content: { overflow: 'hidden', width: '100%', height: '100%' },
});

export { InkWell };
