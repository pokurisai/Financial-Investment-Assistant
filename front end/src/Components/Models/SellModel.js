import React, { useState, Fragment ,useEffect} from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { APP_CONFIG } from '../../config/app-config';
import './Models.css';

const SellModel = props => {
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [isShowAlert, setShowAlert] = useState(false);
  const [sharesInput, setSharesInput] = useState('');
  const [currentShare, setCurrentShare] = useState(0);

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
    if(response.data && response.data.data)
      setCurrentShare(response.data.data.sharesData[0].shares)
    } catch (err) {
      console.error('Error in get holdings', err.message);
    }
  };

  const handleClose = () => {
    setShow(false);
    setShowAlert(false);
  };
  const handleShow = () => { 
    const user = JSON.parse(localStorage.getItem("user"));
    if(user && user.data &&  user.data.account_verified && user.data.documentUrl){
      setShow(true);
      setSharesInput('');
    } else {
      setShowUser(true);
    }
  }

  const handleUserClose = () => {
    setShowUser(false);
  }


  // submit action
  const handleSubmit = () => {
    if (sharesInput > props.userTotalHolding) {
      setShowAlert(true);
      setShow(true);
    } else {
      setShowAlert(false);
      props.handleSellShares(sharesInput);
    }
  };

  const { companyName, symbol, latestPrice } = props.selectedHolding;
  return (
    <Fragment>
      <Button variant="secondary" onClick={handleShow} className="sell-btn">
        Sell
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
              <Form.Label> Share quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Shares"
                value={sharesInput}
                onChange={e => setSharesInput(e.target.value)}
              />
              <Form.Text className="total-price">
                {sharesInput
                  ? '$' + (sharesInput * latestPrice).toFixed(2)
                  : 'Total amount'}
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        {isShowAlert && (
          <Alert
            variant="danger"
            onClose={() => setShowAlert(false)}
            dismissible
            className="alert">
            <p> You don't own enough shares to make that transaction</p>
          </Alert>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel Order
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleClose();
              handleSubmit();
            }}>
            Sell Shares
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

export default SellModel;