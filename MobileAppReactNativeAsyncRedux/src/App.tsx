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
import { ShowUserException, Store, StoreProvider, useStore } from './AsyncRedux/Store.tsx';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { AddTodoAction } from './AddTodoAction.ts';
import { ToggleTodoAction } from './ToggleTodoAction.ts';
import { RemoveCompletedTodosAction } from './RemoveCompletedTodosAction.ts';
import { ClassPersistor } from './AsyncRedux/ClassPersistor.tsx';
import { TodoItem, Todos } from './Todos.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NextFilterAction } from './NextFilterAction.ts';
import { Filter } from './Filter.ts';
import { AddRandomTodoAction } from './AddRandomTodoAction.ts';

export function App() {

  const store = new Store<State>({
    initialState: State.initialState,
    showUserException: userExceptionDialog,
    persistor: getPersistor()
  });

  return (
    <StoreProvider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </StoreProvider>
  );

  // Uses AsyncStorage, since this is a React Native app. If it was a React web app,
  // we would use localStorage or IndexedDB.
  function getPersistor() {
    return new ClassPersistor<State>(
      async () => {
        return await AsyncStorage.getItem('state');
      },
      async (serialized) => {
        await AsyncStorage.setItem('state', serialized);
      },
      async () => {
        await AsyncStorage.clear();
      },
      // All custom classes that are part of the state (except native JavaScript classes).
      [State, Todos, TodoItem, FilterButton]
    );
  }
}

const userExceptionDialog: ShowUserException =
  (exception, count, next) => {
    Alert.alert(
      exception.title || exception.message,
      exception.title ? exception.message : '',
      [{ text: 'OK', onPress: (value?: string) => next }]
    );
  };

const AppContent: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: 'center', padding: 16, fontSize: 35, color: '#A44' }}>Todos</Text>
      <TodoInput />
      <TodoList />
      <FilterButton />
      <AddRandomTodoButton />
      <RemoveAllButton />
    </View>
  );
};

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
        onSubmitEditing={() => {
          store.dispatch(new AddTodoAction(inputText));
          setInputText(''); // Clear the input after adding the todo
        }}
      />

      <TouchableOpacity onPress={() => {
        store.dispatch(new AddTodoAction(inputText));
        setInputText('');
      }} style={styles.button}>
        <Text style={styles.footerButtonText}>Add</Text>
      </TouchableOpacity>

    </View>
  );
};

const NoTodosWarning: React.FC = () => {

  const store = useStore<State>();
  let filter = store.state.filter;
  let count = store.state.todos.count(filter);
  let countCompleted = store.state.todos.count(Filter.showCompleted);
  let countActive = store.state.todos.count(Filter.showActive);

  if (count == 0) {
    if (filter == Filter.showAll)
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.dimmedText}>No todos</Text>
        </View>
      );
    else if (filter == Filter.showActive) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {countCompleted !== 0 ? (
            <>
              <Text style={styles.dimmedText}>No active todos</Text>
              <Text style={styles.dimmedText}>(change filter to
                see {countCompleted} completed)</Text>
            </>
          ) : (
            <Text style={styles.dimmedText}>No active todos</Text>
          )}
        </View>
      );
    } else if (filter == Filter.showCompleted) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {countActive !== 0 ? (
            <>
              <Text style={styles.dimmedText}>No completed todos</Text>
              <Text style={styles.dimmedText}>(change filter to see {countActive} active)</Text>
            </>
          ) : (
            <Text style={styles.dimmedText}>No active todos</Text>
          )}
        </View>
      );
    } else throw new Error('Invalid filter: ' + filter);
  }
  //
  else return <View></View>;
};

const TodoList: React.FC = () => {

  const store = useStore<State>();
  let filter = store.state.filter;
  let count = store.state.todos.count(filter);

  // No todos to show with the current filter.
  if (count == 0) return <NoTodosWarning />;
    //
  // Show the list of todoItems.
  else {
    const filterTodos = (item: TodoItem) => {
      switch (store.state.filter) {
        case Filter.showCompleted:
          return item.completed;
        case Filter.showActive:
          return !item.completed;
        case Filter.showAll:
        default:
          return true;
      }
    };

    return (
      <View style={{ flex: 1 }}>

        <ScrollView>
          {store.state.todos.items.filter(filterTodos).map((item, index) => (
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
  }
};

const FilterButton: React.FC = () => {

  const store = useStore<State>();

  // <View style={{ paddingVertical: 20 }}>
  return (

    <TouchableOpacity
      onPress={() => {
        store.dispatch(new NextFilterAction());
      }}
      style={styles.filterButton}
    >
      <Text style={styles.filterButtonText}>{store.state.filter}</Text>
    </TouchableOpacity>
  );
};

const RemoveAllButton: React.FC = () => {

  const store = useStore<State>();
  let disabled = store.isDispatching(RemoveCompletedTodosAction);

  return (
    <TouchableOpacity
      onPress={() => {
        store.dispatch(new RemoveCompletedTodosAction());
      }}
      style={styles.footerButton}
      disabled={disabled}
    >

      {disabled ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text style={styles.footerButtonText}>Remove Completed Todos</Text>
      )}

    </TouchableOpacity>
  );
};

const AddRandomTodoButton: React.FC = () => {

  const store = useStore<State>();
  let loading = store.isDispatching(AddRandomTodoAction);

  return (
    <TouchableOpacity
      onPress={() => {
        store.dispatch(new AddRandomTodoAction());
      }}
      style={styles.footerButton}
    >

      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text style={styles.footerButtonText}>Add Random Todo</Text>
      )}

    </TouchableOpacity>
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
  footerButtonText: {
    color: '#fff'
  },
  filterButtonText: {
    color: '#000'
  },
  dimmedText: {
    fontSize: 20,
    color: '#BBB'
  },
  footerButton: {
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 15,
    paddingHorizontal: 25,
    marginBottom: 10,
    marginHorizontal: 10
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#222',
    padding: 15,
    paddingHorizontal: 25,
    marginBottom: 10,
    marginHorizontal: 10
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
    marginRight: 30,
    paddingVertical: 6
  }
});
