export default function Loading() {
  return (
    <main className="site-loading" role="status" aria-live="polite" aria-label="Loading page">
      <div className="site-loading__content">
        <img className="site-loading__logo" src="/images/logo/TransparentLogo.png" alt="" />
        <span className="site-loading__eyebrow">AMAAN ANSARI MEMORIAL</span>
        <p className="site-loading__title">A little good is on its way</p>
        <div className="site-loading__track" aria-hidden="true"><span /></div>
        <p className="site-loading__caption">Loading</p>
      </div>
    </main>
  );
}
