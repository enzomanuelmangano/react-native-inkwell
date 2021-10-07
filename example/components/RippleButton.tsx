import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import InkWell, { useInkWellRef } from 'react-native-inkwell';

export default function RippleButton() {
  const onTapParent = React.useCallback(() => {
    console.log('Parent');
  }, []);

  const onTapChild = React.useCallback(() => {
    console.log('Child');
  }, []);

  const firstChildRef = useInkWellRef();
  const secondChildRef = useInkWellRef();

  return (
    <View style={styles.buttonContainer}>
      <InkWell
        style={styles.button}
        contentContainerStyle={styles.contentButton}
        onTap={onTapParent}
        childrenRefs={[firstChildRef, secondChildRef]}
      >
        <InkWell
          style={[styles.button, styles.innerButton]}
          contentContainerStyle={styles.contentButton}
          onTap={onTapChild}
          ref={firstChildRef}
        >
          <Text>Child</Text>
        </InkWell>
        <InkWell
          style={[styles.button, styles.innerButton]}
          contentContainerStyle={styles.contentButton}
          onTap={onTapChild}
          ref={secondChildRef}
        >
          <Text>Child</Text>
        </InkWell>
      </InkWell>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '90%',
    height: 300,
    backgroundColor: 'white',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 10,
    borderRadius: 20,
    elevation: 5,
  },
  innerButton: {
    height: '30%',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    borderRadius: 20,
    elevation: 10,
    margin: 10,
  },
  contentButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
});
