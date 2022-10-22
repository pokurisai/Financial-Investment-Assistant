import React, { useState, useEffect } from 'react';
import './stock.css';

const CurrentHoldings = ({ holding }) => {
  console.log(holding);
  const [holdingStyleColor, setHoldingStyleColor] = useState('');
  const [positiveSign, setPositiveSign] = useState(false);

  useEffect(() => {
    const isHoldingNegativeOrPositive = () => {
      if (String(latestPrice).charAt(0) === '-') {
        setHoldingStyleColor('red');
        setPositiveSign(false);
      } else {
        setHoldingStyleColor('green');
        setPositiveSign('+');
      }
    };
    isHoldingNegativeOrPositive();
  }, []);

  const { companyName, symbol, latestPrice, updatedAt, changePercent } = holding.stocks;
  const { shares , transactionType} = holding;


  return (
    <div className="recommended-holding stock">
    <div className="selected-holding card mt-4">
      <div className="card-head">
        <h3>
          {companyName}: {symbol}
        </h3>
      </div>
      <h6 className="ml-2">Date {transactionType === 'sell'? 'Sold':transactionType === 'buy'?'Purchased':''}: {updatedAt}</h6>
      <hr />
      <div className="card-body">
        <div className="Holding Value:">
          <strong>Shares Total Value:</strong>
          <p className={holdingStyleColor}>
            ${Number(latestPrice * shares).toFixed(2)}
          </p>
        </div>
        <div className="shares">
          <strong>Number Of Shares:</strong>
          <p>{shares}</p>
        </div>
        <div className="last-price">
          <strong>Current Stock Value:</strong>
          <p className={holdingStyleColor}>${latestPrice}</p>
        </div>
        <div className="percent-change">
          <strong>Percent Change:</strong>
          <p className={holdingStyleColor}>
            {changePercent}%
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CurrentHoldings;
