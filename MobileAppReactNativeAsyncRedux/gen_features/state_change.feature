Feature: State change

  Scenario: Change state by dispatching a SYNC action.
    Given State has user name Mary and age 30.
    When A sync action is dispatched to change the name to Lisa.
    Then The name changes and the age stays the same.

  Scenario: Change state by dispatching an ASYNC action.
    Given State has user name Mary and age 30.
    When An async action is dispatched to change the name to Lisa.
    Then The name changes and the age stays the same.
