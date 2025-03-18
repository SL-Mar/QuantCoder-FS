### AI generated from  Faber, Meb, Relative Strength Strategies for Investing (April 1, 2010). 
### Available at SSRN: https://ssrn.com/abstract=1585517 or http://dx.doi.org/10.2139/ssrn.1585517 

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
                        self.AddEquity("SLV", Resolution.Daily).Symbol,
                        self.AddEquity("GLD", Resolution.Daily).Symbol]
        
        # Set the benchmark
        self.SetBenchmark(self.symbols[0])
        
        # Initialize risk management parameters
        self.stopLossPercent = 0.05
        self.trailingStopPercent = 0.02
        
        # Initialize portfolio construction parameters
        self.rebalancePeriod = timedelta(30)
        self.nextRebalanceTime = self.Time + self.rebalancePeriod
        
        # Initialize alpha model parameters
        self.momentumPeriod = 20
        self.momentumThreshold = 0.01
        
        # Schedule the rebalance function
        self.Schedule.On(self.DateRules.EveryDay(), self.TimeRules.AfterMarketOpen("SPY", 30), self.Rebalance)
        
        # Initialize a dictionary to store stop prices
        self.stopPrices = {}
        
    def OnData(self, data):
        # Check if it's time to rebalance the portfolio
        if self.Time >= self.nextRebalanceTime:
            self.Rebalance()
            self.nextRebalanceTime = self.Time + self.rebalancePeriod
        
        # Implement trailing stop loss
        for symbol in self.Portfolio.Keys:
            if symbol in self.stopPrices and symbol in data and data[symbol]:
                if data[symbol].Close < self.stopPrices[symbol]:
                    self.Liquidate(symbol)
                else:
                    self.stopPrices[symbol] = max(self.stopPrices[symbol], data[symbol].Close * (1 - self.trailingStopPercent))
    
    def Rebalance(self):
        # Calculate momentum for each symbol
        momentumScores = {}
        for symbol in self.symbols:
            history = self.History(symbol, self.momentumPeriod, Resolution.Daily)
            if not history.empty:
                momentum = (history['close'][-1] - history['close'][0]) / history['close'][0]
                momentumScores[symbol] = momentum
        
        # Rank symbols by momentum
        rankedSymbols = sorted(momentumScores, key=momentumScores.get, reverse=True)
        
        # Determine the number of positions to hold
        numPositions = min(3, len(rankedSymbols))
        
        # Calculate the target weight for each position
        targetWeight = 1.0 / numPositions if numPositions > 0 else 0
        
        # Liquidate positions not in the top ranked symbols
        for symbol in self.Portfolio.Keys:
            if symbol not in rankedSymbols[:numPositions]:
                self.Liquidate(symbol)
        
        # Set target weights for the top ranked symbols
        for symbol in rankedSymbols[:numPositions]:
            self.SetHoldings(symbol, targetWeight)
            self.stopPrices[symbol] = self.Securities[symbol].Price * (1 - self.stopLossPercent)
    
    def OnOrderEvent(self, orderEvent):
        # Log order events for debugging
        self.Debug(f"Order event: {orderEvent}")
        
    def OnEndOfAlgorithm(self):
        # Log final portfolio value
        self.Debug(f"Final Portfolio Value: {self.Portfolio.TotalPortfolioValue}")

# Helper functions can be added here if needed
