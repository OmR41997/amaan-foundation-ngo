export default function Loading() {
  return (
    <main
      className="site-loading"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      {/* Ambient background glow orbs */}
      <div className="site-loading__glow site-loading__glow--primary" aria-hidden="true" />
      <div className="site-loading__glow site-loading__glow--secondary" aria-hidden="true" />

      {/* Main centered content */}
      <div className="site-loading__content">
        {/* Animated logo with white background disc, glowing halo & rotating dashed ring */}
        <div className="site-loading__logo-wrapper">
          <div className="site-loading__halo" aria-hidden="true" />
          <div className="site-loading__ring" aria-hidden="true" />
          <div className="site-loading__logo-disc">
            <img
              className="site-loading__logo"
              src="/images/logo/logo.png"
              alt="Amaan Ansari Welfare Foundation"
              width={72}
              height={72}
            />
          </div>
        </div>

        {/* Brand identity badge */}
        <div className="site-loading__badge">
          <span className="site-loading__badge-dot" aria-hidden="true" />
          <span className="site-loading__eyebrow">AMAAN ANSARI WELFARE FOUNDATION</span>
        </div>

        {/* Poetic loading headline */}
        <p className="site-loading__title">A little good is on its way</p>

        {/* Elegant gradient progress bar */}
        <div className="site-loading__track" aria-hidden="true">
          <span className="site-loading__bar" />
        </div>

        {/* Status caption with animated pulsing dots */}
        <div className="site-loading__status">
          <span className="site-loading__caption">Loading</span>
          <span className="site-loading__dots" aria-hidden="true">
            <span className="site-loading__dot" />
            <span className="site-loading__dot" />
            <span className="site-loading__dot" />
          </span>
        </div>
      </div>
    </main>
  );
}
