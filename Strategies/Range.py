#AI generated code extracted from Sapate, Uttam B, Trading Range Breakout Test on Daily Stocks of Indian Markets (November 10, 2017). 
#Available at SSRN: https://ssrn.com/abstract=3068852 or http://dx.doi.org/10.2139/ssrn.3068852 

from AlgorithmImports import *

class MyTradingAlgorithm(QCAlgorithm):
    def Initialize(self):
        # Set the start and end date for backtesting
        self.SetStartDate(2024, 1, 1)
        self.SetEndDate(2024, 12, 1)
        
        # Set the initial cash balance
        self.SetCash(100000)
        
        # Add the assets to trade
        self.symbols = [self.AddEquity("SPY", Resolution.Daily).Symbol,
                        self.AddEquity("AAPL", Resolution.Daily).Symbol]
        
        # Set the benchmark
        self.SetBenchmark("SPY")
        
        # Initialize indicators
        self.sma_short = {symbol: self.SMA(symbol, 50, Resolution.Daily) for symbol in self.symbols}
        self.sma_long = {symbol: self.SMA(symbol, 200, Resolution.Daily) for symbol in self.symbols}
        
        # Initialize risk management parameters
        self.stop_loss_pct = 0.05
        self.trailing_stop_pct = 0.02
        
        # Initialize portfolio construction parameters
        self.max_position_size = 0.5  # Max 50% of portfolio in one position
        
        # Schedule the rebalancing function
        self.Schedule.On(self.DateRules.MonthStart(), self.TimeRules.AfterMarketOpen("SPY", 30), self.Rebalance)
        
    def OnData(self, data):
        for symbol in self.symbols:
            if not data.ContainsKey(symbol):
                continue
            
            # Check if indicators are ready
            if not self.sma_short[symbol].IsReady or not self.sma_long[symbol].IsReady:
                continue
            
            # Strategy logic: Golden Cross
            if self.sma_short[symbol].Current.Value > self.sma_long[symbol].Current.Value:
                self.SetHoldings(symbol, self.max_position_size)
            else:
                self.Liquidate(symbol)
            
            # Risk management: Trailing stop loss
            if self.Portfolio[symbol].Invested:
                self.SetTrailingStopLoss(symbol, self.trailing_stop_pct)
    
    def Rebalance(self):
        # Rebalance the portfolio
        for symbol in self.symbols:
            self.SetHoldings(symbol, self.max_position_size)
    
    def SetTrailingStopLoss(self, symbol, trailing_stop_pct):
        # Set a trailing stop loss for the given symbol
        if self.Portfolio[symbol].Invested:
            stop_price = self.Portfolio[symbol].Price * (1 - trailing_stop_pct)
            self.StopMarketOrder(symbol, -self.Portfolio[symbol].Quantity, stop_price)
    
    def OnOrderEvent(self, orderEvent):
        # Log order events for debugging
        self.Debug(f"Order event: {orderEvent}")
    
    def OnEndOfAlgorithm(self):
        # Log final portfolio value
        self.Debug(f"Final Portfolio Value: {self.Portfolio.TotalPortfolioValue}")

# Helper functions can be added here if needed
