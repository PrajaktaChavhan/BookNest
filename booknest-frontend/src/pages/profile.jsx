import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getUserProfile, updateProfile, uploadAvatar } from '../api/users.api.js';
import { getRatingsForUser } from '../api/ratings.api.js';
import { Input, Textarea } from '../components/primitives/Input.jsx';
import { Button } from '../components/primitives/Button.jsx';
import { TrustSummary } from '../components/profile/TrustSummary.jsx';

export default function Profile() {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const isOwnProfile = !id || (user && id === user.id);
  const [profile, setProfile] = useState(isOwnProfile ? user : null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(!isOwnProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const targetId = isOwnProfile ? user.id : id;
    getRatingsForUser(targetId).then((res) => setReviews(res.data.ratings));

    if (isOwnProfile) {
      setProfile(user);
    } else {
      setIsLoading(true);
      getUserProfile(id)
        .then((res) => setProfile(res.data.user))
        .finally(() => setIsLoading(false));
    }
  }, [id, user, isOwnProfile]);

  function startEditing() {
    setForm({
      name: profile.name || '',
      bio: profile.bio || '',
      college: profile.college || '',
      department: profile.department || '',
      semester: profile.semester || '',
      locality: profile.locality || '',
      whatsappNumber: profile.whatsappNumber || '',
    });
    setIsEditing(true);
  }

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSave(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(form);
      const updated = await refreshUser();
      setProfile(updated);
      setIsEditing(false);
      showToast('Profile updated', 'success');
    } catch (err) {
      showToast(err.message || 'Could not update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await uploadAvatar(file);
      const updated = await refreshUser();
      setProfile(updated);
      showToast('Photo updated', 'success');
    } catch (err) {
      showToast(err.message || 'Could not upload photo', 'error');
    }
  }

  if (isLoading || !profile) {
    return <p className="text-center py-16 text-ink-soft font-mono text-sm">loading...</p>;
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-10">
      <div className="flex items-start gap-4">
        <div className="relative w-20 h-20 rounded-sm bg-sage-light flex items-center justify-center shrink-0 overflow-hidden">
          {profile.profilePicture ? (
            <img src={profile.profilePicture} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="font-display text-2xl text-moss-deep">
              {profile.name?.[0]?.toUpperCase() || '?'}
            </span>
          )}
          {isOwnProfile && (
            <label className="absolute inset-0 bg-ink/0 hover:bg-ink/40 flex items-center justify-center cursor-pointer transition-colors group">
              <span className="text-[10px] text-paper-raised opacity-0 group-hover:opacity-100 font-medium">
                Change
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex-1">
          <h1 className="font-display text-2xl font-semibold text-ink">{profile.name}</h1>
          {profile.college && <p className="text-sm text-ink-soft mt-0.5">{profile.college}</p>}
          <p className="text-sm text-ink-soft">{profile.locality}</p>
        </div>

        {isOwnProfile && !isEditing && (
          <Button variant="secondary" size="sm" onClick={startEditing}>
            Edit profile
          </Button>
        )}
      </div>

      {profile.bio && !isEditing && (
        <p className="text-ink mt-4 leading-relaxed text-sm">{profile.bio}</p>
      )}

      {isEditing && (
        <form onSubmit={handleSave} className="space-y-4 mt-6 border-t border-hairline pt-6">
          <Input label="Name" required value={form.name} onChange={update('name')} />
          <Textarea label="Bio" rows={3} value={form.bio} onChange={update('bio')} />
          <Input label="College (optional)" value={form.college} onChange={update('college')} />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Department (optional)"
              value={form.department}
              onChange={update('department')}
            />
            <Input
              label="Semester (optional)"
              type="number"
              min="1"
              max="12"
              value={form.semester}
              onChange={update('semester')}
            />
          </div>
          <Input label="Locality" required value={form.locality} onChange={update('locality')} />
          <Input
            label="WhatsApp number"
            required
            value={form.whatsappNumber}
            onChange={update('whatsappNumber')}
          />
          <div className="flex gap-3">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="border-t border-hairline mt-8 pt-6">
        <p className="font-mono text-xs text-ochre uppercase tracking-[0.14em] mb-3">
          Reputation
        </p>
        <TrustSummary user={profile} reviews={reviews} />
      </div>
    </div>
  );
}