import * as React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList } from 'react-native';
import InkWell from 'react-native-inkwell';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={new Array(50).fill(0)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => {
          return (
            <View style={styles.buttonContainer}>
              <InkWell
                style={styles.button}
                onTap={() => {
                  console.log('tapped');
                }}
              />
            </View>
          );
        }}
      />
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
    height: 100,
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

export default App;
