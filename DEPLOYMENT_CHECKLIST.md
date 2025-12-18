# Deployment Checklist ✅

Verwenden Sie diese Checkliste, um sicherzustellen, dass Sie alle Schritte für ein erfolgreiches Deployment durchgeführt haben.

## Vor dem Deployment

- [ ] **Google Cloud Account erstellt** (https://cloud.google.com/)
- [ ] **Google Cloud CLI installiert** (https://cloud.google.com/sdk/docs/install)
- [ ] **Docker installiert** (für lokale Tests, optional)
- [ ] **Node.js installiert** (Version 18+)
- [ ] **Projekt-Abhängigkeiten installiert** (`npm install`)
- [ ] **Lokaler Build erfolgreich** (`npm run build`)

## Google Cloud Vorbereitung

- [ ] **Bei Google Cloud angemeldet** (`gcloud auth login`)
- [ ] **Projekt erstellt oder ausgewählt**
  ```bash
  gcloud projects create IHR-PROJEKT-ID
  gcloud config set project IHR-PROJEKT-ID
  ```
- [ ] **Billing-Account verknüpft** (in Google Cloud Console)
- [ ] **APIs aktiviert**
  ```bash
  gcloud services enable run.googleapis.com
  gcloud services enable cloudbuild.googleapis.com
  ```

## Deployment-Option wählen

### Option A: Cloud Run (Empfohlen)

- [ ] **Cloud Build konfiguriert** (`cloudbuild.yaml` vorhanden ✓)
- [ ] **Dockerfile vorhanden und getestet** (✓)
- [ ] **Deployment durchführen**
  ```bash
  gcloud builds submit --config=cloudbuild.yaml
  ```
  ODER
  ```bash
  ./deploy.sh
  ```
- [ ] **Deployment-URL erhalten und getestet**
- [ ] **Anwendung im Browser geöffnet und geprüft**

### Option B: App Engine

- [ ] **App Engine Konfiguration vorhanden** (`app.yaml` ✓)
- [ ] **Build erstellt** (`npm run build`)
- [ ] **Deployment durchführen**
  ```bash
  gcloud app deploy app.yaml
  ```
- [ ] **Anwendung geöffnet** (`gcloud app browse`)

## Nach dem Deployment

- [ ] **Anwendung funktioniert korrekt**
  - [ ] Manager-Name kann eingegeben werden
  - [ ] Team kann ausgewählt werden
  - [ ] Rennsimulation funktioniert
  - [ ] Management-Funktionen funktionieren
  - [ ] Entwicklung funktioniert

- [ ] **Performance überprüfen**
  - [ ] Seite lädt schnell (< 3 Sekunden)
  - [ ] Keine JavaScript-Fehler in der Konsole
  - [ ] Mobile Ansicht funktioniert

- [ ] **Monitoring einrichten**
  - [ ] Google Cloud Monitoring aktiviert
  - [ ] Alerts für Fehler konfiguriert (optional)
  - [ ] Budget-Alerts eingerichtet (empfohlen)

## Optional: Erweiterte Konfiguration

- [ ] **Eigene Domain verbinden**
  ```bash
  gcloud run domain-mappings create --service f1-manager --domain ihre-domain.de
  ```

- [ ] **Umgebungsvariablen setzen** (falls benötigt)
  ```bash
  gcloud run services update f1-manager --set-env-vars "KEY=value"
  ```

- [ ] **Auto-Scaling anpassen**
  - Minimale Instanzen: 0 (kostenlos) oder 1+ (schnellerer Start)
  - Maximale Instanzen: anpassen basierend auf erwartetem Traffic

- [ ] **CDN aktivieren** (für globale Nutzer)
  ```bash
  gcloud compute backend-services update-backend --global --enable-cdn
  ```

## Troubleshooting

Falls Probleme auftreten:

- [ ] **Cloud Build Logs überprüfen**
  ```bash
  gcloud builds list
  gcloud builds log [BUILD_ID]
  ```

- [ ] **Cloud Run Logs überprüfen**
  ```bash
  gcloud run services logs read f1-manager --region europe-west1
  ```

- [ ] **Lokalen Docker Build testen**
  ```bash
  docker build -t f1-test .
  docker run -p 8080:8080 f1-test
  ```

- [ ] **DEPLOYMENT.md für Details konsultieren**

## Kosten-Check

- [ ] **Kostenloses Kontingent verstanden**
  - Cloud Run: 2M Anfragen/Monat kostenlos
  - Keine Kosten bei geringer Nutzung

- [ ] **Budget-Alert eingerichtet**
  - In Google Cloud Console: Billing → Budget & Alerts
  - Empfohlenes Budget: 10€/Monat für Hobby-Projekte

- [ ] **Kosten regelmäßig überprüfen**
  - Wöchentlich in Cloud Console nachsehen

## Backup & Wartung

- [ ] **Repository in Git gesichert** (✓)
- [ ] **Deployment-Dokumentation aktuell** (✓)
- [ ] **Update-Strategie festgelegt**
  ```bash
  # Neue Version deployen:
  git pull
  gcloud builds submit --config=cloudbuild.yaml
  ```

## Fertig! 🎉

Wenn alle relevanten Punkte abgehakt sind, ist Ihre F1-Manager-Anwendung erfolgreich deployed und produktionsbereit!

**Nächste Schritte:**
1. Teilen Sie die URL mit Freunden und Testern
2. Sammeln Sie Feedback
3. Überwachen Sie die Performance
4. Deployen Sie Updates bei Bedarf

**Support:**
- Technische Fragen: GitHub Issues
- Google Cloud Hilfe: https://cloud.google.com/support
- Dokumentation: Siehe README.md und DEPLOYMENT.md

---

**Viel Erfolg mit Ihrem F1-Manager-Spiel! 🏎️💨**
