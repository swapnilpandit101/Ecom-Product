import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : Info;

  return (
    <div className="toast">
      <Icon size={20} color="#000000" />
      <span>{message}</span>
      <button className="btn--icon toast__close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;
