import { measure } from 'react-native-reanimated';

const measureView = (
  view: Parameters<typeof measure>['0']
): ReturnType<typeof measure> | null => {
  try {
    return measure(view);
  } catch {
    return null;
  }
};

export { measureView };
