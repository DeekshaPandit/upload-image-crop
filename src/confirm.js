import ReactDOM from 'react-dom';
import React, { Component, useState } from 'react';
import Button from 'react-bootstrap/Button';

import Modal from 'react-bootstrap/Modal'

function ConfirmModal({showBox}) {
    const [show, setShow] = useState(showBox);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Modal show={showBox} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm</Modal.Title>
          </Modal.Header>
          <Modal.Body>Please confirm for delete!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              No
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );

}

export default ConfirmModal;