# Quick Start Guide - F1 Manager Deployment

## TL;DR - Schnellstart für Google Cloud Run

```bash
# 1. Google Cloud CLI installieren (falls noch nicht geschehen)
# https://cloud.google.com/sdk/docs/install

# 2. Anmelden und Projekt einrichten
gcloud auth login
gcloud config set project IHR-PROJEKT-ID

# 3. APIs aktivieren
gcloud services enable run.googleapis.com cloudbuild.googleapis.com

# 4. Deployen mit einem Befehl
gcloud builds submit --config=cloudbuild.yaml

# Fertig! 🎉 Sie erhalten eine URL wie:
# https://f1-manager-xxxxx-xx.a.run.app
```

## Alternative: Automatisches Deployment-Skript

```bash
./deploy.sh
```

Das Skript führt Sie interaktiv durch alle Schritte!

## Lokaler Test mit Docker

```bash
# Image bauen
docker build -t f1-manager .

# Ausführen
docker run -p 8080:8080 f1-manager

# Öffnen: http://localhost:8080
```

## Dateien in diesem Projekt

- **`Dockerfile`** - Docker Container Definition (mit SSL Workaround)
- **`Dockerfile.production`** - Production Dockerfile (ohne SSL Workaround)
- **`nginx.conf`** - Nginx Webserver Konfiguration
- **`cloudbuild.yaml`** - Cloud Build & Cloud Run Deployment
- **`app.yaml`** - App Engine Deployment Konfiguration
- **`deploy.sh`** - Interaktives Deployment-Skript
- **`DEPLOYMENT.md`** - Ausführliche Deployment-Anleitung
- **`README.md`** - Projekt-Dokumentation

## Deployment-Optionen im Vergleich

| Feature | Cloud Run | App Engine |
|---------|-----------|------------|
| **Kosten (Hobby)** | Kostenlos* | Kostenlos* |
| **Skalierung** | Automatisch 0→∞ | Automatisch |
| **Setup** | Einfach | Sehr einfach |
| **Docker** | ✅ Ja | ⚠️ Optional |
| **Serverless** | ✅ Ja | ✅ Ja |
| **Empfohlen für** | Moderne Apps | Einfache Apps |

*Im kostenlosen Kontingent

## Häufige Probleme

**"gcloud: command not found"**
→ Google Cloud CLI installieren: https://cloud.google.com/sdk/docs/install

**"Docker build fehlgeschlagen"**
→ Verwenden Sie `Dockerfile.production` statt `Dockerfile` wenn SSL-Fehler auftreten

**"Permission denied"**
→ Stellen Sie sicher, dass Sie Owner/Editor-Rechte für das Projekt haben

## Support & Dokumentation

- 📖 Ausführliche Anleitung: Siehe `DEPLOYMENT.md`
- 🌐 Google Cloud Docs: https://cloud.google.com/docs
- 💬 GitHub Issues: Für Probleme bitte ein Issue öffnen

---

**Viel Erfolg! 🏎️💨**
