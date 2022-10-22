import React, { useState, useEffect, Fragment } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import './Models.css';
import { APP_CONFIG } from '../../config/app-config';
import axios from 'axios';

const BuyModel = props => {
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [sharesValue, setSharesValue] = useState('');
  const [currentShare, setCurrentShare] = useState(0);

  const [wallet, setWallet] = useState(0);
  const [isShowAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.get(
        APP_CONFIG.API_ROOT+  `/user/portfolio`,
        { headers: {
            Authorization: 'Bearer ' + user.data.access_token.token
          }
        }
      );
    if(response.data && response.data.data){
      if(response.data.data.walletBalance){
        setWallet(response.data.data.walletBalance);
      }
      if(response.data.data.sharesData && response.data.data.sharesData.length>0 ){
       // setCurrentShare(response.data.data.sharesData[0].shares)
      }
    }
    } catch (err) {
      console.error('Error in get holdings', err.message);
    }
  };

  const handleClose = () => {
    setShow(false);
    setShowAlert(false);
  };

  const handleUserClose = () => {
    setShowUser(false);
  }

  const handleShow = () => { 
    const user = JSON.parse(localStorage.getItem("user"));
    if(user && user.data &&  user.data.account_verified && user.data.documentUrl){
      setShow(true)
    } else {
      setShowUser(true);
    }
  }


  const handleSubmit = () => {
    if (wallet > sharesValue * props.selectedHolding.latestPrice) {
      handleClose();
      props.handleBuyShares(sharesValue);
    } else {
      setShowAlert(true);
    }
  };

  const { companyName, symbol, latestPrice } = props.selectedHolding;

  return (
    <Fragment>
      <Button className="mr-2 sell-btn" variant="outline-primary" onClick={handleShow}>
        Buy
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {companyName}: {symbol}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <h5 className="text-center">Share value: ${latestPrice}</h5>
            <h5 className="text-center">Current Shares Held: {props.userTotalHolding}</h5>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Share quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Shares"
                value={sharesValue}
                onChange={e => setSharesValue(e.target.value)}
              />
              <Form.Text className="total-price">
                {sharesValue
                  ? '$' + (sharesValue * latestPrice).toFixed(2)
                  : 'Total amount'}
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        {isShowAlert && (
          <Alert
            variant="danger"
            onClose={() => setShowAlert(false)}
            dismissible>
            You currently have only ${wallet.toFixed(2)}. Either sell some
            shares or buy less in order to complete the transaction.
          </Alert>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel Order
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Buy Shares
          </Button>
        </Modal.Footer>
      </Modal>
     {/* user verification model */}
      <Modal show={showUser} onHide={handleUserClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Verification
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
         Please complete the profile activation, You can Buy and Sell stocks.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUserClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default BuyModel;
