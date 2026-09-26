export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: '#fff' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', fontFamily: "'Bricolage Grotesque', sans-serif" }}>404</h1>
      <p style={{ color: '#a1a1aa', marginBottom: '32px', fontFamily: "'Inter', sans-serif" }}>The page you are looking for does not exist.</p>
      <a href="/" style={{ padding: '12px 24px', background: '#fff', color: '#09090b', borderRadius: '100px', textDecoration: 'none', fontWeight: 600, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Return Home</a>
    </div>
  );
}
