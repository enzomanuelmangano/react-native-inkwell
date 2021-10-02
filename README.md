<h1 align="center">
👉🏼 React Native InkWell
</h1>

A material touchable area that provides the ripple effect.
Inspired by the [InkWell Flutter](https://api.flutter.dev/flutter/material/InkWell-class.html) component.

<div align="center">
    <img src="https://github.com/enzomanuelmangano/react-native-inkwell/blob/main/.assets/inkwell_image.jpg" title="react-native-inkwell">
</div>

## Installation

**You need to have already installed the following packages:**

- [react-native-reanimated (>= 2.0.0)](https://docs.swmansion.com/react-native-reanimated/docs/installation)
- [react-native-gesture-handler (>= 1.0.0)](https://docs.swmansion.com/react-native-gesture-handler/docs/)

Open a Terminal in your project's folder and install the library using `yarn`:

```sh
yarn add react-native-inkwell
```

or with `npm`:

```sh
npm install react-native-inkwell
```

## Usage

```jsx
import InkWell from 'react-native-inkwell';

const YourRippleButton = () => (
  <InkWell
    style={{
      width: 200,
      height: 200,
      backgroundColor: 'white',
    }}
    contentContainerStyle={{
      alignItems: 'center',
      justifyContent: 'center',
    }}
    onTap={() => {
      console.log('tapped');
    }}
  >
    <Text>Tap Here</Text>
  </InkWell>
);
```

## Properties

### `enabled?: boolean`

Indicates whether InkWell should be active or not.

Default: `true`.

---

### `radius?: number`

Decides the maximum radius of the Ripple Effect. By default the Ripple effect will determine the radius from the height and width of the component so that it can expand as much as possible.

---

### `onTap?: () => void`

Called when the InkWell is clicked. If the onDoubleTap callback is not specified, onTap will be called immediately, otherwise it will be called after [maxDelayMs](https://github.com/enzomanuelmangano/react-native-inkwell/tree/main#maxdelayms-number).

---

### `onTapDown?: () => void`

Called when the user taps down the InkWell.

---

### `onTapCancel?: () => void`

Called when the user cancels a tap.

---

### `onDoubleTap?: () => void`

Called when the InkWell is clicked two consecutive times in less than [maxDelayMs](https://github.com/enzomanuelmangano/react-native-inkwell/tree/main#maxdelayms-number).

---

### `onLongPress?: () => void`

Called when the component is pressed for more than [minDurationMs](https://github.com/enzomanuelmangano/react-native-inkwell/tree/main#mindurationms-number).

---

### `maxDelayMs?: number`

[Maximum time, expressed in milliseconds, that can pass before the next tap — if many taps are required.](https://docs.swmansion.com/react-native-gesture-handler/docs/api/gesture-handlers/tap-gh/#maxdelayms)

This property is inherited from maxDelayMs of the react-native-gesture-handler's TapGestureHandler.

Default: `500`

---

### `minDurationMs?: number`

[Minimum time, expressed in milliseconds, that a finger must remain pressed on the corresponding view.](https://docs.swmansion.com/react-native-gesture-handler/docs/api/gesture-handlers/longpress-gh/#mindurationms)

This property is inherited from minDurationMs of the react-native-gesture-handler's LongPressGestureHandler.

Default: `500`

---

### `scaleDuration?: number`

The duration of ink scale animation.

Default: `depends on the component's width and height.`

---

### `easing?: Animated.WithTimingConfig["easing"]`

The Reanimated [EasingFunction](https://docs.swmansion.com/react-native-reanimated/docs/2.1.0/api/withTiming/).

Default: [Easing.bezier(0.25, 0.5, 0.4, 1.0)](https://cubic-bezier.com/#.25,.5,.4,1)

---

### `splashColor?: string`

The splash color of the ripple effect.

Default: `rgba(0,0,0,0.1)`;

---

### `highlightColor?: string`

The backgroundColor of the View when the InkWell is activated.

Default: `rgba(0,0,0,0.03)`;

---

### `style?: StyleProp<ViewStyle>`

[A React Native style.](https://reactnative.dev/docs/style)

---

### `contentContainerStyle?: StyleProp<ViewStyle>`

[The React Native style of the content.](https://reactnative.dev/docs/style)

---

### `children?: React.ReactNode`

The component that could be contained in the InkWell.

---

### `simultaneousHandlers and waitFor`

[Inherited from react-native-gesture-handler in order to support Cross Handler Interactions if needed.](https://docs.swmansion.com/react-native-gesture-handler/docs/interactions/)

---

## Nested InkWells

Since the InkWell is built on top of the react-native-gesture-handler component [TapGestureHandler](https://docs.swmansion.com/react-native-gesture-handler/docs/api/gesture-handlers/tap-gh/), by default, upon clicking an InkWell inside another, the tap will be propagated to the parent as well.

<div align="center">
    <img src="https://github.com/enzomanuelmangano/react-native-inkwell/blob/main/.assets/default_propagation.jpg" title="react-native-inkwell">
</div>

Fortunately, this case study is easily handled.
First, a Ref must be created and assigned to the InkWell that is being nested. Once this is done, the Ref must be added to the childrenRefs property of the InkWell.
That's it.

```jsx
const NestedInkWellUseCase = () => {
  const onTapParent = React.useCallback(() => {
    console.log('Parent');
  }, []);

  const onTapChild = React.useCallback(() => {
    console.log('Child');
  }, []);

  // 1. create the childRef
  const childRef = React.useRef<InkWellRefType>(null);

  return (
    <View style={styles.buttonContainer}>
      {/* Parent */}
      <InkWell
        style={styles.button}
        contentContainerStyle={styles.contentButton}
        onTap={onTapParent}
        childrenRefs={childRef} // <-- 3. add the childRef to the childrenRefs
      >
        {/* Nested InkWell */}
        <InkWell
          ref={childRef} // <--  2. assign the childRef
          style={[styles.button, styles.innerButton]}
          contentContainerStyle={styles.contentButton}
          onTap={onTapChild}
        >
          <Text>Child</Text>
        </InkWell>
      </InkWell>
    </View>
  );
};
```

Here's the result:

<div align="center">
    <img src="https://github.com/enzomanuelmangano/react-native-inkwell/blob/main/.assets/without_propagation.jpg" title="react-native-inkwell">
</div>

**Note**: This example considered a single nested child. Using the InkWell, you can easily manage multiple nested InkWells by passing an array of references to the childrenRefs property.

---

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
