import { useEffect, useState, useRef } from 'react';
import { ChevronDown, Phone, Mail, Facebook, MapPin, Calendar, Users, Music, Instagram, Send, Spotify } from 'lucide-react';
import './App.css';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isNavFixed, setIsNavFixed] = useState(false);
  const baseUrl = (import.meta.env.BASE_URL) || '/';

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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${isNavFixed ? 'nav-fixed' : ''}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img src={`${baseUrl}images/logo.png`} alt="Salsa Contigo" className="h-16 md:h-20" />
            <div className="hidden md:flex space-x-6 text-sm font-medium">
              <button onClick={() => scrollToSection('accueil')} className="hover:text-primary transition">Accueil</button>
              <button onClick={() => scrollToSection('biographie')} className="hover:text-primary transition">Biographie</button>
              <button onClick={() => scrollToSection('evenements')} className="hover:text-primary transition">Événements</button>
              <button onClick={() => scrollToSection('cours')} className="hover:text-primary transition">Cours</button>
              <button onClick={() => scrollToSection('inscriptions')} className="hover:text-primary transition">Inscriptions</button>
              <button onClick={() => scrollToSection('professeurs')} className="hover:text-primary transition">Professeurs</button>
              <button onClick={() => scrollToSection('multimedia')} className="hover:text-primary transition">Multimédia</button>
              <button onClick={() => scrollToSection('spotify')} className="hover:text-primary transition">Musique</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition">Contact</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero with Parallax */}
      <section id="accueil" className="relative h-screen overflow-hidden">
        {/* Parallax Background Layers */}
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

        {/* Content */}
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
              Avec des cours à <strong>Jonquière</strong>, <strong>Alma</strong>, <strong>Saint-Jean-Eudes</strong> et <strong>Rivière-du-Loup</strong>, nous rendons la danse latine accessible à tous, des débutants aux danseurs avancés.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Événements vedettes */}
      <section id="evenements" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-16 gradient-text fade-in">Événements Vedettes</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Featured Event */}
            <div className="bg-gradient-to-br from-secondary to-black p-8 rounded-lg border border-primary/20 hover:border-primary/50 transition-all duration-300 glow-red fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-primary" size={24} />
                <h3 className="font-script text-3xl text-primary">La Grande Soirée ROUGE & BLANC</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Rejoignez-nous pour une soirée inoubliable de danse, de musique et de plaisir ! Portez vos plus beaux habits rouges et blancs et dansez toute la nuit sur les rythmes endiablés de la salsa, bachata, et merengue.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span>Jonquière, QC</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <span>À venir - Restez à l'écoute</span>
                </div>
                <div className="flex items-center gap-2">
                  <a href="https://www.facebook.com/pages/Salsa-Contigo/146855305346623" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light transition">
                    <Facebook size={16} />
                  </a>
                </div>
              </div>
              <button className="mt-6 bg-primary hover:bg-primary-light px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                En savoir plus
              </button>
            </div>

            {/* Social Event Promo */}
            <div className="bg-gradient-to-br from-secondary to-black p-8 rounded-lg border border-primary/20 hover:border-primary/50 transition-all duration-300 glow-red fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-primary" size={24} />
                <h3 className="font-script text-3xl text-primary">Soirées Sociales</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Chaque mois, nous organisons des soirées sociales où nos élèves peuvent pratiquer leurs nouveaux mouvements dans une ambiance décontractée et festive. Parfait pour rencontrer d'autres passionnés de danse !
              </p>
              <div className="flex gap-3 mt-6">
                <a href="https://www.facebook.com/pages/Salsa-Contigo/146855305346623" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light transition">
                  <Facebook size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Cours et Formations */}
      <section id="cours" className="py-20 bg-gradient-to-b from-black to-secondary">
        <div className="container mx-auto px-6">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-16 gradient-text fade-in">Cours & Formations</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Dance Styles */}
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

            {/* Levels */}
            <div className="bg-black/50 p-6 rounded-lg border border-primary/20 glow-red fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-script text-2xl text-primary mb-4">Niveaux</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2"><ChevronDown size={16} className="text-primary" /> Débutant</li>
                <li className="flex items-center gap-2"><ChevronDown size={16} className="text-primary" /> Intermédiaire</li>
                <li className="flex items-center gap-2"><ChevronDown size={16} className="text-primary" /> Avancé</li>
              </ul>
            </div>

            {/* Formats */}
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

          {/* Special Program */}
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
            {/* Pricing Info */}
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

            {/* Schedule by City */}
            <div className="space-y-6 fade-in">
              <h3 className="font-script text-3xl text-primary text-center mb-8">Horaires par ville</h3>
              
              {/* City Schedule Cards */}
              {[
                { city: 'Jonquière', days: [
                  { day: 'Lundi', course: 'Salsa Débutant', time: '19h00 - 20h00' },
                  { day: 'Mercredi', course: 'Salsa Intermédiaire', time: '19h30 - 20h30' },
                ]},
                { city: 'Saint-Jean-Eudes', days: [
                  { day: 'Mercredi', course: 'Rueda de Casino', time: '19h30 - 20h30' },
                ]},
                { city: 'Alma', days: [
                  { day: 'Mardi', course: 'Bachata Débutant', time: '18h30 - 19h30' },
                  { day: 'Jeudi', course: 'Salsa Avancé', time: '20h00 - 21h00' },
                ]},
                { city: 'Rivière-du-Loup', days: [
                  { day: 'Lundi', course: 'Merengue & Cumbia', time: '19h00 - 20h00' },
                ]},
              ].map((location, idx) => (
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

            {/* Registration CTA */}
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
          
          <div className="max-w-5xl mx-auto">
            <div className="overflow-x-auto overflow-y-hidden">
              <div className="flex gap-6 pb-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex-shrink-0 w-80 h-60 bg-gradient-to-br from-primary/20 to-secondary rounded-lg border border-primary/20 hover:border-primary/50 transition-all duration-300 flex items-center justify-center fade-in">
                    <Music size={48} className="text-primary/40" />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-gray-400 mt-8">Photos et vidéos de nos cours, événements et soirées sociales</p>
          </div>
        </div>
      </section>

      {/* Section 8: Page Spotify dédiée */}
      <section id="spotify" className="py-20 bg-gradient-to-b from-black to-secondary">
        <div className="container mx-auto px-6">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-16 gradient-text fade-in">Notre Musique</h2>
          
          <div className="max-w-3xl mx-auto text-center fade-in">
            <div className="bg-black/50 p-8 rounded-lg border border-primary/20">
              <Music size={64} className="text-primary mx-auto mb-6" />
              <h3 className="font-script text-3xl text-primary mb-4">Playlist Salsa Contigo</h3>
              <p className="text-gray-300 mb-8">
                Découvrez notre sélection musicale de salsa, bachata, merengue et plus encore. Les rythmes qui font vibrer nos cours !
              </p>
              <a 
                href="https://open.spotify.com/search/salsacontigo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-primary hover:bg-primary-light px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Écouter sur Spotify
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Réseaux sociaux */}
      <section id="reseaux" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-16 gradient-text fade-in">Suivez-nous</h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-gradient-to-br from-secondary to-black p-8 rounded-lg border border-primary/20 glow-red fade-in">
              <div className="flex items-center gap-4 mb-6">
                <Facebook size={32} className="text-primary" />
                <h3 className="font-script text-3xl text-primary">Facebook</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Rejoignez notre communauté sur Facebook pour les dernières nouvelles, photos d'événements et annonces de cours.
              </p>
              <a 
                href="https://www.facebook.com/pages/Salsa-Contigo/146855305346623" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-primary hover:bg-primary-light px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Visiter notre page
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: Contact */}
      <section id="contact" className="py-20 bg-gradient-to-b from-black to-secondary">
        <div className="container mx-auto px-6">
          <h2 className="font-script text-5xl md:text-6xl text-center mb-16 gradient-text">Contactez-nous</h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
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

            {/* Contact Form */}
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
              <a href="#" className="hover:text-primary transition">Mentions légales</a>
              <a href="#" className="hover:text-primary transition">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
