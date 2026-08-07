import { useEffect, useState } from 'react';
import { browseRequests, createRequest, fulfillRequest, deleteRequest } from '../api/requests.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { RequestCard } from '../components/requests/RequestCard.jsx';
import { EmptyState } from '../components/primitives/EmptyState.jsx';
import { Button } from '../components/primitives/Button.jsx';
import { Modal } from '../components/primitives/Modal.jsx';
import { Input, Select, Textarea } from '../components/primitives/Input.jsx';

const CATEGORIES = [
  'Academic', 'Competitive Exam', 'Fiction', 'Non-Fiction',
  'Comics', 'Biography', "Children's", 'Other',
];

export default function Requests() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: '', notes: '' });

  function loadRequests() {
    setIsLoading(true);
    browseRequests()
      .then((res) => setRequests(res.data.items))
      .finally(() => setIsLoading(false));
  }

  useEffect(loadRequests, []);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createRequest(form);
      showToast('Request posted', 'success');
      setForm({ title: '', author: '', isbn: '', category: '', notes: '' });
      setIsModalOpen(false);
      loadRequests();
    } catch (err) {
      showToast(err.message || 'Could not post request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleFulfill(id) {
    setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: 'Fulfilled' } : r)));
    await fulfillRequest(id);
    showToast('Marked as fulfilled', 'success');
    loadRequests();
  }

  async function handleDelete(id) {
    setRequests((prev) => prev.filter((r) => r._id !== id));
    await deleteRequest(id);
    showToast('Request removed', 'info');
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs text-ochre uppercase tracking-[0.16em] mb-2">
            Ask the shelf
          </p>
          <h1 className="font-display text-2xl font-semibold text-ink">Requests</h1>
        </div>
        {user ? (
          <Button onClick={() => setIsModalOpen(true)}>Post a request</Button>
        ) : (
          <p className="text-sm text-ink-soft">Log in to post a request</p>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-ink-soft font-mono">loading...</p>
      ) : requests.length === 0 ? (
        <EmptyState
          title="No open requests yet"
          description="Can't find a book on the shelf? Post what you're looking for so nearby owners can spot it."
          action={
            user && <Button onClick={() => setIsModalOpen(true)}>Post a request</Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {requests.map((r) => (
            <RequestCard
              key={r._id}
              request={r}
              isMine={user && r.requester?._id === user.id}
              onFulfill={handleFulfill}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post a request">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" required value={form.title} onChange={update('title')} />
          <Input label="Author (optional)" value={form.author} onChange={update('author')} />
          <Input label="ISBN (optional)" value={form.isbn} onChange={update('isbn')} />
          <Select label="Category (optional)" value={form.category} onChange={update('category')}>
            <option value="">Any category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Textarea
            label="Notes (optional)"
            rows={2}
            placeholder="Any edition fine, willing to rent too..."
            value={form.notes}
            onChange={update('notes')}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Posting...' : 'Post request'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}