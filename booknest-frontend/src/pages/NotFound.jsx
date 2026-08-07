import { Link } from 'react-router-dom';
import { Button } from '../components/primitives/Button.jsx';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-5 py-24 text-center">
      <p className="font-display text-6xl text-sage mb-4">404</p>
      <h1 className="font-display text-2xl font-semibold text-ink mb-2">
        This page isn't on the shelf
      </h1>
      <p className="text-ink-soft text-sm mb-8">
        The page you're looking for doesn't exist, or may have moved.
      </p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}