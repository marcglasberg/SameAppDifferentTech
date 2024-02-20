import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { State } from './state.ts';
import { Store, StoreProvider, useStore } from './AsyncRedux/store.tsx';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AddTodoAction, ToggleTodoAction } from './actions.ts';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

function App() {

  const store = new Store<State>({
    initialState: State.initialState
  });

  return (
    <StoreProvider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </StoreProvider>
  );
}

const AppContent: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: 'center', padding: 16, fontSize: 35, color: '#A44' }}>Todos</Text>
      <TodoInput />
      <TodoList />
      <Filter />
    </View>
  );
};

export default App;


const TodoInput: React.FC = () => {

  const store = useStore<State>();
  const [inputText, setInputText] = useState<string>('');

  return (
    <View style={styles.inputRow}>

      <TextInput
        placeholder="Type here..."
        value={inputText}
        style={styles.input}
        onChangeText={(text) => {
          const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
          setInputText(capitalizedText);
        }}
      />

      <TouchableOpacity onPress={() => {
        store.dispatch(new AddTodoAction(inputText));
        setInputText('');
      }} style={styles.button}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingRight: 10
  },
  label: {
    marginBottom: 8 // Add some space between the label and the input field
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    paddingHorizontal: 25
  },
  buttonText: {
    color: '#ffffff'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    margin: 10
  },
  checkbox: {
    paddingHorizontal: 10,
    paddingVertical: 6
  }
});


const TodoList: React.FC = () => {

  const store = useStore<State>();

  return (
    <View>
      {store.state.todos.items.map(
        (item, index) => (
          <>
            <BouncyCheckbox
              size={30}
              style={styles.checkbox}
              key={index + item.text}
              isChecked={item.completed}
              disableBuiltInState={true}
              fillColor="#555"
              unfillColor="#FFE"
              text={item.text}
              iconStyle={{ borderColor: 'red' }}
              innerIconStyle={{ borderWidth: 2 }}
              onPress={(_) => {
                store.dispatch(new ToggleTodoAction(item));
              }}
            />
          </>
        ))}
    </View>
  );
};

const Filter: React.FC = () => {

  const store = useStore<State>();

  return (
    <View style={{ flex: 1, paddingVertical: 20 }}>
      <Text style={{ textAlign: 'center' }}>Filter: {store.state.filter}</Text>
    </View>
  );
};
