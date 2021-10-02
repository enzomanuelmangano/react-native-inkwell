import * as React from 'react';
import { StyleSheet, SafeAreaView, FlatList } from 'react-native';
import RippleButton from './components/RippleButton';

const App = () => {
  const renderItem = React.useCallback(() => {
    return <RippleButton />;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={new Array(5).fill(0)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
});

export default App;
