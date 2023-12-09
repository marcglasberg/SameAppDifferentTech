Feature: Average Price

  Scenario Outline: Buying and Selling stocks changes the average price.
    Given IBM is an available stock.
    And The user has [Quantity] shares of IBM at [At] dollars each.
    When The user [BuyOrSell] [How many] of these stocks at [Price] for each share.
    Then The number of shares becomes [Quantity] plus/minus [How many].
    And The average price for the stock becomes [Average Price].
    Examples: 
      | Quantity | At  | BuyOrSell | How many | Price | Average Price |
      | 10       | 100 | BUY       | 2        | 50    | 91.67         |
      | 8        | 200 | SELL      | 3        | 30    | 302           |
