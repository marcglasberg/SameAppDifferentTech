Feature: Persistor  

  Scenario: When the state changes, it is persisted.
    Given An action that changes the state.
    When The action is dispatched.
    Then The new state is persisted.
