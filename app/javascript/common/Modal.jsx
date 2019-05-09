import React from 'react'
import PropTypes from 'prop-types'
import {
  CardTitle,
  Modal,
  ModalBody,
  ModalHeader,
  PrimitiveButton as Button,
} from '@cwds/components'

const ModalComponent = ({isOpen, size, modalTitle, modalBody, onCloseText, toggle, okText}) => {
  return (
    <div>
      <Modal isOpen={isOpen} size={size}>
        <ModalHeader toggle={toggle}>
          <CardTitle>{modalTitle}</CardTitle>
        </ModalHeader>
        <ModalBody>
          {modalBody}
        </ModalBody>
        <div className="p-3 text-right">
          {onCloseText ? <Button className="m-1" onClick={toggle}>
            {onCloseText}
          </Button> : null}
          <Button className="m-1" color="primary" onClick={toggle}>
            {okText}
          </Button>
        </div>

      </Modal>
    </div>
  )
}

ModalComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalBody: PropTypes.any,
  modalTitle: PropTypes.string,
  okText: PropTypes.string,
  onCloseText: PropTypes.string,
  size: PropTypes.string,
  toggle: PropTypes.func,

}
export default ModalComponent
