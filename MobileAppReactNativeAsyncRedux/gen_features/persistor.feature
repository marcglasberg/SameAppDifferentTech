Feature: Persistor  

  Scenario: There is no persisted state. State changes are persisted by a SYNC persistor.
    Given There is no persisted state when the store is created.
    And The persistor works SYNC when called (like localStorage).
    And An action that changes the state.
    When The store is created.
    And The action is dispatched.
    Then The initial-state is initially in the store.
    And The initial-state in the store is persisted.
    And The new state created by the dispatched action is persisted.

  Scenario: The persisted state is read when the Store is created. State changes are persisted by a SYNC persistor.
    Given There is some state already persisted when the store is created.
    And The persistor works SYNC when called (like localStorage).
    And An action that changes the state.
    When The store is created.
    And The action is dispatched.
    Then The initial-state is initially in the store.
    And The persisted state is read into the store.
    And The new state created by the dispatched action is persisted.

  Scenario: There is no persisted state. State changes are persisted by an ASYNC persistor.
    Given There is no persisted state when the store is created.
    And The persistor works SYNC when called (like localStorage).
    And An action that changes the state.
    When The store is created.
    And The action is dispatched.
    Then The initial-state is initially in the store.
    And The initial-state in the store is persisted.
    And The new state created by the dispatched action is persisted.

  Scenario: The persisted state is read when the Store is created. State changes are persisted by an ASYNC persistor.
    Given There is some state already persisted when the store is created.
    And The persistor works SYNC when called (like localStorage).
    And An action that changes the state.
    When The store is created.
    And The action is dispatched.
    Then The initial-state is initially in the store.
    And The persisted state is read into the store.
    And The new state created by the dispatched action is persisted.

  Scenario: State changes are only persisted when the previous state finished persisting.
    Given The persistor is async and slow, taking 150 millis to read/write/delete the state.
    And An action that changes the state.
    When The action is dispatched twice.
    Then The second state is only persisted when the first one finishes.
