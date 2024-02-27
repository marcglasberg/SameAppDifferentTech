Feature: Testing features

  Scenario: We can test the result of an action, by waiting until it finishes.
    Given A SYNC or ASYNC action.
    When We dispatch and action and wait for it.
    Then We can expect the correct state change.

  Scenario: We can test the result of multiple actions and async processes, by waiting until the state meets some condition.
    Given State starts equal to 1.
    And An action dispatches async processes that last after that action finishes.
    And At some point after the action finishes the state will be 42.
    When We dispatch this action.
    Then We can wait for state to become 42.
    And We can expect the correct state change.

  Scenario: Test dispatching an action as soon as the state meets certain condition.
    Given State starts equal to 1.
    And An action dispatches async processes that last after that action finishes.
    And At some point after the action finishes the state will be 42.
    And But we set up an action that reset the state to zero to dispatch as soon as the state is 42.
    When We dispatch this action.
    Then When the state becomes 42, the reset action is dispatched.
    And The state becomes zero.

  Scenario: It is possible to record all state changes, dispatched actions and errors thrown by actions.
    Given State starts equal to 1.
    And We asked the store to start recording.
    And An action dispatches async processes that last after that action finishes.
    And At some point after the action finishes the state will be 42.
    And But we asked the store to start recording.
    When We dispatch this action.
    Then When the state becomes 42.
    And We have the record of everything that happened up until this point.
