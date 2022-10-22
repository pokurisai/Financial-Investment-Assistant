import React, { useState, useEffect } from 'react';
import TradeChart from '../Chart/tradeChart';
import BuyModel from '../Models/BuyModel';
import SellModel from '../Models/SellModel';
import './stock.css';

const SelectedHoldings = ({
  selectedHolding,
  buyShares,
  sellShares,
  updateShares,
  userTotalHolding
}) => {
  const [shares, setShares] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [holdingStyleColor, setHoldingStyleColor] = useState('');
  const [positiveSign, setPositiveSign] = useState(false);

  useEffect(() => {
    isHoldingNegativeOrPositive();
  }, []);

  useEffect(() => {
    compareSelectedHoldingToExisting();
  }, [holdings]);

  const isHoldingNegativeOrPositive = () => {
    if (String(changePercent).charAt(0) === '-') {
      setHoldingStyleColor('red');
      setPositiveSign(false);
    } else {
      setHoldingStyleColor('green');
      setPositiveSign('+');
    }
  };

  useEffect(() => {
    isHoldingNegativeOrPositive();
  }, [selectedHolding]);

  const handleBuyShares = shares => {
    console.log(shares);
    updateShares(shares);
    buyShares(selectedHolding, shares);
    setShares(prevState => prevState + parseInt(shares));
  };

  const handleSellShares = shares => {
    sellShares(selectedHolding, shares);
    updateShares(shares);
    setShares(prevState => prevState - parseInt(shares));
  };

  const compareSelectedHoldingToExisting = () => {
    if (selectedHolding) {
      const holdingExist = holdings.find(
        holding => holding.symbol == selectedHolding.symbol
      );
      if (holdingExist) {
        setShares(holdingExist.shares);
      }
    }
  };
  const {
    companyName,
    symbol,
    latestPrice,
    previousClose,
    changePercent,
    change,
    userTotalHoldings
  } = selectedHolding;

  return (
    <>
    <div className="container stock">
      <div className="selected-holding card mt-4">
        <div className="card-head">
          <h2>
            {' '}
            {companyName}: {symbol}
          </h2>
          <div className="card-buttons">
            <BuyModel
              handleBuyShares={handleBuyShares}
              selectedHolding={selectedHolding}
              shares={shares}
              userTotalHolding={userTotalHolding}
            />
            <SellModel
              handleSellShares={handleSellShares}
              selectedHolding={selectedHolding}
              shares={shares}
              userTotalHolding={userTotalHolding}
            />
          </div>
        </div>
        <hr />
        <div className="card-body">
          <div className="price">
            <strong>Current Price</strong>
            {latestPrice && 
            <p className={`mb-0 ${holdingStyleColor}`}>
              ${latestPrice.toFixed(2)}
            </p>
            }
            {previousClose && 
            <small className={holdingStyleColor}>
              Previous Closed: ${previousClose.toFixed(2)}{' '}
            </small>
            }
          </div>
          <div className="percent">
            <strong>Percent Change</strong>
            {changePercent && 
            <p className={holdingStyleColor}>
              {positiveSign}
              {changePercent.toFixed(3)}%
            </p>
            }
          </div>
          <div className="change remove-border">
            <strong>Daily Gain/Loss</strong>
            <p className={holdingStyleColor}>
              {positiveSign}${change}
            </p>
          </div>
        </div>
      </div>
      </div>
      <TradeChart symbol={symbol} />
    </>
  );
};

export default SelectedHoldings;
