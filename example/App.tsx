import * as React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, Text } from 'react-native';
import InkWell, { InkWellRefType } from 'react-native-inkwell';

const App = () => {
  const onTapParent = React.useCallback(() => {
    console.log('Parent');
  }, []);

  const onTapChild = React.useCallback(() => {
    console.log('Child');
  }, []);

  const childRef = React.useRef<InkWellRefType>(null);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={new Array(50).fill(0)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ index }) => {
          return (
            <View style={styles.buttonContainer}>
              <InkWell
                style={styles.button}
                contentContainerStyle={styles.contentButton}
                onTap={onTapParent}
                childRef={childRef}
              >
                <InkWell
                  style={[styles.button, { height: '30%' }]}
                  contentContainerStyle={styles.contentButton}
                  onTap={onTapChild}
                  ref={childRef}
                >
                  <Text>Child {index}</Text>
                </InkWell>
              </InkWell>
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
    height: 150,
    backgroundColor: 'white',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 10,
    borderRadius: 20,
    elevation: 5,
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

export default App;
