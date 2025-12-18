# Google Cloud Run Deployment - Anleitung

Diese Anleitung erklärt, wie Sie die F1 Manager-Anwendung auf Google Cloud Run deployen.

## Voraussetzungen

1. **Google Cloud Account** mit aktivierter Billing
2. **gcloud CLI** installiert ([Installation](https://cloud.google.com/sdk/docs/install))
3. **Docker** installiert (für lokale Tests)
4. **Git** installiert

## Schnellstart

### 1. Google Cloud einrichten

```bash
# Bei Google Cloud anmelden
gcloud auth login

# Projekt erstellen oder auswählen
gcloud projects create PROJEKT-ID --name="F1 Manager"
gcloud config set project PROJEKT-ID

# Erforderliche APIs aktivieren
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Deployment durchführen

**Option A: Mit Cloud Build (empfohlen)**

```bash
# Cloud Build starten
gcloud builds submit --config=cloudbuild.yaml

# Die URL Ihrer Anwendung wird am Ende angezeigt
```

**Option B: Manuelles Deployment**

```bash
# Docker Image bauen
docker build -t gcr.io/PROJEKT-ID/f1-manager:latest .

# Image zu Google Container Registry pushen
docker push gcr.io/PROJEKT-ID/f1-manager:latest

# Auf Cloud Run deployen
gcloud run deploy f1-manager \
  --image gcr.io/PROJEKT-ID/f1-manager:latest \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1
```

### 3. Zugriff auf die Anwendung

Nach erfolgreichem Deployment erhalten Sie eine URL wie:
```
https://f1-manager-XXXXXXXXXX-ew.a.run.app
```

## Lokaler Test

Vor dem Deployment können Sie die Anwendung lokal testen:

```bash
# Docker Image bauen
docker build -t f1-manager-test .

# Container starten
docker run -p 8080:8080 f1-manager-test

# Im Browser öffnen
# http://localhost:8080
```

## Konfigurationsoptionen

### Cloud Run Einstellungen

In der `cloudbuild.yaml` können Sie folgende Parameter anpassen:

- **Region**: `europe-west1` (oder andere Region)
- **Memory**: `512Mi` (Standard) oder mehr für bessere Performance
- **CPU**: `1` (Standard) oder mehr für bessere Performance
- **Authentifizierung**: `--allow-unauthenticated` für öffentlichen Zugriff

### Kosten

- **Free Tier**: 2 Millionen Requests/Monat kostenlos
- **Geschätzte Kosten** bei moderater Nutzung: < 5€/Monat
- [Preisrechner](https://cloud.google.com/products/calculator)

## Problembehandlung

### Dockerfile nicht gefunden

**Problem**: Cloud Build kann Dockerfile nicht finden
```
unable to prepare context: unable to evaluate symlinks in Dockerfile path: 
lstat /workspace/Dockerfile: no such file or directory
```

**Mögliche Ursachen und Lösungen**:

1. **Sie befinden sich nicht im Repository-Root-Verzeichnis**
   ```bash
   # Wechseln Sie ins Repository-Root
   cd /pfad/zum/F1-geschichte-manager
   
   # Verifizieren Sie, dass Sie im richtigen Verzeichnis sind
   ls -la Dockerfile cloudbuild.yaml nginx.conf
   ```

2. **Die Dateien wurden noch nicht gepullt**
   ```bash
   # Holen Sie die neuesten Änderungen vom PR-Branch
   git fetch origin
   git checkout copilot/fix-google-cloud-run-build
   git pull origin copilot/fix-google-cloud-run-build
   ```

3. **Verifizierungsskript ausführen**
   ```bash
   # Macht das Skript ausführbar und führt es aus
   chmod +x verify-cloud-build.sh
   ./verify-cloud-build.sh
   ```
   
   Das Skript prüft:
   - ✓ Sind Sie im richtigen Verzeichnis?
   - ✓ Sind alle erforderlichen Dateien vorhanden?
   - ✓ Sind die Dateien in Git committed?
   - ✓ Ist gcloud konfiguriert?

### Build schlägt fehl

**Problem**: SSL-Zertifikat-Fehler während npm install
```
SELF_SIGNED_CERT_IN_CHAIN
```

**Lösung**: Das Standard-`Dockerfile` enthält bereits die Lösung für Cloud Build:
```dockerfile
RUN npm config set strict-ssl false && \
    npm install && \
    npm config set strict-ssl true
```

**Hinweis**: Diese SSL-Konfiguration wird nur während des Build-Prozesses verwendet und betrifft nicht die finale Container-Sicherheit. Wenn Sie in einer Umgebung ohne SSL-Probleme deployen, können Sie `Dockerfile.production` verwenden:

```bash
docker build -f Dockerfile.production -t f1-manager .
```

### Container startet nicht

**Problem**: Port-Mismatch
```
Container failed to start
```

**Lösung**: Stellen Sie sicher, dass nginx auf Port 8080 läuft (siehe `nginx.conf`)

### 404 Fehler für Assets

**Problem**: JavaScript/CSS Dateien werden nicht gefunden

**Lösung**: Überprüfen Sie die `base` Konfiguration in `vite.config.ts`:
```typescript
base: './',
```

## Aktualisierungen deployen

Nach Code-Änderungen:

```bash
# Neues Build starten
gcloud builds submit --config=cloudbuild.yaml
```

Cloud Build erstellt automatisch ein neues Image mit dem aktuellen Commit SHA und deployt es.

## Monitoring

```bash
# Logs anzeigen
gcloud run services logs read f1-manager --region europe-west1

# Service-Status prüfen
gcloud run services describe f1-manager --region europe-west1
```

## Custom Domain einrichten

```bash
# Domain verifizieren
gcloud domains verify IHRE-DOMAIN.de

# Domain mappen
gcloud run domain-mappings create \
  --service f1-manager \
  --domain IHRE-DOMAIN.de \
  --region europe-west1
```

## Sicherheit

- Das Dockerfile verwendet Multi-Stage-Builds für kleinere Images
- nginx ist für Production konfiguriert mit Security Headers
- Container läuft als non-root user (nginx standard)

## Support

Bei Problemen:
1. Prüfen Sie die [Cloud Run Dokumentation](https://cloud.google.com/run/docs)
2. Überprüfen Sie die Build-Logs: `gcloud builds log XXXXXX`
3. Überprüfen Sie die Service-Logs: `gcloud run services logs read f1-manager`

## Ressourcen

- [Cloud Run Dokumentation](https://cloud.google.com/run/docs)
- [Cloud Build Dokumentation](https://cloud.google.com/build/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
