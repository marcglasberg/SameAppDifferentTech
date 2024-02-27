Feature: ActionObserver

  Scenario: ActionObserver is called when actions are dispatched.
    Given SYNC and ASYNC actions.
    When The the actions are dispatched.
    Then The SYNC action starts and finishes at once.
    And The ASYNC action first starts, and then finishes after the async gap.
