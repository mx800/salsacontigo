import { useEffect, useState } from 'react';
import { 
  ChevronDown, Phone, Mail, Facebook, MapPin, Calendar, Users, 
  Music, Instagram, Send, X, ChevronLeft, ChevronRight, Maximize2 
} from 'lucide-react';
import { useIsMobile } from './hooks/use-mobile';
import './App.css';
import schedules from './data/schedules.json';
import featuredEvents from './data/featuredEvents.json';

// --- CONFIGURATION GALERIE DYNAMIQUE ---
// Récupère toutes les images situées dans src/assets/gallery
const galleryImports = import.meta.glob('./assets/gallery/*.{png,jpg,jpeg,webp}', { 
  eager: true, 
  as: 'url' 
});
const galleryImages = Object.values(galleryImports);

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [showMentionsLegales, setShowMentionsLegales] = useState(false);
  const [showPolitiqueConfidentialite, setShowPolitiqueConfidentialite] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const baseUrl = (import.meta.env.BASE_URL) || '/';

  // --- STATE LIGHTBOX (GALERIE) ---
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Vérification s'il y a des événements à afficher
  const hasEvents = featuredEvents && featuredEvents.length > 0;

  // Parallax and scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsNavFixed(window.scrollY > 100);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Fade-in animation on scroll
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Re-parse Facebook plugin
  useEffect(() => {
    const tryParseFb = () => {
      // @ts-ignore
      if (window.FB) {
        // @ts-ignore
        window.FB.XFBML.parse();
      } else {
        setTimeout(tryParseFb, 500);
      }
    };
    tryParseFb();
  }, []);

  useEffect(() => {
    const tryParseFb = () => {
      const w = window as any;
      if (w.FB && typeof w.FB.XFBML?.parse === 'function') {
        w.FB.XFBML.parse();
      } else {
        setTimeout(tryParseFb, 500);
      }
    };
    tryParseFb();
  }, [isMobile]);

  // --- LOGIQUE LIGHTBOX ---
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden'; // Bloque le scroll
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'unset'; // Réactive le scroll
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => 
      prev === null ? null : (prev + 1) % galleryImages.length
    );
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => 
      prev === null ? null : (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  // Gestion Clavier Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${isNavFixed || isMobile ? 'nav-fixed' : ''}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img src={`${baseUrl}images/logo.png`} alt="Salsa Contigo" className="h-16 md:h-20" />

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 text-sm font-medium">
              <button onClick={() => scrollToSection('accueil')} className="hover:text-primary transition">Accueil</button>
              <button onClick={() => scrollToSection('biographie')} className="hover:text-primary transition">Biographie</button>
              
              {hasEvents && (
                <button onClick={() => scrollToSection('evenements')} className="hover:text-primary transition">Événements</button>
              )}

              <button onClick={() => scrollToSection('cours')} className="hover:text-primary transition">Cours</button>
              <button onClick={() => scrollToSection('inscriptions')} className="hover:text-primary transition">Inscriptions</button>
              <button onClick={() => scrollToSection('professeurs')} className="hover:text-primary transition">Professeurs</button>
              <button onClick={() => scrollToSection('multimedia')} className="hover:text-primary transition">Multimédia</button>
              <button onClick={() => scrollToSection('social')} className="hover:text-primary transition">Réseaux</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition">Contact</button>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-primary transition p-2"
              aria-label="Menu"
            >
              <div className="w-6 h-6 relative">
                <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`}></span>
                <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'} translate-y-0`}></span>
                <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-primary/20">
              <div className="container mx-auto px-6 py-4">
                <nav className="flex flex-col space-y-4 text-sm font-medium">
                  <button onClick={() => { scrollToSection('accueil'); setIsMobileMenuOpen(false); }} className="text-left hover:text-primary transition py-2">Accueil</button>
                  <button onClick={() => { scrollToSection('biographie'); setIsMobileMenuOpen(false); }} className="text-left hover:text-primary transition py-2">Biographie</button>
                  
                  {hasEvents && (
                    <button onClick={() => { scrollToSection('evenements'); setIsMobileMenuOpen(false); }} className="text-left hover:text-primary transition py-2">Événements</button>
                  )}

                  <button onClick={() => { scrollToSection('cours'); setIsMobileMenuOpen(false); }} className="text-left hover:text-primary transition py-2">Cours</button>
                  <button onClick={() => { scrollToSection('inscriptions'); setIsMobileMenuOpen(false); }} className="text-left hover:text-primary transition py-2">Inscriptions</button>
                  <button onClick={() => { scrollToSection('professeurs'); setIsMobileMenuOpen(false); }} className="text-left hover:text-primary transition py-2">Professeurs</button>
                  <button onClick={() => { scrollToSection('multimedia'); setIsMobileMenuOpen(false); }} className="text-left hover:text-primary transition py-2">Multimédia</button>
                  <button onClick={() => { scrollToSection('social'); setIsMobileMenuOpen(false); }} className="text-left hover:text-primary transition py-2">Réseaux</button>
                  <button onClick={() => { scrollToSection('contact'); setIsMobileMenuOpen(false); }} className="text-left hover:text-primary transition py-2">Contact</button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Section 1: Hero with Parallax */}
      <section id="accueil" className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 parallax-layer"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5 - scrollY * 0.3}px) scale(1.1)`,
          }}
        >
          <img 
            src={`${baseUrl}images/background.png`} 
            alt="Dancing Couple" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <img 
            src={`${baseUrl}images/logo.png`} 
            alt="Salsa Contigo" 
            className="mb-8 animate-fade-in"
            style={{ animationDelay: '0.2s', animationFillMode: 'both', width: '600px', maxWidth: '90vw', height: 'auto' }}
          />
          <p 
            className="font-script text-2xl md:text-4xl text-white/90 mb-12 animate-fade-in"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            Passión, Dinámica, Elegancia
          </p>
          <ChevronDown 
            className="text-primary animate-float cursor-pointer" 
            size={40}
            onClick={() => scrollToSection('biographie')}
          />
        </div>
      </section>

      {/* Section 2: Biographie */}
      <section id="biographie" className="py-20 bg-gradient-to-b from-black to-secondary">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-12 gradient-text fade-in">Notre Histoire</h2>
          <div className="space-y-6 text-lg leading-relaxed text-gray-300 fade-in">
            <p>
              <strong className="text-primary">Salsa Contigo</strong> est née d'une passion ardente pour la danse latine et le désir de partager cette énergie contagieuse avec notre communauté. Fondée par des passionnés de salsa, notre école est devenue un lieu de rencontre privilégié pour tous ceux qui souhaitent découvrir ou perfectionner leur art de la danse.
            </p>
            <p>
              Notre philosophie repose sur trois piliers : la <strong className="text-primary">Passión</strong> qui anime chaque mouvement, la <strong className="text-primary">Dinámica</strong> qui rythme nos cours, et l'<strong className="text-primary">Elegancia</strong> qui caractérise notre approche pédagogique. Nous croyons que la danse est bien plus qu'une série de pas - c'est une expression de soi, une connexion avec les autres et une célébration de la vie.
            </p>
            <p>
              Avec des cours à <strong>Jonquière</strong>, <strong>Alma</strong>, <strong>Saint-Jean-Eudes</strong> et <strong>Rivière-du-Loup</strong>, nous rendons la danse latine accessible au Saguenay, des débutants aux danseurs avancés.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Événements vedettes */}
      {hasEvents && (
        <section id="evenements" className="py-20 bg-black">
          <div className="container mx-auto px-6">
            <h2 className="font-script text-5xl md:text-6xl text-center mb-16 gradient-text fade-in">Événements Vedettes</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {featuredEvents.map((event, idx) => {
                const iconMap = { Calendar, Users, MapPin, Facebook };
                // @ts-ignore
                const MainIcon = iconMap[event.icon];

                return (
                  <div key={idx} className="bg-gradient-to-br from-secondary to-black p-8 rounded-lg border border-primary/20 hover:border-primary/50 transition-all duration-300 glow-red fade-in">
                    <div className="flex items-center gap-3 mb-4">
                      {MainIcon && <MainIcon className="text-primary" size={24} />}
                      <h3 className="font-script text-3xl text-primary">{event.title}</h3>
                    </div>
                    <p className="text-gray-300 mb-4">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-400">
                      {event.details.map((detail, detailIdx) => {
                        // @ts-ignore
                        const DetailIcon = iconMap[detail.icon];
                        const iconSize = 16;
                        return (
                          <div key={detailIdx} className="flex items-center gap-2">
                            {DetailIcon && <DetailIcon size={iconSize} className="text-primary" />}
                            <span>{detail.content}</span>
                          </div>
                        )
                      })}
                    </div>

                    {event.buttonText && event.buttonLink && (
                      <a 
                        href={event.buttonLink}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-6 bg-primary hover:bg-primary-light px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        {event.buttonText}
                      </a>
                    )}
                    {event.buttonText && !event.buttonLink && (
                      <button className="mt-6 bg-primary hover:bg-primary-light px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                        {event.buttonText}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Cours et Formations */}
      <section id="cours" className="py-20 bg-gradient-to-b from-black to-secondary">
        <div className="container mx-auto px-6">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-8 gradient-text fade-in">Cours & Formations</h2>

          <div className="max-w-3xl mx-auto mb-12 bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg border border-primary/30 fade-in">
            <p className="text-gray-300 leading-relaxed text-center">
              Nos cours sont accessibles aussi bien aux couples passionnés qu'aux personnes seules cherchant à explorer la danse latine. C'est une excellente façon de socialiser et de créer de nouveaux liens tout en s'amusant aux rythmes endiablés !
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <div className="bg-black/50 p-6 rounded-lg border border-primary/20 glow-red fade-in">
              <h3 className="font-script text-2xl text-primary mb-4">Styles de Danse</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2"><Music size={16} className="text-primary" /> Salsa</li>
                <li className="flex items-center gap-2"><Music size={16} className="text-primary" /> Merengue</li>
                <li className="flex items-center gap-2"><Music size={16} className="text-primary" /> Cumbia</li>
                <li className="flex items-center gap-2"><Music size={16} className="text-primary" /> Bachata</li>
                <li className="flex items-center gap-2"><Music size={16} className="text-primary" /> Cha-Cha</li>
                <li className="flex items-center gap-2"><Music size={16} className="text-primary" /> Rueda</li>
              </ul>
            </div>

            <div className="bg-black/50 p-6 rounded-lg border border-primary/20 glow-red fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-script text-2xl text-primary mb-4">Niveaux</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2"><ChevronDown size={16} className="text-primary" /> Débutant</li>
                <li className="flex items-center gap-2"><ChevronDown size={16} className="text-primary" /> Intermédiaire</li>
                <li className="flex items-center gap-2"><ChevronDown size={16} className="text-primary" /> Avancé</li>
              </ul>
            </div>

            <div className="bg-black/50 p-6 rounded-lg border border-primary/20 glow-red fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-script text-2xl text-primary mb-4">Formats</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2"><Users size={16} className="text-primary" /> Cours privés</li>
                <li className="flex items-center gap-2"><Users size={16} className="text-primary" /> Semi-privés</li>
                <li className="flex items-center gap-2"><Users size={16} className="text-primary" /> Petits groupes</li>
                <li className="flex items-center gap-2"><Users size={16} className="text-primary" /> Cours à la carte</li>
                <li className="flex items-center gap-2"><Users size={16} className="text-primary" /> Bébé-Maman-Salsa</li>
              </ul>
            </div>
          </div>

          <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg border border-primary/30 fade-in">
            <h3 className="font-script text-3xl text-primary mb-4">Cours Bébé-Maman-Salsa</h3>
            <p className="text-gray-300 leading-relaxed">
              Un programme unique conçu pour les nouvelles mamans ! Dansez avec votre bébé en porte-bébé dans une ambiance douce et sans sauts. Parfait pour rester active tout en créant des liens spéciaux avec votre enfant.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Inscriptions & Sessions */}
      <section id="inscriptions" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-16 gradient-text fade-in">Inscriptions & Sessions</h2>
          
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-lg border border-primary/30 fade-in">
              <h3 className="font-script text-3xl text-primary mb-4">Tarifs</h3>
              <div className="grid md:grid-cols-2 gap-6 text-gray-300">
                <div>
                  <p className="text-2xl font-bold text-white mb-2">110$<span className="text-lg font-normal text-gray-400"> par cours</span></p>
                  <p className="text-sm">Session de 6 semaines</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary mb-2">15% de rabais</p>
                  <p className="text-sm">Sur le deuxième cours</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-primary/20">
                <h4 className="font-semibold mb-2">Modes de paiement</h4>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>• Virement Interac</li>
                  <li>• Paiement sur place</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6 fade-in"> 
              <h3 className="font-script text-3xl text-primary text-center mb-8">Horaires par ville</h3>
              {schedules.map((location, idx) => (
                <div key={idx} className="bg-secondary p-6 rounded-lg border border-primary/20">
                  <h4 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                    <MapPin size={20} />
                    {location.city}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {location.days.map((schedule, i) => (
                      <div key={i} className="bg-black/30 p-4 rounded">
                        <p className="font-semibold text-white">{schedule.day}</p>
                        <p className="text-primary text-sm">{schedule.course}</p>
                        <p className="text-gray-400 text-xs mt-1">{schedule.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center fade-in">
              <button 
                onClick={() => scrollToSection('contact')}
                className="bg-primary hover:bg-primary-light px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 glow-red"
              >
                S'inscrire maintenant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Professeurs */}
      <section id="professeurs" className="py-20 bg-gradient-to-b from-black to-secondary">
        <div className="container mx-auto px-6">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-16 gradient-text fade-in">Nos Professeurs</h2>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Carlos Rodriguez', specialty: 'Salsa & Rueda' },
              { name: 'Maria Sanchez', specialty: 'Bachata & Cha-Cha' },
              { name: 'Diego Martinez', specialty: 'Merengue & Cumbia' },
              { name: 'Isabella Torres', specialty: 'Salsa Avancée' },
            ].map((instructor, idx) => (
              <div key={idx} className="bg-black/50 rounded-lg overflow-hidden border border-primary/20 hover:border-primary/50 transition-all duration-300 fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                  <Users size={64} className="text-primary/40" />
                </div>
                <div className="p-6">
                  <h3 className="font-script text-2xl text-primary mb-2">{instructor.name}</h3>
                  <p className="text-gray-400 text-sm">{instructor.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Multimédias */}
      <section id="multimedia" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-16 gradient-text fade-in">Galerie Multimédia</h2>
          <div className="max-w-full mx-auto">
            {galleryImages.length > 0 ? (
              <div className="overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-6" style={{ width: 'max-content' }}>
                  {galleryImages.map((imgSrc, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => openLightbox(idx)}
                      className="relative flex-shrink-0 w-80 h-60 rounded-lg overflow-hidden border border-primary/20 hover:border-primary/50 transition-all duration-300 group fade-in cursor-pointer"
                    >
                      <img 
                        src={imgSrc} 
                        alt={`Salsa Contigo Galerie ${idx}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      {/* Overlay au survol avec Icône Rouge (text-primary) */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="p-3 border-2 border-primary rounded-full text-primary hover:bg-primary/20 transition-all transform hover:scale-110">
                          <Maximize2 size={28} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-8 border border-dashed border-gray-700 rounded-lg">
                <Music size={48} className="text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">Ajoutez des photos dans src/assets/gallery pour les voir ici.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 8: Musique & Réseaux */}
      <section id="social" className="py-20 bg-gradient-to-b from-black to-secondary">
        <div className="container mx-auto px-6">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-16 gradient-text fade-in">Musique & Réseaux</h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-secondary to-black p-8 rounded-lg border border-primary/20 glow-red fade-in transition-transform hover:scale-[1.01]">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Music size={32} className="text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="font-script text-3xl text-primary">Notre Musique</h3>
                  <p className="text-gray-400 text-sm">L'ambiance Salsa Contigo</p>
                </div>
              </div>
              <div className="w-full overflow-hidden rounded-lg shadow-lg bg-black/50">
                <iframe
                  className="w-full border-0"
                  style={{ borderRadius: '12px' }}
                  src="https://open.spotify.com/embed/playlist/0x5sdZSd4GbYmAucCshEsO?utm_source=generator&theme=0"
                  height="352"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary to-black p-8 rounded-lg border border-primary/20 glow-red fade-in">
              <div className="flex items-center gap-4 mb-6">
                <Facebook size={32} className="text-primary" />
                <h3 className="font-script text-3xl text-primary">Notre page Facebook</h3>
              </div>

              <div className="w-full flex justify-center overflow-hidden"> 
                <div
                  key={isMobile ? "fb-mobile" : "fb-desktop"} 
                  className="fb-page"
                  data-href="https://www.facebook.com/salsacontigo.ca/"
                  data-tabs="timeline"
                  data-width={isMobile ? "330" : "500"} 
                  data-height="352"
                  data-small-header="true"
                  data-adapt-container-width="true"
                  data-hide-cover="true"
                  data-show-facepile="false"
                >
                  <blockquote cite="https://www.facebook.com/salsacontigo.ca/" className="fb-xfbml-parse-ignore">
                    <a href="https://www.facebook.com/salsacontigo.ca/">Salsa Contigo</a>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: Contact */}
      <section id="contact" className="py-20 bg-gradient-to-b from-black to-secondary">
        <div className="container mx-auto px-6">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-16 gradient-text">Contactez-nous</h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-6 fade-in">
              <h3 className="font-script text-3xl text-primary mb-6">Informations</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-gray-300">
                  <Phone className="text-primary" size={24} />
                  <div>
                    <p className="font-semibold text-white">Téléphone</p>
                    <a href="tel:4185123484" className="hover:text-primary transition">418 512-3484</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-300">
                  <Mail className="text-primary" size={24} />
                  <div>
                    <p className="font-semibold text-white">Courriel</p>
                    <a href="mailto:info@salsacontigo.ca" className="hover:text-primary transition">info@salsacontigo.ca</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-300">
                  <Facebook className="text-primary" size={24} />
                  <div>
                    <p className="font-semibold text-white">Facebook</p>
                    <a href="https://www.facebook.com/pages/Salsa-Contigo/146855305346623" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition text-sm">
                      Salsa Contigo
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-gray-300 pt-4">
                  <MapPin className="text-primary flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-white mb-2">Nos salles de cours</p>
                    <ul className="space-y-1 text-sm">
                      <li>Jonquière, QC</li>
                      <li>Alma, QC</li>
                      <li>Saint-Jean-Eudes, QC</li>
                      <li>Rivière-du-Loup, QC</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/50 p-8 rounded-lg border border-primary/20 glow-red fade-in">
              <h3 className="font-script text-3xl text-primary mb-6">Envoyez-nous un message</h3>
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Formulaire soumis ! (Backend en cours de développement)'); }}>
                <div>
                  <input 
                    type="text" 
                    placeholder="Nom complet"
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-primary/30 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <input 
                    type="email" 
                    placeholder="Adresse courriel"
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-primary/30 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <input 
                    type="tel" 
                    placeholder="Téléphone"
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-primary/30 focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <textarea 
                    placeholder="Votre message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-primary/30 focus:border-primary focus:outline-none resize-none"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-light px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 glow-red"
                >
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Section 11: Footer */}
      <footer className="bg-black border-t border-primary/20 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-6">
            <img src={`${baseUrl}images/logo.png`} alt="Salsa Contigo" className="h-16 mx-auto opacity-80" />
            
            <div className="flex justify-center gap-6">
              <a href="https://www.facebook.com/pages/Salsa-Contigo/146855305346623" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition">
                <Facebook size={24} />
              </a>
              <a href="mailto:info@salsacontigo.ca" className="text-gray-400 hover:text-primary transition">
                <Mail size={24} />
              </a>
            </div>
            
            <p className="text-gray-500 text-sm">
              Tous droits réservés © 2025, Salsa Contigo
            </p>
            
            <div className="flex justify-center gap-6 text-xs text-gray-600">
              <button onClick={() => setShowMentionsLegales(true)} className="hover:text-primary transition">Mentions légales</button>
              <button onClick={() => setShowPolitiqueConfidentialite(true)} className="hover:text-primary transition">Politique de confidentialité</button>
            </div>
          </div>
        </div>
      </footer>

      {/* --- COMPOSANT LIGHTBOX FULLSCREEN --- */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Bouton Fermer */}
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-primary transition p-2 z-50"
          >
            <X size={40} />
          </button>

          {/* Bouton Précédent */}
          <button 
            onClick={prevImage}
            className="absolute left-2 md:left-8 text-white/70 hover:text-primary transition p-2 z-50 bg-black/20 hover:bg-black/50 rounded-full"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Image Centrale */}
          <div 
            className="relative max-w-[95vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={galleryImages[lightboxIndex]} 
              alt="Fullscreen view" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-primary/20"
            />
            <p className="text-center text-gray-400 mt-4 font-script text-xl">
              {lightboxIndex + 1} / {galleryImages.length}
            </p>
          </div>

          {/* Bouton Suivant */}
          <button 
            onClick={nextImage}
            className="absolute right-2 md:right-8 text-white/70 hover:text-primary transition p-2 z-50 bg-black/20 hover:bg-black/50 rounded-full"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}

      {/* Modal Mentions Légales */}
      {showMentionsLegales && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6 overflow-y-auto">
          <div className="bg-secondary rounded-lg p-8 max-w-2xl w-full my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-script text-3xl text-primary">Mentions Légales</h2>
              <button 
                onClick={() => setShowMentionsLegales(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6 text-gray-300 max-h-96 overflow-y-auto">
              <section>
                <h3 className="text-xl font-semibold text-primary mb-3">1. Informations de l'entreprise</h3>
                <p><strong>Nom :</strong> Salsa Contigo</p>
                <p><strong>Téléphone :</strong> 418 512-3484</p>
                <p><strong>Email :</strong> info@salsacontigo.ca</p>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-primary mb-3">2. Propriétaire du site</h3>
                <p>Ce site web est la propriété et est géré par Ivan Salazar. Tous les droits réservés © 2025.</p>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-primary mb-3">3. Conditions d'utilisation</h3>
                <p>L'accès et l'utilisation de ce site web sont soumis à ces conditions d'utilisation. En accédant au site, vous acceptez d'être lié par ces conditions.</p>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-primary mb-3">4. Propriété intellectuelle</h3>
                <p>Tout contenu, images, textes et logos présents sur ce site sont la propriété exclusive de Salsa Contigo ou de ses fournisseurs de contenu et sont protégés par les lois sur la propriété intellectuelle.</p>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-primary mb-3">5. Limitation de responsabilité</h3>
                <p>Salsa Contigo n'est pas responsable des dommages directs, indirects, accidentels ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser ce site ou ses services.</p>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-primary mb-3">6. Crédits</h3>
                <p><strong>Développement :</strong> Maxime Savard, Développeur Indépendant</p>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-primary mb-3">7. Contact pour questions légales</h3>
                <p>Pour toute question concernant ces mentions légales, veuillez nous contacter à :</p>
                <p><strong>Email :</strong> info@salsacontigo.ca</p>
                <p><strong>Téléphone :</strong> 418 512-3484</p>
              </section>
            </div>

            <button 
              onClick={() => setShowMentionsLegales(false)}
              className="mt-6 w-full bg-primary hover:bg-primary-light px-6 py-3 rounded-full font-semibold transition-all duration-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal Politique de Confidentialité */}
      {showPolitiqueConfidentialite && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6 overflow-y-auto">
          <div className="bg-secondary rounded-lg p-8 max-w-2xl w-full my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-script text-3xl text-primary">Politique de Confidentialité</h2>
              <button 
                onClick={() => setShowPolitiqueConfidentialite(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6 text-gray-300 max-h-96 overflow-y-auto">
              <section>
                <h3 className="text-xl font-semibold text-primary mb-3">🛡️ Engagement envers votre vie privée</h3>
                <p>Chez Salsa Contigo, nous respectons votre vie privée. Nous nous engageons à protéger vos données personnelles et à être transparent sur notre utilisation.</p>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-primary mb-3">📊 Données collectées</h3>
                <p>Lorsque vous nous contactez via le formulaire de contact, nous collectons temporairement :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Votre nom</li>
                  <li>Votre adresse email</li>
                  <li>Votre numéro de téléphone</li>
                  <li>Votre message</li>
                </ul>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-primary mb-3">🔒 Aucun stockage des données</h3>
                <p className="font-semibold text-primary">✓ Salsa Contigo NE conserve PAS vos données personnelles.</p>
                <p className="mt-2">Les informations du formulaire de contact sont utilisées uniquement pour vous répondre et ne sont jamais stockées dans nos bases de données. Elles sont supprimées après traitement.</p>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-primary mb-3">🍪 Pas de cookies</h3>
                <p className="font-semibold text-primary">✓ Ce site n'utilise AUCUN cookie.</p>
                <p className="mt-2">Nous ne suivons pas votre activité, ne placez pas de traceurs, et ne collectons aucune information de navigation. Votre expérience sur notre site est complètement anonyme.</p>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-primary mb-3">🔐 Sécurité</h3>
                <p>Bien que nous ne conservions pas vos données, nous prenons les mesures de sécurité appropriées lors de la transmission de vos informations de contact.</p>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-primary mb-3">📬 Contact</h3>
                <p>Pour toute question concernant cette politique de confidentialité :</p>
                <p className="mt-2"><strong>Email :</strong> info@salsacontigo.ca</p>
                <p><strong>Téléphone :</strong> 418 512-3484</p>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-primary mb-3">📝 Modifications</h3>
                <p>Cette politique peut être mise à jour à tout moment. La dernière modification date de novembre 2025.</p>
              </section>
            </div>

            <button 
              onClick={() => setShowPolitiqueConfidentialite(false)}
              className="mt-6 w-full bg-primary hover:bg-primary-light px-6 py-3 rounded-full font-semibold transition-all duration-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;