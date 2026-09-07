import { PackageX } from 'lucide-react';
import PrimaryButton from './common/PrimaryButton';
import './EmptyState.css';

function EmptyState({ title = "No products found", message = "Try adjusting your search or filter options.", actionText, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <PackageX size={28} />
      </div>
      <h3>{title}</h3>
      <p className="empty-state__msg">{message}</p>
      {actionText && onAction && (
        <PrimaryButton className="empty-state__action" onClick={onAction}>
          {actionText}
        </PrimaryButton>
      )}
    </div>
  );
}

export default EmptyState;
