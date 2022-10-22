import React from 'react';
import { Toast } from 'react-bootstrap';

const ShowAlert = props => {
  const { latestPrice, symbol } = props.selectedHolding;

  return (
    <Toast
      className="mx-auto"
      onClose={() => props.toggleAlertState()}
      show={props.isShowAlert}
      delay={7000}
      autohide
    >
      <Toast.Header>
        <strong className="mr-auto">
          Transaction Completed
        </strong>
      </Toast.Header>
      <Toast.Body>
        Successfully {props.alertMessage} {props.sharesPurchased} shares from
        {symbol} for a total of ${props.sharesPurchased * latestPrice}
      </Toast.Body>
    </Toast>
  );
};

export default ShowAlert;
