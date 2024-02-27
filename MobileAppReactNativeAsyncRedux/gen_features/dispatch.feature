Feature: Dispatch

  Scenario: Waiting for a dispatch to end.
    Given A SYNC or ASYNC action.
    When The action is dispatched with `dispatchAndWait(action)`.
    Then It returns a `Promise` that resolves when the action finishes.

  Scenario: Knowing when some dispatched action is being processed.
    Given A SYNC or ASYNC action.
    When The action is dispatched.
    Then We can check if the action is processing with `Store.isDispatching(action)`.
