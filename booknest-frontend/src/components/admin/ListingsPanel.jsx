import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllListings, deleteListingAsAdmin } from '../../api/admin.api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../primitives/Button.jsx';

export function ListingsPanel() {
  const { showToast } = useToast();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');

  function load() {
    setIsLoading(true);
    getAllListings({ q: query || undefined })
      .then((res) => setListings(res.data.items))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, [query]);

  async function handleDelete(id) {
    setListings((prev) => prev.filter((l) => l._id !== id));
    try {
      await deleteListingAsAdmin(id);
      showToast('Listing removed', 'success');
    } catch (err) {
      showToast(err.message || 'Could not remove listing', 'error');
      load();
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search by title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-sm rounded-sm border border-hairline bg-paper-raised px-3.5 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss"
      />

      {isLoading ? (
        <p className="text-sm text-ink-soft font-mono">loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-sm text-ink-soft">No listings found.</p>
      ) : (
        <div className="border border-hairline rounded-sm bg-paper-raised overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs text-ink-soft uppercase tracking-wide">
                <th className="px-4 py-2.5 font-medium">Title</th>
                <th className="px-4 py-2.5 font-medium">Owner</th>
                <th className="px-4 py-2.5 font-medium">Type</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l._id} className="border-b border-hairline last:border-b-0">
                  <td className="px-4 py-2.5">
                    <Link to={'/listings/' + l._id} className="text-ink hover:text-moss">
                      {l.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-ink-soft">{l.owner?.name || 'Unknown'}</td>
                  <td className="px-4 py-2.5 text-ink-soft font-mono text-xs">{l.listingType}</td>
                  <td className="px-4 py-2.5 text-ink-soft font-mono text-xs">{l.status}</td>
                  <td className="px-4 py-2.5 text-right">
                    <Button variant="danger" size="sm" onClick={() => handleDelete(l._id)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}