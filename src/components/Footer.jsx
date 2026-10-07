import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Brand Social SVG Icons
function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TwitterXIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/>
    </svg>
  );
}

export default function Footer({ 
  onOpenConsult, 
  onNavigateToAbout, 
  onNavigateHome 
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Smooth scroll handler for landing page anchors
  const handleScrollTo = (sectionId, e) => {
    e?.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  const handleServiceNav = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <footer className="w-full bg-[#06152D] text-slate-300 relative z-10 border-t border-[#0F2A55] pt-10 sm:pt-12 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        className="max-w-7xl mx-auto"
      >
        {/* ======================================================== */}
        {/* 1. TOP FOOTER AREA (Desktop: Left Brand + 4 Link Cols) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10">
          
          {/* LEFT: Branding, Logo & Description (Span 3 on lg, 3 on xl) */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-3 flex flex-col items-start">
            <a 
              href="#home"
              onClick={(e) => handleScrollTo('home', e)}
              className="inline-flex items-center group cursor-pointer focus:outline-none"
              aria-label="LegalBharosa Home"
            >
              <div className="inline-flex items-center bg-white px-3.5 py-1.5 rounded-xl shadow-sm border border-white/20 transition-transform group-hover:scale-102">
                <img 
                  src="/assets/legalbharosa-horizontal.png" 
                  alt="LegalBharosa.org — Trust. Support. Solutions." 
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              </div>
            </a>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-sm">
              {t('footer.tagline', 'Trusted legal support, dispute resolution and protection — all in one place.')}
            </p>

            {/* Accreditation Badge */}
            <div className="mt-5 flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B2A5B]/80 border border-[#168CFF]/30 text-xs text-slate-200">
                <ShieldCheck className="w-4 h-4 text-[#F4B400] shrink-0" />
                <span>{t('footer.accreditation', 'Bar Council Panel & RBI Aligned')}</span>
              </div>
            </div>
          </div>

          {/* COLUMN 1: LEGAL SERVICES (Span 2) */}
          <div className="lg:col-span-2 sm:col-span-1 flex flex-col">
            <h3 className="text-xs font-bold font-inter tracking-wider text-white uppercase mb-4 flex items-center gap-1.5">
              <span>{t('footer.legalServices', 'LEGAL SERVICES')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#168CFF]" />
            </h3>
            <ul className="space-y-2.5 text-[13.5px]">
              <li>
                <button 
                  type="button"
                  onClick={() => handleServiceNav('/services/harassment-protection')}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('services.items.harassmentProtection.title', 'Harassment Protection')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => handleServiceNav('/services/loan-settlement')}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('services.items.loanSettlement.title', 'Loan Settlement')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => handleServiceNav('/services/legal-notice-review')}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('services.items.legalNoticeReview.title', 'Legal Notice Review')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => handleServiceNav('/services/debt-management')}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('services.items.debtManagement.title', 'Debt Management')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => handleServiceNav('/services/npa-secured-loans')}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('services.items.npaSecuredLoans.title', 'NPA & Secured Loans')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => handleServiceNav('/services/credit-recovery')}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('services.items.creditRecovery.title', 'Credit Recovery')}
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: COMPANY (Span 2) */}
          <div className="lg:col-span-2 sm:col-span-1 flex flex-col">
            <h3 className="text-xs font-bold font-inter tracking-wider text-white uppercase mb-4 flex items-center gap-1.5">
              <span>{t('footer.company', 'COMPANY')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#168CFF]" />
            </h3>
            <ul className="space-y-2.5 text-[13.5px]">
              <li>
                <button 
                  type="button"
                  onClick={() => {
                    navigate('/services');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('nav.services', 'Our Services')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => {
                    navigate('/how-it-works');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('nav.howItWorks', 'How It Works')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => onNavigateToAbout ? onNavigateToAbout() : navigate('/about')}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('nav.about', 'About Us')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => {
                    navigate('/client-stories');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('nav.clientStories', 'Client Stories')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => {
                    navigate('/articles');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('nav.articles', 'Articles')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => {
                    navigate('/faq');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('nav.faq', 'FAQ')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => {
                    navigate('/contact');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('nav.contact', 'Contact Us')}
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: LEGAL (Span 2) */}
          <div className="lg:col-span-2 sm:col-span-1 flex flex-col">
            <h3 className="text-xs font-bold font-inter tracking-wider text-white uppercase mb-4 flex items-center gap-1.5">
              <span>{t('footer.legal', 'LEGAL')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F4B400]" />
            </h3>
            <ul className="space-y-2.5 text-[13.5px]">
              <li>
                <button 
                  type="button"
                  onClick={() => onOpenConsult?.('Privacy Policy')}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('footer.privacyPolicy', 'Privacy Policy')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => onOpenConsult?.('Terms of Service')}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('footer.termsOfService', 'Terms of Service')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => onOpenConsult?.('Disclaimer')}
                  className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  {t('footer.disclaimer', 'Disclaimer')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => onOpenConsult?.('RBI Guidelines')}
                  className="text-slate-300 hover:text-[#F4B400] hover:translate-x-0.5 transition-all text-left cursor-pointer font-medium"
                >
                  {t('footer.rbiGuidelines', 'RBI Fair Practices')}
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT & SOCIALS (Span 3 on lg) */}
          <div className="lg:col-span-3 sm:col-span-1 flex flex-col">
            <h3 className="text-xs font-bold font-inter tracking-wider text-white uppercase mb-4 flex items-center gap-1.5">
              <span>{t('footer.contact', 'CONTACT')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#168CFF]" />
            </h3>
            <ul className="space-y-3 text-[13.5px]">
              <li>
                <a 
                  href="mailto:Legalbharosa.orga@gmail.com" 
                  className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4 text-[#168CFF] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="break-all sm:break-normal">Legalbharosa.orga@gmail.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:7386444186" 
                  className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors group"
                >
                  <Phone className="w-4 h-4 text-[#168CFF] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="tracking-wide">7386444186</span>
                </a>
              </li>
              <li>
                <div className="flex flex-col gap-1.5 text-slate-300">
                  <div className="flex items-center gap-2 text-slate-200">
                    <MapPin className="w-4 h-4 text-[#F4B400] shrink-0" />
                    <span className="font-semibold text-xs uppercase tracking-wider text-white">{t('footer.companyLocation', 'Company Location')}</span>
                  </div>
                  <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                    Raj Bhavan Rd, Lumbini Classic Apartment, Somajiguda, Hyderabad, Telangana 500082
                  </p>
                  <a 
                    href="https://maps.app.goo.gl/AUEVoh3Y6EPQoV5n6?g_st=ac" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#38BDF8] hover:text-[#7DD3FC] hover:underline pl-6 transition-colors"
                  >
                    <span>{t('footer.viewOnGoogleMaps', 'View on Google Maps')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </li>
            </ul>

            {/* Social Icons (using project verified links) */}
            <div className="mt-5 pt-3 border-t border-white/10">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2.5">
                {t('footer.connectWithUs', 'Connect With Us')}
              </span>
              <div className="flex items-center gap-2.5">
                {/* 1. WhatsApp */}
                <a 
                  href="https://wa.me/917386444186"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-white/[0.06] hover:bg-[#25D366] text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>

                {/* 2. Instagram */}
                <a 
                  href="https://www.instagram.com/reels/DZRUnoQxav2/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Follow on Instagram"
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-white/[0.06] hover:bg-[#E1306C] text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>

                {/* 3. Twitter / X */}
                <a 
                  href="https://x.com/legalbharosa"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Follow on X"
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-white/[0.06] hover:bg-white text-slate-300 hover:text-black border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label="Twitter / X"
                >
                  <TwitterXIcon className="w-3.5 h-3.5" />
                </a>

                {/* 4. Facebook */}
                <a 
                  href="https://www.facebook.com/legalbharosa"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Connect on Facebook"
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-white/[0.06] hover:bg-[#1877F2] text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. BOTTOM COPYRIGHT BAR & SUBTLE DIVIDER */}
        {/* ======================================================== */}
        <div className="w-full h-px bg-white/10 my-8 sm:my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          <p className="font-sans font-medium text-slate-300">
            {t('footer.copyright', '© 2026 LegalBharosa Technologies Pvt. Ltd. All rights reserved.')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-medium">
            <button 
              type="button"
              onClick={() => onOpenConsult?.('Privacy Policy')} 
              className="hover:text-white transition-colors cursor-pointer py-1.5 min-h-[36px] flex items-center"
            >
              {t('footer.privacyPolicy', 'Privacy Policy')}
            </button>
            <span className="text-slate-600 hidden xs:inline">|</span>
            <button 
              type="button"
              onClick={() => onOpenConsult?.('Terms of Service')} 
              className="hover:text-white transition-colors cursor-pointer py-1.5 min-h-[36px] flex items-center"
            >
              {t('footer.termsOfService', 'Terms of Service')}
            </button>
            <span className="text-slate-600 hidden xs:inline">|</span>
            <button 
              type="button"
              onClick={() => onOpenConsult?.('Disclaimer')} 
              className="hover:text-white transition-colors cursor-pointer py-1.5 min-h-[36px] flex items-center"
            >
              {t('footer.disclaimer', 'Disclaimer')}
            </button>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

// Final submission update
