# From article : Pragmatic Asset Allocation Model for Semi-Active Investors
# Radovan Vojtko, Juliána Javorská

from AlgorithmImports import *

class MacroOptimizedAssetAllocation(QCAlgorithm):
    def Initialize(self):
        self.SetStartDate(2023, 1, 1)
        self.SetCash(10000)
        
        # Equity ETFs: broad US, developed ex-US, and emerging markets
        self.equity_assets = {
            "SPY": self.AddEquity("SPY", Resolution.Daily).Symbol,  # Broad US market
            "IEFA": self.AddEquity("IEFA", Resolution.Daily).Symbol,  # Developed markets ex-US
            "VWO": self.AddEquity("VWO", Resolution.Daily).Symbol,  # Emerging markets
        }
        
        # Safe assets: inflation protection and intermediate bonds
        self.safe_assets = {
            "TIP": self.AddEquity("TIP", Resolution.Daily).Symbol,  # Inflation-protected bonds
            "IEF": self.AddEquity("IEF", Resolution.Daily).Symbol,  # Intermediate-term Treasuries
            "GLD": self.AddEquity("GLD", Resolution.Daily).Symbol,  # Gold ETF
        }
        
        self.momentum_window = 12  # 12-month momentum
        self.momentum_scores = {}
        
        # Yield curve data remains for macro risk-off decisions
        self.yield_curve = self.AddData(Fred, "T10Y3M", Resolution.Daily).Symbol
        
        # Rebalance quarterly
        self.Schedule.On(
            self.DateRules.MonthEnd(self.equity_assets["SPY"]),
            self.TimeRules.At(15, 45),
            self.Rebalance
        )
    
    def Rebalance(self):
        if not self.DataReady():
            self.Debug("Data not ready for rebalancing.")
            return
        
        momentum_results = {}
        for symbol in self.equity_assets.values():
            history = self.History(symbol, self.momentum_window * 22, Resolution.Daily)
            if history.empty or len(history) < self.momentum_window * 22:
                self.Debug(f"Insufficient history for {symbol}")
                continue

            start_price = history["close"].iloc[0]
            end_price = history["close"].iloc[-1]
            momentum = end_price / start_price - 1
            sma_12m = history["close"].mean()
            current_price = self.Securities[symbol].Price

            self.Debug(f"{symbol}: Momentum={momentum:.2%}, SMA={sma_12m:.2f}, CurrentPrice={current_price:.2f}")
            if current_price > sma_12m:
                momentum_results[symbol] = momentum

        # Check yield curve inversion: risk-off mode
        if self.YieldCurveInverted():
            self.AllocateToHedgingPortfolio()
            return

        # Rank assets by momentum
        sorted_assets = sorted(momentum_results, key=momentum_results.get, reverse=True)
        
        # Liquidate positions not in the new allocation
        for symbol in self.Portfolio.Keys:
            if symbol not in sorted_assets[:2]:
                self.Liquidate(symbol)
        
        # Allocate to top momentum assets with full allocation (adjust weights as needed)
        if len(sorted_assets) > 0:
            self.SetHoldings(sorted_assets[0], 0.5)
        if len(sorted_assets) > 1:
            self.SetHoldings(sorted_assets[1], 0.5)
        
        self.Debug(f"Rebalanced to: {[str(sym) for sym in sorted_assets[:2]]}")
    
    def YieldCurveInverted(self):
        if self.yield_curve in self.CurrentSlice and self.CurrentSlice[self.yield_curve]:
            inversion = self.CurrentSlice[self.yield_curve].Value < 0
            self.Debug(f"Yield curve inversion: {inversion}")
            return inversion
        self.Debug("Yield curve data not available.")
        return False

    def AllocateToHedgingPortfolio(self):
        # Liquidate all equity positions
        for symbol in self.equity_assets.values():
            self.Liquidate(symbol)
        
        # Allocate to safe assets – weights are adjustable based on risk preference
        self.SetHoldings(self.safe_assets["TIP"], 0.33)
        self.SetHoldings(self.safe_assets["IEF"], 0.33)
        self.SetHoldings(self.safe_assets["GLD"], 0.34)
        self.Debug("Allocated to hedging portfolio")
    
    def DataReady(self):
        return all([self.Securities[s].HasData for s in self.equity_assets.values()])
