import Modal from './Modal';
import SecondaryButton from './common/SecondaryButton';
import DangerButton from './common/DangerButton';
import { AlertTriangle } from 'lucide-react';
import './ConfirmModal.css';

function ConfirmModal({ open, title = "Confirm Action", message, onConfirm, onClose }) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="confirm-modal__body">
        <div className="confirm-modal__icon">
          <AlertTriangle size={24} />
        </div>
        <p className="confirm-modal__text">{message}</p>
      </div>

      <div className="modal__footer confirm-modal__footer">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <DangerButton onClick={onConfirm}>Delete</DangerButton>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
