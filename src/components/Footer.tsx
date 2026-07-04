export default function Footer() {
  return (
    <footer className="w-full py-16 px-5 sm:px-8 border-t border-white/10 mt-20 bg-[#0a0a0f] text-white">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Relay Logo" className="w-10 h-10 rounded-none border border-white/20 shadow-[3px_3px_0px_rgba(176,48,136,0.8)] object-cover" />
            <span className="text-3xl font-bold tracking-tight uppercase">Relay</span>
          </div>
          <p className="text-[#8888a8] font-medium text-sm max-w-xs">
            The simple way to drop-in email templates.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold uppercase tracking-wider text-sm mb-2">Platform</h3>
          <a href="#" className="text-[#8888a8] hover:text-white transition-colors font-medium text-sm">Documentation</a>
          <a href="#" className="text-[#8888a8] hover:text-white transition-colors font-medium text-sm">Privacy Policy</a>
          <a href="#" className="text-[#8888a8] hover:text-white transition-colors font-medium text-sm">Terms of Service</a>
        </div>

        {/* Developer Info */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold uppercase tracking-wider text-sm mb-2">Developed By Prodhosh</h3>
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="https://github.com/PRODHOSH.png" 
              alt="PRODHOSH" 
              className="w-10 h-10 border border-white/20"
              style={{ borderRadius: '0px' }}
            />
            <span className="font-bold text-lg tracking-tight uppercase">PRODHOSH</span>
          </div>
          <a href="https://github.com/PRODHOSH" target="_blank" rel="noreferrer" className="text-[#8888a8] hover:text-white transition-colors font-medium text-sm">GitHub</a>
          <a href="https://linkedin.com/in/prodhoshvs" target="_blank" rel="noreferrer" className="text-[#8888a8] hover:text-white transition-colors font-medium text-sm">LinkedIn</a>
          <a href="https://prodhosh.me" target="_blank" rel="noreferrer" className="text-[#8888a8] hover:text-white transition-colors font-medium text-sm">Portfolio (prodhosh.me)</a>
          <a href="mailto:hello@prodhosh.me" className="text-[#8888a8] hover:text-white transition-colors font-medium text-sm">hello@prodhosh.me</a>
        </div>
        
      </div>
      <div className="max-w-[1280px] mx-auto mt-16 pt-8 border-t border-white/10 flex justify-between items-center text-[#8888a8] text-xs font-semibold uppercase">
        <p>© 2026 Relay Inc.</p>
        <p>Built with Next.js</p>
      </div>
    </footer>
  );
}
