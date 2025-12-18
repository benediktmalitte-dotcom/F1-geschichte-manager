# Google Cloud Run - Schnellstart

## 3 Schritte zum Deployment

### 0️⃣ Vorbereitung (optional aber empfohlen)

```bash
# Verifizieren Sie, dass alles bereit ist
chmod +x verify-cloud-build.sh
./verify-cloud-build.sh
```

### 1️⃣ Google Cloud einrichten

```bash
# Anmelden
gcloud auth login

# Projekt setzen (ersetzen Sie PROJEKT-ID)
gcloud config set project PROJEKT-ID

# APIs aktivieren
gcloud services enable cloudbuild.googleapis.com run.googleapis.com
```

### 2️⃣ Deployen

```bash
# Mit Cloud Build (automatisch)
gcloud builds submit --config=cloudbuild.yaml
```

### 3️⃣ Fertig! 🎉

Die URL wird nach erfolgreichem Build angezeigt:
```
https://f1-manager-XXXXXXXXXX-ew.a.run.app
```

## Alternative: Manuelles Deployment

```bash
# Build
docker build -t gcr.io/PROJEKT-ID/f1-manager .

# Push
docker push gcr.io/PROJEKT-ID/f1-manager

# Deploy
gcloud run deploy f1-manager \
  --image gcr.io/PROJEKT-ID/f1-manager \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated
```

## Lokaler Test

```bash
# Build
docker build -t f1-test .

# Run
docker run -p 8080:8080 f1-test

# Test
curl http://localhost:8080/health
```

## Wichtige Dateien

| Datei | Zweck |
|-------|-------|
| `Dockerfile` | Container-Definition mit SSL-Fix |
| `Dockerfile.production` | Ohne SSL-Fix (optional) |
| `nginx.conf` | Web-Server Konfiguration |
| `cloudbuild.yaml` | CI/CD Pipeline |
| `DEPLOYMENT.md` | Detaillierte Anleitung |

## Kosten

- **Free Tier**: 2M Requests/Monat gratis
- **Danach**: ~5€/Monat (typisch)

## Probleme?

### Häufige Fehler

**"Dockerfile not found"** - Sie befinden sich nicht im Repository-Root:
```bash
cd /pfad/zum/F1-geschichte-manager
./verify-cloud-build.sh  # Prüft alles
```

**Weitere Hilfe**: Siehe [DEPLOYMENT.md](DEPLOYMENT.md) für detailliertes Troubleshooting.

## Support

```bash
# Logs anzeigen
gcloud run services logs read f1-manager --region europe-west1

# Status prüfen
gcloud run services describe f1-manager --region europe-west1
```
