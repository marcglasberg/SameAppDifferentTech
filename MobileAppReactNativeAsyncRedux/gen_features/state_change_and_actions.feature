Feature: State change and actions

  Scenario Outline: Action status when dispatching a SYNC action.
    Given A newly created action to change the state to [new state].
    When The action is dispatched.
    And The [before method throws error] or not
    And The [reduce method throws error] or not
    Then The action [runs methods].
    And The state is [result state].
    And The action status indicates if errors where throw or not.
    And The action status indicates the action has finished or not.
    Examples: 
      | new state | result state | before method throws error | reduce method throws error | runs methods        |
      | NULL      | 123          | false                      | false                      | before,reduce,after |
      | 123       | 123          | false                      | false                      | before,reduce,after |
      | 456       | 456          | false                      | false                      | before,reduce,after |
      | NULL      | 123          | true                       | false                      | after               |
      | 123       | 123          | true                       | false                      | after               |
      | 456       | 123          | true                       | false                      | after               |
      | NULL      | 123          | false                      | true                       | before,after        |
      | 123       | 123          | false                      | true                       | before,after        |
      | 456       | 123          | false                      | true                       | before,after        |
