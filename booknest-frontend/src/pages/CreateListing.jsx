import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../api/listings.api.js';
import { useToast } from '../context/ToastContext.jsx';
import { Input, Select, Textarea } from '../components/primitives/Input.jsx';
import { ImagePicker } from '../components/primitives/ImagePicker.jsx';
import { Button } from '../components/primitives/Button.jsx';

const CATEGORIES = [
  'Academic', 'Competitive Exam', 'Fiction', 'Non-Fiction',
  'Comics', 'Biography', "Children's", 'Other',
];
const LISTING_TYPES = ['Sell', 'Rent', 'Donate', 'Exchange'];
const CONDITIONS = ['Brand New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor'];

export default function CreateListing() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: '', author: '', isbn: '', category: '', department: '',
    semester: '', listingType: '', condition: '', price: '',
    rentalPrice: '', description: '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await createListing(form, images);
      showToast('Listing published', 'success');
      navigate('/listings/' + res.data.listing._id);
    } catch (err) {
      setError(err.message || 'Could not create listing');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-10">
      <p className="font-mono text-xs text-ochre uppercase tracking-[0.14em] mb-2">
        Add to the shelf
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">List a book</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" required value={form.title} onChange={update('title')} />
        <Input label="Author" required value={form.author} onChange={update('author')} />
        <Input label="ISBN (optional)" value={form.isbn} onChange={update('isbn')} />

        <Select label="Category" required value={form.category} onChange={update('category')}>
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>

        {form.category === 'Academic' && (
          <>
            <Input
              label="Department"
              required
              value={form.department}
              onChange={update('department')}
            />
            <Input
              label="Semester"
              type="number"
              required
              min="1"
              max="12"
              value={form.semester}
              onChange={update('semester')}
            />
          </>
        )}

        <Select
          label="Listing type"
          required
          value={form.listingType}
          onChange={update('listingType')}
        >
          <option value="">Select a type</option>
          {LISTING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>

        {form.listingType === 'Sell' && (
          <Input
            label="Price (Rs.)"
            type="number"
            required
            min="0"
            value={form.price}
            onChange={update('price')}
          />
        )}

        {form.listingType === 'Rent' && (
          <Input
            label="Rental price per month (Rs.)"
            type="number"
            required
            min="0"
            value={form.rentalPrice}
            onChange={update('rentalPrice')}
          />
        )}

        <Select label="Condition" required value={form.condition} onChange={update('condition')}>
          <option value="">Select condition</option>
          {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>

        <Textarea
          label="Description (optional)"
          rows={3}
          value={form.description}
          onChange={update('description')}
        />

        <ImagePicker value={images} onChange={setImages} max={5} />

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Publishing...' : 'Publish listing'}
        </Button>
      </form>
    </div>
  );
}
