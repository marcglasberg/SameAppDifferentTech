Feature: StateObserver

  Scenario: StateObserver is called when the state changes.
    Given SYNC and ASYNC actions.
    When The the actions are dispatched.
    Then The SYNC action starts and finishes at once.
    And The ASYNC action first starts, and then finishes after the async gap.

  Scenario: StateObserver when actions throw errors.
    Given SYNC and ASYNC actions that throw errors.
    When The the actions are dispatched.
    Then The SYNC action starts and finishes at once.
    And The ASYNC action first starts, and then finishes after the async gap.
