import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { State } from './State.ts';
import { Store, StoreProvider, UserExceptionDialog, useStore } from './AsyncRedux/Store.tsx';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { AddTodoAction } from './AddTodoAction.ts';
import { ToggleTodoAction } from './ToggleTodoAction.ts';
import { RemoveAllTodosAction } from './RemoveAllTodosAction.ts';
import { ClassPersistor } from './AsyncRedux/ClassPersistor.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {

  const store = new Store<State>({
    initialState: State.initialState,
    userExceptionDialog: userExceptionDialog,
    persistor: new ClassPersistor(
      async () => {
        console.log('----------- LOADED -----------');
        return await AsyncStorage.getItem('database');
      },
      async (json) => {
        console.log('----------- SAVED -----------');
        console.log(json);
        await AsyncStorage.setItem('database', json);
      },
      async () => {
        console.log('----------- DELETED -----------');
        await AsyncStorage.clear();
      }
    )
  });

  return (
    <StoreProvider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </StoreProvider>
  );
}

const userExceptionDialog: UserExceptionDialog =
  (error, next) => {
    Alert.alert(
      error.title || error.message,
      error.title ? error.message : '',
      [{ text: 'OK', onPress: (value?: string) => next }]
    );
  };

const AppContent: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: 'center', padding: 16, fontSize: 35, color: '#A44' }}>Todos</Text>
      <TodoInput />
      <TodoList />
      <Filter />
      <RemoveAllButton />
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
    marginBottom: 8
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    paddingHorizontal: 25
  },
  buttonText: {
    color: '#ffffff'
  },
  footerButton: {
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 15,
    paddingHorizontal: 25,
    margin: 10
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
    <View style={{ flex: 1 }}>

      <ScrollView>
        {store.state.todos.items.map(
          (item, index) => (
            <BouncyCheckbox
              size={30}
              style={styles.checkbox}
              key={index + item.text}
              isChecked={item.completed}
              disableBuiltInState={true}
              fillColor="#555"
              unfillColor="#FFE"
              text={item.text}
              innerIconStyle={{ borderWidth: 2 }}
              onPress={(_) => {
                store.dispatch(new ToggleTodoAction(item));
              }}
            />
          ))}
      </ScrollView>
      <View
        style={{ backgroundColor: '#CCC', height: 0.75, marginTop: 10, marginHorizontal: 15 }
        }
      />
    </View>
  );
};

const Filter: React.FC = () => {

  const store = useStore<State>();

  return (
    <View style={{ paddingVertical: 20 }}>
      <Text style={{ textAlign: 'center' }}>Filter: {store.state.filter}</Text>
    </View>
  );
};

const RemoveAllButton: React.FC = () => {

  const store = useStore<State>();
  let disabled = store.isInProgress(RemoveAllTodosAction);

  return (
    <TouchableOpacity
      onPress={() => {
        store.dispatch(new RemoveAllTodosAction());
      }}
      style={styles.footerButton}
      disabled={disabled}
    >

      {disabled ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text style={styles.buttonText}>Remove All Todos</Text>
      )}

    </TouchableOpacity>
  );
};


