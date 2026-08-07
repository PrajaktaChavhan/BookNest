export function TrustSummary({ user, reviews }) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <p className="font-display text-3xl font-semibold text-moss-deep">
          {(user.averageRating || 0).toFixed(1)}
        </p>
        <p className="text-sm text-ink-soft">
          {user.ratingCount || 0} review{user.ratingCount === 1 ? '' : 's'}
        </p>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-ink-soft mt-3">No reviews yet.</p>
      ) : (
        <div className="mt-4 divide-y divide-hairline border-t border-hairline">
          {reviews.map((r) => (
            <div key={r._id} className="py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink">{r.ratedBy?.name || 'A user'}</p>
                <p className="font-mono text-xs text-ochre">{r.score} / 5</p>
              </div>
              {r.comment && <p className="text-sm text-ink-soft mt-1">{r.comment}</p>}
              {r.response && (
                <p className="text-xs text-ink-soft mt-2 pl-3 border-l-2 border-hairline">
                  Response: {r.response}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}