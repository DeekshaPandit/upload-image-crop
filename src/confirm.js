import ReactDOM from 'react-dom';
import React, { Component, useState } from 'react';
import Button from 'react-bootstrap/Button';

import Modal from 'react-bootstrap/Modal'

function ConfirmModal({ showBox, onConfirm, photosLength }) {
  const [show, setShow] = useState(showBox);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={showBox} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Remove {photosLength} photos</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete {photosLength} photos?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { onConfirm(false) }}>
            Cancel
            </Button>
          <Button variant="primary" className="btn btn-danger" onClick={() => { onConfirm(true) }}>
            Confirm and Remove
            </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

}

export default ConfirmModal;