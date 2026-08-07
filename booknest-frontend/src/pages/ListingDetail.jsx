import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getListing, updateListingStatus } from '../api/listings.api.js';
import { api } from '../api/axiosInstance.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { whatsappLink } from '../utils/whatsappLink.js';
import { StatusStamp } from '../components/primitives/Stamp.jsx';
import { TransactionBadge } from '../components/primitives/Badge.jsx';
import { Button } from '../components/primitives/Button.jsx';
import { Modal } from '../components/primitives/Modal.jsx';

const STATUS_FLOW = {
  Available: 'Reserved',
  Reserved: 'Sold',
};
const STATUS_ACTION_LABEL = {
  Available: 'Mark as Reserved',
  Reserved: 'Mark as Sold / Completed',
};

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [wishlistState, setWishlistState] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [justChanged, setJustChanged] = useState(false);

  useEffect(() => {
    getListing(id)
      .then((res) => setListing(res.data.listing))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleMessageSeller() {
    setIsStartingChat(true);
    try {
      const res = await api.post('/api/conversations', { listingId: id });
      navigate('/chat/' + res.data.conversation._id);
    } catch (err) {
      showToast(err.message || 'Could not start conversation', 'error');
    } finally {
      setIsStartingChat(false);
    }
  }

  async function toggleWishlist() {
    try {
      if (wishlistState) {
        await api.delete('/api/wishlist/' + id);
        setWishlistState(false);
        showToast('Removed from wishlist', 'info');
      } else {
        await api.post('/api/wishlist/' + id);
        setWishlistState(true);
        showToast('Saved to wishlist', 'success');
      }
    } catch (err) {
      if (err.code === 'ALREADY_WISHLISTED') setWishlistState(true);
    }
  }

  // Owner-only, matching the backend's ownership-enforced status endpoint -
  // the buyer's path is to message the seller, not self-reserve.
  async function confirmStatusUpdate() {
    const nextStatus = STATUS_FLOW[listing.status];
    if (!nextStatus) return;
    setIsUpdatingStatus(true);
    try {
      const res = await updateListingStatus(id, nextStatus);
      setListing(res.data.listing);
      setJustChanged(true);
      setIsStatusModalOpen(false);
      showToast('Listing marked ' + nextStatus, 'success');
      setTimeout(() => setJustChanged(false), 400);
    } catch (err) {
      showToast(err.message || 'Could not update this listing', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  if (isLoading) {
    return <p className="text-center py-16 text-ink-soft font-mono text-sm">loading...</p>;
  }
  if (!listing) {
    return <p className="text-center py-16 text-ink-soft font-mono text-sm">listing not found</p>;
  }

  const isOwner = user && listing.owner && user.id === listing.owner._id;
  const ownerId = listing.owner ? listing.owner._id : null;
  const ownerWhatsapp = listing.owner ? listing.owner.whatsappNumber : null;
  const listingTitle = listing.title;
  const ownerName = listing.owner ? listing.owner.name : '';
  const ownerRating = listing.owner ? listing.owner.averageRating || 0 : 0;
  const ownerRatingCount = listing.owner ? listing.owner.ratingCount || 0 : 0;
  const ownerLocality = listing.owner ? listing.owner.locality : '';
  const coverImage = listing.images && listing.images[0] ? listing.images[0].url : null;
  const nextStatus = STATUS_FLOW[listing.status];

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <div className="relative h-72 bg-sage-light rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
        {coverImage ? (
          <img src={coverImage} alt={listingTitle} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display italic text-sage">no cover yet</span>
        )}
        <div className="absolute top-4 right-4">
          <StatusStamp status={listing.status} animate={justChanged} />
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink leading-tight">
            {listingTitle}
          </h1>
          <p className="text-ink-soft mt-1">{listing.author}</p>
        </div>
        {!isOwner && (
          <button
            onClick={toggleWishlist}
            aria-pressed={!!wishlistState}
            className={
              'shrink-0 text-sm font-medium border rounded-sm px-4 py-2 transition ' +
              (wishlistState
                ? 'border-ochre text-ochre bg-ochre-light'
                : 'border-hairline text-ink-soft hover:border-moss hover:text-moss')
            }
          >
            {wishlistState ? 'Saved' : 'Save'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <TransactionBadge type={listing.listingType} />
        <span className="text-sm font-mono text-ink-soft">{listing.condition}</span>
      </div>

      {listing.description && (
        <p className="text-ink mt-5 leading-relaxed">{listing.description}</p>
      )}

      {(listing.price || listing.rentalPrice) && (
        <p className="font-mono text-2xl text-moss-deep mt-6">
          {listing.price
            ? 'Rs. ' + listing.price
            : 'Rs. ' + listing.rentalPrice + ' / mo'}
        </p>
      )}

      <div className="border-t border-hairline mt-8 pt-8">
        <p className="font-mono text-xs text-ink-soft uppercase tracking-wide mb-2">
          Listed by
        </p>
        <p className="font-medium text-ink text-lg">
          {ownerId ? (
            <Link to={'/profile/' + ownerId} className="hover:text-moss transition-colors">
              {ownerName}
            </Link>
          ) : (
            ownerName
          )}
        </p>
        <p className="text-sm text-ink-soft mt-0.5">
          {ownerRating} rating &middot; {ownerRatingCount} reviews &middot; {ownerLocality}
        </p>

        {!isOwner && (
          <div className="flex gap-3 mt-6 flex-wrap">
            <Button onClick={handleMessageSeller} disabled={isStartingChat}>
              {isStartingChat ? 'Starting chat...' : 'Message seller'}
            </Button>
            {ownerWhatsapp && (
              <a
                href={whatsappLink(ownerWhatsapp, listingTitle)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors border border-hairline text-ink-soft hover:border-moss hover:text-moss px-5 py-2.5 text-sm"
              >
                WhatsApp
              </a>
            )}
          </div>
        )}

        {/* Owner-only status control - this is your listing, so you decide
            when it's Reserved or Sold, once you've agreed with a buyer. */}
        {isOwner && nextStatus && (
          <div className="mt-6">
            <Button variant="secondary" onClick={() => setIsStatusModalOpen(true)}>
              {STATUS_ACTION_LABEL[listing.status]}
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={STATUS_ACTION_LABEL[listing.status] || 'Update listing'}
      >
        <p className="text-ink-soft text-sm mb-6">
          {nextStatus === 'Reserved'
            ? 'This tells other students the book is spoken for. You can still revert it if the arrangement falls through.'
            : 'This marks the exchange as complete and closes the listing.'}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setIsStatusModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmStatusUpdate} disabled={isUpdatingStatus}>
            {isUpdatingStatus ? 'Updating...' : 'Confirm'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
