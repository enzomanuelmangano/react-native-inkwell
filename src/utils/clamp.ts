export const clamp = (min: number, max: number, val: number): number => {
  'worklet';
  return Math.min(Math.max(min, val), max);
};
