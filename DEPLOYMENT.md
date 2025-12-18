# Google Cloud Deployment-Anleitung

Diese Anleitung führt Sie Schritt für Schritt durch das Deployment Ihrer F1-Manager-Anwendung auf Google Cloud.

## Voraussetzungen

1. **Google Cloud Account**: Erstellen Sie einen Account unter https://cloud.google.com/
2. **Google Cloud CLI installiert**: https://cloud.google.com/sdk/docs/install
3. **Docker installiert** (optional, für lokale Tests): https://docs.docker.com/get-docker/

## Option 1: Cloud Run Deployment (Empfohlen) 🚀

Cloud Run ist serverless, skaliert automatisch und Sie zahlen nur für die tatsächliche Nutzung.

### Schritt 1: Google Cloud CLI einrichten

```bash
# Anmelden bei Google Cloud
gcloud auth login

# Projekt erstellen (oder bestehendes auswählen)
gcloud projects create IHR-PROJEKT-ID --name="F1 Manager"

# Projekt auswählen
gcloud config set project IHR-PROJEKT-ID
```

### Schritt 2: Erforderliche APIs aktivieren

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Schritt 3: Deployment durchführen

**Automatisch mit dem Skript:**
```bash
./deploy.sh
```

**Oder manuell:**
```bash
# Projekt mit Cloud Build bauen und deployen
gcloud builds submit --config=cloudbuild.yaml

# Nach erfolgreichem Build erhalten Sie die URL Ihrer Anwendung
```

### Schritt 4: Anwendung öffnen

Nach dem Deployment erhalten Sie eine URL wie:
```
https://f1-manager-xxxxx-xx.a.run.app
```

Öffnen Sie diese URL in Ihrem Browser, um die Anwendung zu nutzen!

## Option 2: App Engine Deployment

App Engine ist eine vollständig verwaltete Plattform, ideal für traditionelle Webanwendungen.

### Schritt 1: Projekt vorbereiten

```bash
# Projekt erstellen und auswählen (falls noch nicht geschehen)
gcloud projects create IHR-PROJEKT-ID
gcloud config set project IHR-PROJEKT-ID
```

### Schritt 2: Anwendung bauen

```bash
npm install
npm run build
```

### Schritt 3: Zu App Engine deployen

```bash
gcloud app deploy app.yaml
```

### Schritt 4: Anwendung öffnen

```bash
gcloud app browse
```

Die Anwendung ist dann verfügbar unter:
```
https://IHR-PROJEKT-ID.appspot.com
```

## Option 3: Lokales Docker-Testing

Bevor Sie in die Cloud deployen, können Sie die Anwendung lokal mit Docker testen:

```bash
# Docker Image bauen
docker build -t f1-manager .

# Container starten
docker run -d -p 8080:8080 f1-manager

# Im Browser öffnen
open http://localhost:8080
```

## Kosten-Übersicht 💰

### Cloud Run
- **Kostenlos**: 
  - 2 Millionen Anfragen pro Monat
  - 360.000 GB-Sekunden pro Monat
  - 180.000 vCPU-Sekunden pro Monat
- **Danach**: Pay-per-use, sehr günstig für geringe/mittlere Nutzung

### App Engine
- **F1-Instanzen**: Kostenlos für geringe Nutzung
- **Skaliert automatisch** basierend auf Traffic

**Für die meisten Hobby-Projekte bleibt es kostenlos oder sehr günstig (< 5€/Monat)!**

## Troubleshooting 🔧

### Fehler: "APIs nicht aktiviert"
```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

### Fehler: "Keine Berechtigung"
Stellen Sie sicher, dass Ihr Google-Account die Rolle "Owner" oder "Editor" für das Projekt hat.

### Docker Build schlägt fehl
Stellen Sie sicher, dass Docker läuft:
```bash
docker ps
```

### Deployment dauert zu lange
Der erste Build kann 5-10 Minuten dauern. Nachfolgende Builds sind schneller durch Caching.

## Weitere Konfiguration ⚙️

### Eigene Domain verbinden

1. Domain in Google Cloud Console registrieren
2. DNS-Einträge hinzufügen
3. Domain mit Cloud Run oder App Engine verbinden

Siehe: https://cloud.google.com/run/docs/mapping-custom-domains

### Umgebungsvariablen setzen

Für Cloud Run:
```bash
gcloud run services update f1-manager \
  --set-env-vars "VAR_NAME=value" \
  --region europe-west1
```

### Auto-Scaling anpassen

In `cloudbuild.yaml` oder über die Google Cloud Console können Sie:
- Minimale/Maximale Instanzen festlegen
- CPU/Memory-Limits anpassen
- Timeout-Werte ändern

## Nächste Schritte 🎯

1. ✅ Deployment durchgeführt
2. 🔒 HTTPS ist standardmäßig aktiviert
3. 📊 Monitoring in Google Cloud Console aktivieren
4. 🔔 Alerts für hohe Kosten einrichten
5. 🌐 Eigene Domain verbinden (optional)

## Support & Dokumentation 📚

- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **App Engine Docs**: https://cloud.google.com/appengine/docs
- **Cloud Build Docs**: https://cloud.google.com/build/docs
- **Pricing Calculator**: https://cloud.google.com/products/calculator

---

**Viel Erfolg mit Ihrem F1-Manager-Spiel! 🏎️💨**
