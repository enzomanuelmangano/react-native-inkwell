import type { View } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';

import type { InkWellRefType } from '../types';

const useInkWellRef = (): InkWellRefType => {
  return useAnimatedRef<View>();
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useInkWellRefWrapper = (ref: any): InkWellRefType => {
  const aref = useAnimatedRef<View>();

  if (ref) return ref;
  return aref;
};

export { useInkWellRef, useInkWellRefWrapper };
