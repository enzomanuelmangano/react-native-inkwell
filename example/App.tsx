import * as React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { InkWell } from 'react-native-inkwell';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.list}>
        {new Array(10).fill(0).map((_, index) => (
          <View key={index.toString()} style={styles.buttonContainer}>
            <InkWell style={styles.button} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  button: {
    width: '90%',
    height: 70,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 10,
    borderRadius: 20,
    elevation: 5,
  },
  buttonContainer: { width: '100%', alignItems: 'center', marginVertical: 10 },
});

export { App };
