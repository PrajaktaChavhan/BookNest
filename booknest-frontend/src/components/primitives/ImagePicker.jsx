import { useEffect, useRef, useState } from 'react';

export function ImagePicker({ value = [], onChange, max = 5 }) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = value.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [value]);

  function handleFilesSelected(e) {
    const newFiles = Array.from(e.target.files);
    const combined = [...value, ...newFiles].slice(0, max);
    onChange(combined);
    e.target.value = '';
  }

  function removeAt(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-ink-soft mb-1.5">
        Photos (up to {max})
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          {previews.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-sm overflow-hidden border border-hairline">
              <img src={url} alt={'Selected photo ' + (i + 1)} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label={'Remove photo ' + (i + 1)}
                className="absolute top-1 right-1 w-5 h-5 bg-ink/70 text-paper-raised rounded-sm flex items-center justify-center text-xs hover:bg-danger transition-colors"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {value.length < max && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-sm border border-dashed border-hairline rounded-sm px-3.5 py-2 text-ink-soft hover:border-moss hover:text-moss transition-colors"
        >
          {value.length === 0 ? 'Add photos' : 'Add more (' + value.length + '/' + max + ')'}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFilesSelected}
        className="hidden"
      />
    </div>
  );
}