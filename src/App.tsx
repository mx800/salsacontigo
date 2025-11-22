import { useEffect, useState, useRef } from 'react';
import { 
  ChevronDown, Phone, Mail, Facebook, MapPin, Calendar, Users, 
  Music, Instagram, Send, X, ChevronLeft, ChevronRight, Maximize2 
} from 'lucide-react';
import { useIsMobile } from './hooks/use-mobile';
import './App.css';
import schedules from './data/schedules.json';
import featuredEvents from './data/featuredEvents.json';

// --- CONFIGURATION GALERIE DYNAMIQUE ---
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

  // --- STATE LIGHTBOX (GALERIE FULLSCREEN) ---
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // États pour le swipe dans le Lightbox (Fullscreen)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // --- STATE CAROUSSEL MINI (AUTO-SCROLL) ---
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

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

  // Fade-in animation
  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, observerOptions);
    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Facebook plugin
  useEffect(() => {
    const tryParseFb = () => {
      // @ts-ignore
      if (window.FB) { /* @ts-ignore */ window.FB.XFBML.parse(); } 
      else { setTimeout(tryParseFb, 500); }
    };
    tryParseFb();
  }, [isMobile]);

  // --- LOGIQUE LIGHTBOX (FULLSCREEN) ---
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'unset';
  };
  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => prev === null ? null : (prev + 1) % galleryImages.length);
  };
  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => prev === null ? null : (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Swipe Logic Lightbox (Fullscreen)
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) nextImage();
    if (distance < -minSwipeDistance) prevImage();
  };

  // Clavier Lightbox
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

  // --- LOGIQUE CAROUSSEL MINI (JS ANIMATION) ---
  // Permet l'auto-scroll ET le scroll manuel tactile
  useEffect(() => {
    const scrollContainer = carouselRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;

    const scroll = () => {
      // Si l'utilisateur ne touche pas le carrousel, on défile automatiquement
      if (!isCarouselPaused) {
        // Vitesse du défilement (0.5 pour lent, 1 pour normal)
        scrollContainer.scrollLeft += 0.5;

        // Logique de boucle infinie : si on arrive à la moitié (fin du set original), on remet au début
        // On utilise scrollWidth / 2 car on a doublé les images
        if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth / 2)) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCarouselPaused]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  // Doublement des images pour l'effet infini
  const displayImages = [...galleryImages, ...galleryImages];

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Styles utilitaires */}
      <style>{`
        /* Masque les scrollbars tout en permettant le scroll */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* Effet vignette sur les côtés */
        .carousel-mask {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${isNavFixed || isMobile ? 'nav-fixed' : ''}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img src={`${baseUrl}images/logo.png`} alt="Salsa Contigo" className="h-16 md:h-20" />

            <div className="hidden md:flex space-x-6 text-sm font-medium">
              <button onClick={() => scrollToSection('accueil')} className="hover:text-primary transition">Accueil</button>
              <button onClick={() => scrollToSection('biographie')} className="hover:text-primary transition">Biographie</button>
              {hasEvents && <button onClick={() => scrollToSection('evenements')} className="hover:text-primary transition">Événements</button>}
              <button onClick={() => scrollToSection('cours')} className="hover:text-primary transition">Cours</button>
              <button onClick={() => scrollToSection('inscriptions')} className="hover:text-primary transition">Inscriptions</button>
              <button onClick={() => scrollToSection('professeurs')} className="hover:text-primary transition">Professeurs</button>
              <button onClick={() => scrollToSection('multimedia')} className="hover:text-primary transition">Multimédia</button>
              <button onClick={() => scrollToSection('social')} className="hover:text-primary transition">Réseaux</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition">Contact</button>
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white hover:text-primary transition p-2">
              <div className="w-6 h-6 relative">
                <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`}></span>
                <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'} translate-y-0`}></span>
                <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`}></span>
              </div>
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-primary/20">
              <div className="container mx-auto px-6 py-4">
                <nav className="flex flex-col space-y-4 text-sm font-medium">
                  <button onClick={() => { scrollToSection('accueil'); setIsMobileMenuOpen(false); }} className="text-left hover:text-primary transition py-2">Accueil</button>
                  <button onClick={() => { scrollToSection('biographie'); setIsMobileMenuOpen(false); }} className="text-left hover:text-primary transition py-2">Biographie</button>
                  {hasEvents && <button onClick={() => { scrollToSection('evenements'); setIsMobileMenuOpen(false); }} className="text-left hover:text-primary transition py-2">Événements</button>}
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

      {/* Section 1: Hero */}
      <section id="accueil" className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 parallax-layer" style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5 - scrollY * 0.3}px) scale(1.1)` }}>
          <img src={`${baseUrl}images/background.png`} alt="Dancing Couple" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <img src={`${baseUrl}images/logo.png`} alt="Salsa Contigo" className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both', width: '600px', maxWidth: '90vw', height: 'auto' }} />
          <p className="font-script text-2xl md:text-4xl text-white/90 mb-12 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>Passión, Dinámica, Elegancia</p>
          <ChevronDown className="text-primary animate-float cursor-pointer" size={40} onClick={() => scrollToSection('biographie')} />
        </div>
      </section>

      {/* Section 2: Biographie */}
      <section id="biographie" className="py-20 bg-gradient-to-b from-black to-secondary">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-12 gradient-text fade-in">Notre Histoire</h2>
          <div className="space-y-6 text-lg leading-relaxed text-gray-300 fade-in">
            <p><strong className="text-primary">Salsa Contigo</strong> est née d'une passion ardente pour la danse latine...</p>
            <p>Notre philosophie repose sur trois piliers : la <strong className="text-primary">Passión</strong>...</p>
            <p>Avec des cours à <strong>Jonquière</strong>, <strong>Alma</strong>, <strong>Saint-Jean-Eudes</strong> et <strong>Rivière-du-Loup</strong>...</p>
          </div>
        </div>
      </section>

      {/* Section 3: Événements */}
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
                    <p className="text-gray-300 mb-4">{event.description}</p>
                    <div className="space-y-2 text-sm text-gray-400">
                      {event.details.map((detail, detailIdx) => {
                        // @ts-ignore
                        const DetailIcon = iconMap[detail.icon];
                        return (
                          <div key={detailIdx} className="flex items-center gap-2">
                            {DetailIcon && <DetailIcon size={16} className="text-primary" />}
                            <span>{detail.content}</span>
                          </div>
                        )
                      })}
                    </div>
                    {event.buttonText && (
                      <a href={event.buttonLink || '#'} className="inline-block mt-6 bg-primary hover:bg-primary-light px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                        {event.buttonText}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Cours */}
      <section id="cours" className="py-20 bg-gradient-to-b from-black to-secondary">
        <div className="container mx-auto px-6">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-8 gradient-text fade-in">Cours & Formations</h2>
          <div className="max-w-3xl mx-auto mb-12 bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg border border-primary/30 fade-in">
            <p className="text-gray-300 leading-relaxed text-center">Nos cours sont accessibles aussi bien aux couples passionnés qu'aux personnes seules...</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <div className="bg-black/50 p-6 rounded-lg border border-primary/20 glow-red fade-in">
              <h3 className="font-script text-2xl text-primary mb-4">Styles de Danse</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2"><Music size={16} className="text-primary" /> Salsa</li>
                <li className="flex items-center gap-2"><Music size={16} className="text-primary" /> Bachata</li>
                <li className="flex items-center gap-2"><Music size={16} className="text-primary" /> Merengue</li>
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
                <li className="flex items-center gap-2"><Users size={16} className="text-primary" /> Petits groupes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Inscriptions */}
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
            </div>
            <div className="space-y-6 fade-in"> 
              <h3 className="font-script text-3xl text-primary text-center mb-8">Horaires par ville</h3>
              {schedules.map((location, idx) => (
                <div key={idx} className="bg-secondary p-6 rounded-lg border border-primary/20">
                  <h4 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2"><MapPin size={20} />{location.city}</h4>
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
              <div key={idx} className="bg-black/50 rounded-lg overflow-hidden border border-primary/20 hover:border-primary/50 transition-all duration-300 fade-in">
                <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center"><Users size={64} className="text-primary/40" /></div>
                <div className="p-6"><h3 className="font-script text-2xl text-primary mb-2">{instructor.name}</h3><p className="text-gray-400 text-sm">{instructor.specialty}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Multimédias - CAROUSSEL AVEC CONTRAINTES DE LARGEUR ET SWIPE MINI */}
      <section id="multimedia" className="py-20 bg-black">
        {/* Changement ici : on utilise "container mx-auto px-6" au lieu de container-fluid */}
        <div className="container mx-auto px-6">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-16 gradient-text fade-in">Galerie Multimédia</h2>
          
          {/* Conteneur du carrousel : Limite la largeur (max-w-full) et masque le débordement */}
          <div className="relative w-full max-w-full overflow-hidden rounded-lg border border-primary/10 carousel-mask">
            
            {galleryImages.length > 0 ? (
              <div 
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto no-scrollbar"
                /* Événements pour le swipe manuel sur mobile */
                onTouchStart={() => setIsCarouselPaused(true)}
                onTouchEnd={() => setIsCarouselPaused(false)}
                onMouseEnter={() => setIsCarouselPaused(true)} // Pause souris aussi
                onMouseLeave={() => setIsCarouselPaused(false)}
                style={{ whiteSpace: 'nowrap' }}
              >
                {displayImages.map((imgSrc, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => openLightbox(idx % galleryImages.length)}
                    className="relative flex-shrink-0 w-80 h-60 rounded-lg overflow-hidden border border-primary/20 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                  >
                    <img 
                      src={imgSrc} 
                      alt={`Salsa Contigo Galerie`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      draggable="false" // Empêche le drag natif de l'image pour permettre le scroll
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-3 border-2 border-primary rounded-full text-primary hover:bg-primary/20 transition-all transform hover:scale-110">
                        <Maximize2 size={28} />
                      </div>
                    </div>
                  </div>
                ))}
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
            <div className="bg-gradient-to-br from-secondary to-black p-8 rounded-lg border border-primary/20 glow-red fade-in">
              <div className="flex items-center gap-4 mb-6"><div className="p-3 bg-primary/10 rounded-full"><Music size={32} className="text-primary animate-pulse" /></div><div><h3 className="font-script text-3xl text-primary">Notre Musique</h3></div></div>
              <div className="w-full overflow-hidden rounded-lg shadow-lg bg-black/50">
                <iframe className="w-full border-0" style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/playlist/0x5sdZSd4GbYmAucCshEsO?utm_source=generator&theme=0" height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
              </div>
            </div>
            <div className="bg-gradient-to-br from-secondary to-black p-8 rounded-lg border border-primary/20 glow-red fade-in">
              <div className="flex items-center gap-4 mb-6"><Facebook size={32} className="text-primary" /><h3 className="font-script text-3xl text-primary">Notre page Facebook</h3></div>
              <div className="w-full flex justify-center overflow-hidden"> 
                <div key={isMobile ? "fb-mobile" : "fb-desktop"} className="fb-page" data-href="https://www.facebook.com/salsacontigo.ca/" data-tabs="timeline" data-width={isMobile ? "330" : "500"} data-height="352" data-small-header="true" data-adapt-container-width="true" data-hide-cover="true" data-show-facepile="false">
                  <blockquote cite="https://www.facebook.com/salsacontigo.ca/" className="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/salsacontigo.ca/">Salsa Contigo</a></blockquote>
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
                <div className="flex items-center gap-4 text-gray-300"><Phone className="text-primary" size={24} /><div><p className="font-semibold text-white">Téléphone</p><a href="tel:4185123484" className="hover:text-primary transition">418 512-3484</a></div></div>
                <div className="flex items-center gap-4 text-gray-300"><Mail className="text-primary" size={24} /><div><p className="font-semibold text-white">Courriel</p><a href="mailto:info@salsacontigo.ca" className="hover:text-primary transition">info@salsacontigo.ca</a></div></div>
                <div className="flex items-start gap-4 text-gray-300 pt-4"><MapPin className="text-primary flex-shrink-0" size={24} /><div><p className="font-semibold text-white mb-2">Nos salles de cours</p><ul className="space-y-1 text-sm"><li>Jonquière, QC</li><li>Alma, QC</li></ul></div></div>
              </div>
            </div>
            <div className="bg-black/50 p-8 rounded-lg border border-primary/20 glow-red fade-in">
              <h3 className="font-script text-3xl text-primary mb-6">Envoyez-nous un message</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message envoyé !'); }}>
                <div><input type="text" placeholder="Nom complet" className="w-full px-4 py-3 rounded-lg bg-secondary border border-primary/30 focus:border-primary focus:outline-none" required /></div>
                <div><input type="email" placeholder="Adresse courriel" className="w-full px-4 py-3 rounded-lg bg-secondary border border-primary/30 focus:border-primary focus:outline-none" required /></div>
                <div><textarea placeholder="Votre message" rows={5} className="w-full px-4 py-3 rounded-lg bg-secondary border border-primary/30 focus:border-primary focus:outline-none resize-none" required></textarea></div>
                <button type="submit" className="w-full bg-primary hover:bg-primary-light px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 glow-red">Envoyer</button>
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
              <a href="https://www.facebook.com/pages/Salsa-Contigo/146855305346623" target="_blank" className="text-gray-400 hover:text-primary"><Facebook size={24} /></a>
              <a href="mailto:info@salsacontigo.ca" className="text-gray-400 hover:text-primary"><Mail size={24} /></a>
            </div>
            <div className="flex justify-center gap-6 text-xs text-gray-600">
              <button onClick={() => setShowMentionsLegales(true)} className="hover:text-primary">Mentions légales</button>
              <button onClick={() => setShowPolitiqueConfidentialite(true)} className="hover:text-primary">Politique de confidentialité</button>
            </div>
          </div>
        </div>
      </footer>

      {/* --- LIGHTBOX FULLSCREEN --- */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/70 hover:text-primary p-2 z-50"><X size={40} /></button>
          <button onClick={(e) => { e.stopPropagation(); prevImage(e); }} className="hidden md:block absolute left-2 md:left-8 text-white/70 hover:text-primary p-2 z-50 bg-black/20 hover:bg-black/50 rounded-full"><ChevronLeft size={40} /></button>
          <div className="relative max-w-[95vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img src={galleryImages[lightboxIndex]} alt="Fullscreen" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-primary/20" />
            <p className="text-center text-gray-400 mt-4 font-script text-xl">{lightboxIndex + 1} / {galleryImages.length}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); nextImage(e); }} className="hidden md:block absolute right-2 md:right-8 text-white/70 hover:text-primary p-2 z-50 bg-black/20 hover:bg-black/50 rounded-full"><ChevronRight size={40} /></button>
        </div>
      )}

      {/* Modales Mentions & Politique (simplifiées pour l'affichage) */}
      {showMentionsLegales && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-secondary rounded-lg p-8 max-w-2xl w-full relative">
            <h2 className="text-2xl mb-4">Mentions Légales</h2>
            <p className="text-gray-300 mb-4">Salsa Contigo - 418 512-3484</p>
            <button onClick={() => setShowMentionsLegales(false)} className="bg-primary px-4 py-2 rounded">Fermer</button>
          </div>
        </div>
      )}
      {showPolitiqueConfidentialite && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-secondary rounded-lg p-8 max-w-2xl w-full relative">
            <h2 className="text-2xl mb-4">Politique de Confidentialité</h2>
            <p className="text-gray-300 mb-4">Nous ne conservons pas vos données.</p>
            <button onClick={() => setShowPolitiqueConfidentialite(false)} className="bg-primary px-4 py-2 rounded">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;