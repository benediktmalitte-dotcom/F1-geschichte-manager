<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# F1 Geschichte Manager

Ein interaktives Formel-1-Management-Spiel als Browser-Anwendung.

## Lokale Entwicklung

**Voraussetzungen:** Node.js (Version 20 oder höher)

1. Dependencies installieren:
   ```bash
   npm install
   ```

2. Optional: `GEMINI_API_KEY` in [.env.local](.env.local) setzen

3. Development-Server starten:
   ```bash
   npm run dev
   ```

4. Im Browser öffnen: http://localhost:3000

## Production Build

```bash
npm run build
```

Die Build-Artefakte werden im `dist/` Ordner erstellt.

## Google Cloud Run Deployment

Diese Anwendung ist für Google Cloud Run optimiert.

### Schnellstart

```bash
# Bei Google Cloud anmelden
gcloud auth login

# Projekt setzen
gcloud config set project IHRE-PROJEKT-ID

# Deployen mit Cloud Build
gcloud builds submit --config=cloudbuild.yaml
```

Für eine detaillierte Anleitung siehe [DEPLOYMENT.md](DEPLOYMENT.md).

### Was ist enthalten?

- ✅ **Dockerfile** - Multi-stage Build mit nginx für Production
- ✅ **cloudbuild.yaml** - Automatisches CI/CD für Cloud Run
- ✅ **nginx.conf** - Production-Web-Server mit Gzip, Security Headers, SPA-Routing
- ✅ **.dockerignore** & **.gcloudignore** - Optimierte Build-Kontexte

## Technologie-Stack

- **React 19** - UI Framework
- **TypeScript** - Typsicherheit
- **Vite** - Build Tool
- **nginx** - Production Web Server
- **Google Cloud Run** - Serverless Container Platform

## Kosten

- **Free Tier**: 2 Millionen Requests/Monat kostenlos
- **Geschätzte Kosten**: < 5€/Monat bei moderater Nutzung

## Support

Bei Problemen mit dem Deployment siehe [DEPLOYMENT.md](DEPLOYMENT.md) für Troubleshooting-Tipps.
