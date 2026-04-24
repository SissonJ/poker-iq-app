import { useEffect, useRef } from 'react';

// ⚠ Replace with your actual AdSense ad unit data-ad-slot values
export default function AdSlot({ slot = 'XXXXXXXXXX', className = '' }) {
  const ref = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (_) {}
  }, []);

  return (
    <div className={`ad-slot ${className}`} ref={ref}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
