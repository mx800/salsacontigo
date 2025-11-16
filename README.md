# Salsa Contigo - École de Danse Latine

Site web moderne et responsive pour l'école de danse **Salsa Contigo**, spécialisée en cours de salsa, bachata, merengue et cumbia.

## 🎯 Technologies Utilisées

### Frontend
- **React 18** - Framework JavaScript pour la construction d'interfaces utiliselles
- **TypeScript** - Typage statique pour JavaScript
- **Vite** - Bundler et serveur de développement ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire pour le design responsive
- **Lucide React** - Bibliothèque d'icônes

### Styling & Design
- **PostCSS** - Outil de transformation CSS
- **Autoprefixer** - Ajoute automatiquement les préfixes CSS cross-browser
- **Tailwind CSS Animate** - Animations CSS prêtes à l'emploi

### Validation & Forms
- **React Hook Form** - Gestion efficace des formulaires
- **Zod** - Validation de schémas TypeScript
- **@hookform/resolvers** - Intégration entre React Hook Form et Zod

### Infrastructure
- **Docker & Docker Compose** - Containerisation et orchestration
- **pnpm** - Gestionnaire de paquets ultra-rapide

## 📋 Prérequis

Pour exécuter le projet en local (sans Docker):
- **Node.js 20+** - Runtime JavaScript
- **pnpm** - Gestionnaire de paquets

Pour exécuter avec Docker:
- **Docker Desktop** - Containerisation

## 🚀 Démarrage du Projet

### Option 1: Avec Docker (Recommandé)

```bash
# Accéder au répertoire du projet
cd "d:\Projet\Salsa Contigo\salsa-contigo package"

# Lancer le conteneur Docker
docker-compose up -d

# Le site sera accessible à http://localhost:5173
```

Pour arrêter le serveur:
```bash
docker-compose down
```

Pour voir les logs en direct:
```bash
docker-compose logs -f
```

### Option 2: En Local (sans Docker)

```bash
# Accéder au répertoire du projet
cd "d:\Projet\Salsa Contigo\salsa-contigo package\salsa-contigo-website"

# Installer les dépendances avec pnpm
pnpm install

# Lancer le serveur de développement
pnpm dev

# Le site sera accessible à http://localhost:5173
```

## 📦 Scripts Disponibles

```bash
# Démarrer le serveur de développement (avec hot reload)
pnpm dev

# Construire le site statique pour la production
pnpm build

# Construire avec optimisations de production
pnpm build:prod

# Prévisualiser la version de production en local
pnpm preview

# Vérifier la syntaxe avec ESLint
pnpm lint

# Installer les dépendances
pnpm install-deps

# Nettoyer les fichiers générés
pnpm clean
```

## 🏗️ Structure du Projet

```
salsa-contigo-website/
├── public/                  # Fichiers statiques
│   ├── images/
│   │   ├── logo.png        # Logo de l'école
│   │   └── background.png  # Image de fond parallaxe
│   └── use.txt
├── src/
│   ├── components/         # Composants React réutilisables
│   │   └── ErrorBoundary.tsx
│   ├── hooks/              # Hooks personnalisés
│   │   └── use-mobile.tsx
│   ├── lib/                # Utilitaires et configurations
│   │   ├── supabase.ts    # Configuration Supabase
│   │   └── utils.ts
│   ├── App.tsx             # Composant principal
│   ├── main.tsx            # Point d'entrée
│   ├── App.css             # Styles du composant App
│   └── index.css           # Styles globaux
├── supabase/               # Fonctions Supabase (backend)
│   └── functions/
│       ├── contact-form/   # Traitement des formulaires
│       └── newsletter-subscribe/
├── package.json            # Dépendances du projet
├── pnpm-lock.yaml          # Lock file des dépendances
├── tsconfig.json           # Configuration TypeScript
├── vite.config.ts          # Configuration Vite
├── tailwind.config.js      # Configuration Tailwind CSS
├── postcss.config.js       # Configuration PostCSS
├── Dockerfile              # Configuration Docker
└── README.md              # Ce fichier
```

## 🎨 Sections du Site

1. **Accueil** - Hero section avec parallaxe interactive
2. **Biographie** - Histoire et philosophie de l'école
3. **Événements** - Soirées spéciales et événements vedettes
4. **Cours** - Types de cours, niveaux et formats
5. **Inscriptions** - Tarifs et horaires par ville
6. **Professeurs** - Équipe d'enseignants
7. **Multimédia** - Galerie photos et vidéos
8. **Musique** - Playlist Spotify
9. **Réseaux Sociaux** - Facebook et newsletter
10. **Contact** - Formulaire de contact

## 🏭 Génération d'un Site Statique

Pour créer une version statique entièrement servable (HTML/CSS/JS):

### Étape 1: Construire le site statique

```bash
# Accéder au répertoire du projet
cd "d:\Projet\Salsa Contigo\salsa-contigo package\salsa-contigo-website"

# Construire pour la production
pnpm build
```

Cela génère un dossier `dist/` contenant tous les fichiers statiques.

### Étape 2: Prévisualiser localement

```bash
# Voir le résultat en local avant de déployer
pnpm preview
```

### Étape 3: Générer avec Docker

Si vous utilisez Docker, vous pouvez générer le site statique directement dans un conteneur:

```bash
# Générer le site statique en production avec Docker
docker run --rm -v "$(pwd):/app" node:20-alpine sh -c "cd /app && npm install -g pnpm && pnpm install --frozen-lockfile --ignore-scripts && pnpm run build:prod"

# Vérifier que le dossier dist/ a été créé
ls -la dist/
```

**Explications:**
- `docker run --rm` - Crée un conteneur temporaire qui sera supprimé après
- `-v "$(pwd):/app"` - Monte le répertoire courant dans le conteneur
- `node:20-alpine` - Image Node.js
- Les commandes installent pnpm, les dépendances, et lancent le build

**Alternative avec Docker Compose pour la production:**

Créer un service temporaire dans `docker-compose.yml`:

```yaml
version: '3.8'

services:
  build-prod:
    build:
      context: ./salsa-contigo-website
      dockerfile: Dockerfile
    volumes:
      - ./salsa-contigo-website:/app:delegated
      - /app/node_modules
    command: sh -c "pnpm install --frozen-lockfile --ignore-scripts && pnpm run build:prod"
```

Puis exécuter:

```bash
docker-compose run --rm build-prod
```

### Étape 4: Déployer le site statique

Le contenu du dossier `dist/` peut être déployé sur:

- **Vercel** (recommandé pour React/Vite)
  ```bash
  npm i -g vercel
  vercel
  ```

- **Netlify**
  ```bash
  npm i -g netlify-cli
  netlify deploy --prod --dir=dist
  ```

- **GitHub Pages**
  - Pusher le dossier `dist/` vers la branche `gh-pages`

- **N'importe quel serveur web** (Apache, Nginx, etc.)
  - Uploader le contenu du dossier `dist/` via FTP/SFTP

- **AWS S3 + CloudFront**
  - Uploader les fichiers sur S3
  - Configurer CloudFront pour servir depuis S3

- **Hébergeur traditionnel** (1and1, OVH, etc.)
  - Uploader via FTP/SFTP

### Exemple avec Docker (Build & Serve statique)

Pour un déploiement en production avec Docker:

```dockerfile
# Fichier Dockerfile.prod pour production
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm run build:prod

# Stage de production - servir avec Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Puis créer `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📊 Contenu du dossier `dist/` après le build

```
dist/
├── index.html              # Fichier HTML principal
├── assets/
│   ├── index-[hash].js    # JavaScript groupé et minifié
│   └── index-[hash].css   # CSS groupé et minifié
└── images/                # Images optimisées
```

## 🔐 Sécurité & Performance

- ✅ Code minifié et optimisé pour la production
- ✅ Tree-shaking automatique des imports inutilisés
- ✅ Images optimisées par Vite
- ✅ CSS purgé (seuls les styles utilisés sont inclus)
- ✅ Cache-busting automatique avec hash de contenu

## 🐛 Dépannage

### Le site n'affiche pas les images
- Vérifier que les images existent dans `public/images/`
- Vérifier les chemins relatifs aux images dans le code


### Erreur TypeScript
```bash
# Réinstaller les dépendances
rm -rf node_modules
pnpm install
```