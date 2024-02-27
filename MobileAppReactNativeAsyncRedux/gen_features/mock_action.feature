Feature: Mock action

  Scenario: Mocking action.
    Given An original action.
    And The action is mocked with a mock-action.
    When The action is dispatched.
    Then The mock-action is dispatched instead.

  Scenario: Mock action may use the original action.
    Given An original action.
    And The action is mocked by an action that user the original action.
    When The action is dispatched.
    Then The mock-action has access to the original action, to access its fields.
