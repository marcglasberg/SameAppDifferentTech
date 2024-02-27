Feature: UserException

  Scenario: Showing a dialog (or other UI) when an action throws a UserException.
    Given A SYNC or ASYNC action.
    When The `before` or `reduce` methods throw a UserException.
    Then Function `showUserException` is called.

  Scenario: When more than one UserException is thrown.
    Given SYNC or ASYNC actions that throw errors.
    When Multiple UserExceptions are thrown.
    Then Function `showUserException` is initially called only once.
    And When `next` is called and there are more errors, then it calls `showUserException` again.
