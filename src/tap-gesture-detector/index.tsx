import React, { useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  LongPressGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import type {
  LongPressGestureHandlerProps,
  TapGestureDetectorProps,
  TapGestureHandlerProps,
  TapGestureHandlersProps,
  TapGestureHandlersTypes,
} from './types';

const isEmpty = (obj: Object) => {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop) && typeof (obj as any)[prop] !== 'undefined')
      return false;
  }
  return true;
};

const lowerCaseFirstLetter = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

const destructureGestureProps = (
  props: TapGestureDetectorProps,
  startsWith: TapGestureHandlersTypes
): TapGestureHandlersProps => {
  return Object.keys(props).reduce((acc, key: string) => {
    if (!key.startsWith(startsWith)) return acc;
    const newKey = key.replace(startsWith, '');
    const value = (props as any)?.[key];

    return { ...acc, [lowerCaseFirstLetter(newKey)]: value };
  }, {});
};

const TapGestureDetector: React.FC<TapGestureDetectorProps> = ({
  children,
  ...rest
}) => {
  const singleTapRef = useRef(null);
  const doubleTapRef = useRef(null);
  const longPressRef = useRef(null);

  const singleTapProps: TapGestureHandlerProps = useMemo(
    () => destructureGestureProps(rest, 'singleTap'),
    [rest]
  );

  const doubleTapProps: TapGestureHandlerProps = useMemo(
    () => destructureGestureProps(rest, 'doubleTap'),
    [rest]
  );

  const longPressProps: LongPressGestureHandlerProps = useMemo(
    () => destructureGestureProps(rest, 'longPress'),
    [rest]
  );

  return (
    <LongPressGestureHandler
      enabled={!isEmpty(longPressProps)}
      ref={longPressRef}
      {...longPressProps}
    >
      <Animated.View style={StyleSheet.absoluteFill}>
        <TapGestureHandler
          enabled={!isEmpty(doubleTapProps)}
          ref={doubleTapRef}
          {...doubleTapProps}
          numberOfTaps={2}
        >
          <Animated.View style={StyleSheet.absoluteFill}>
            <TapGestureHandler
              enabled={!isEmpty(singleTapProps)}
              ref={singleTapRef}
              waitFor={doubleTapRef}
              {...singleTapProps}
            >
              <Animated.View style={StyleSheet.absoluteFill}>
                {children}
              </Animated.View>
            </TapGestureHandler>
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
    </LongPressGestureHandler>
  );
};

export { TapGestureDetector };
