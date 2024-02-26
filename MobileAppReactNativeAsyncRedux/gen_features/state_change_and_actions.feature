Feature: State change and actions

  Scenario: Action status when dispatching a SYNC action that doesnt change the state.
    Given A newly created action.
    When The action is dispatched.
    And Its reducer returns null.
    And Finishes without errors.
    Then The action status evolves to record methods before, reduce, after.
    And If errors where throw.
    And If the action has finished or not, with errors or not.

  Scenario: Action status when dispatching a SYNC action that changes the state.
    Given A newly created action.
    When The action is dispatched.
    And Its reducer returns null.
    And Finishes without errors.
    Then The action status evolves to record methods before, reduce, after.
    And If errors where throw.
    And If the action has finished or not, with errors or not.
