import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import './stock.css';

function ShowRecommendations(props) {
  const [shares, setShares] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [holdingStyleColor, setHoldingStyleColor] = useState('');
  const [positiveSign, setPositiveSign] = useState(false);

  useEffect(() => {
    const isHoldingNegativeOrPositive = () => {
      if (String(changePercent).charAt(0) === '-') {
        setHoldingStyleColor('red');
        setPositiveSign(false);
      } else {
        setHoldingStyleColor('green');
        setPositiveSign('+');
      }
    };

    isHoldingNegativeOrPositive();
  }, []);

  useEffect(() => {
    const compareSelectedHoldingToExistingList = () => {
      const holdingExist = holdings.find(
        holding => holding.symbol === props.recommendedHolding.symbol
      );
      if (holdingExist) {
        setShares(holdingExist.shares);
      }
    };

    compareSelectedHoldingToExistingList();
  }, [holdings]);

  const {
    companyName,
    latestPrice,
    changePercent,
    change,
    symbol,
    userTotalHoldings
  } = props.recommendedHolding;

  return (
    <div className="recommended-holding stock">
      <div className="selected-holding card mt-3">
        <div className="card-head">
          <h3>
            {' '}
            {companyName}: {symbol}
          </h3>
          <Button
            href="#goup"
            variant="outline-primary"
            onClick={() => props.handleTrade(symbol, userTotalHoldings)}
          >
            Trade
          </Button>{' '}
        </div>
        <hr />
        <div className="card-body">
          <div className="price">
            <strong>Current Price</strong>
            <p className={holdingStyleColor}>${latestPrice.toFixed(2)}</p>
          </div>
          <div className="percent">
            <strong>Percent Change</strong>
            <p className={holdingStyleColor}>
              {positiveSign}
              {changePercent.toFixed(3)}%
            </p>
          </div>
          <div className="change">
            <strong>Daily Gain/Loss</strong>
            <p className={holdingStyleColor}>
              {positiveSign}${change}
            </p>
          </div>
          <div className="shares-held">
            <strong>Shares Held</strong>
            <p>{userTotalHoldings}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowRecommendations;