<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Formel1-Geschichte.de Manager

Ein interaktives F1-Management-Spiel, das lokal oder in der Cloud bereitgestellt werden kann.

## 🏎️ Lokale Entwicklung

**Voraussetzungen:** Node.js 18 oder höher

1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

2. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

3. Im Browser öffnen: `http://localhost:3000`

## 🚀 Google Cloud Deployment

Diese Anwendung kann auf zwei Arten in Google Cloud bereitgestellt werden:

### Option 1: Google Cloud Run (Empfohlen)

Cloud Run ist eine serverlose Plattform, die automatisch skaliert und nur für die tatsächliche Nutzung Kosten verursacht.

**Manuelle Bereitstellung:**

1. Google Cloud CLI installieren: https://cloud.google.com/sdk/docs/install

2. Anmelden und Projekt auswählen:
   ```bash
   gcloud auth login
   gcloud config set project IHR_PROJEKT_ID
   ```

3. Erforderliche APIs aktivieren:
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

4. Mit Cloud Build deployen:
   ```bash
   gcloud builds submit --config=cloudbuild.yaml
   ```

**Automatisches Deployment-Skript:**

Alternativ können Sie das mitgelieferte Skript verwenden:

```bash
./deploy.sh
```

Das Skript führt Sie durch den Deployment-Prozess und wählt automatisch die richtige Konfiguration.

### Option 2: Google App Engine

App Engine ist eine vollständig verwaltete Plattform für die Bereitstellung von Webanwendungen.

1. Anwendung bauen:
   ```bash
   npm install
   npm run build
   ```

2. Zu App Engine deployen:
   ```bash
   gcloud app deploy app.yaml
   ```

## 📦 Docker

Die Anwendung kann auch lokal mit Docker ausgeführt werden:

```bash
# Image bauen
docker build -t f1-manager .

# Container starten
docker run -p 8080:8080 f1-manager
```

Anwendung ist dann verfügbar unter: `http://localhost:8080`

## 📁 Projektstruktur

```
.
├── index.tsx           # Haupt-Anwendungslogik
├── components/         # React-Komponenten
├── services/          # Spiellogik und Services
├── Dockerfile         # Container-Definition
├── nginx.conf         # Nginx-Konfiguration für Production
├── cloudbuild.yaml    # Google Cloud Build Konfiguration
├── app.yaml           # App Engine Konfiguration
├── deploy.sh          # Automatisches Deployment-Skript
└── package.json       # NPM-Abhängigkeiten
```

## 🛠️ Technologie-Stack

- **Frontend:** React 19, TypeScript
- **Build-Tool:** Vite
- **Styling:** TailwindCSS
- **Container:** Docker + Nginx
- **Cloud:** Google Cloud Run / App Engine

## 📝 Konfiguration

### Umgebungsvariablen

Für die lokale Entwicklung können Sie eine `.env.local` Datei erstellen:

```
# Beispielkonfiguration (falls benötigt)
NODE_ENV=development
```

### Produktionseinstellungen

Die Produktionsumgebung verwendet Nginx als Webserver und ist optimiert für:
- Gzip-Komprimierung
- Asset-Caching
- Security Headers
- SPA-Routing

## 🌐 Nach dem Deployment

Nach erfolgreichem Deployment erhalten Sie eine URL wie:
- Cloud Run: `https://f1-manager-xxxxx-xx.a.run.app`
- App Engine: `https://IHR_PROJEKT_ID.appspot.com`

## 💰 Kosten

- **Cloud Run:** Pay-per-use, kostenlos für geringe Nutzung (inkl. 2 Millionen kostenlose Anfragen/Monat)
- **App Engine:** Kostenlos für F1-Instanzen mit geringer Nutzung

## 🔒 Sicherheit

Die Anwendung enthält grundlegende Sicherheitsheader:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

## 📞 Support

Bei Fragen oder Problemen öffnen Sie bitte ein Issue auf GitHub.

## Original AI Studio Link

View your app in AI Studio: https://ai.studio/apps/drive/12S1xI9vUYilwqQeanrYbyxcyATGxDHIA
