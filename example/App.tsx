import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { InkWell } from 'react-native-inkwell';

export default function App() {
  return (
    <View style={styles.container}>
      <InkWell
        onTap={() => {
          console.log('Tapped');
        }}
        style={styles.button}
      >
        <Text>Result</Text>
      </InkWell>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '50%',
    aspectRatio: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 50,
    borderRadius: 20,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
