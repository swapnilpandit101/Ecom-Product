import { Compass, Home } from 'lucide-react';
import PrimaryButton from '../components/common/PrimaryButton';
import './NotFound.css';

function NotFound({ onNavigate }) {
  return (
    <div className="not-found-page">
      <div className="not-found-page__icon">
        <Compass size={40} />
      </div>
      <div className="not-found-page__code">404</div>
      <h2>Page Not Found</h2>
      <p className="not-found-page__desc">
        The page or product link you are trying to access does not exist or has been moved.
      </p>
      <PrimaryButton className="not-found-page__action" onClick={() => onNavigate('products')}>
        <Home size={18} />
        <span>Return to Catalog</span>
      </PrimaryButton>
    </div>
  );
}

export default NotFound;
