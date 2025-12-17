<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# F1 Geschichte Manager - Browser-Spiel

Ein vollständiges Formel-1-Management-Spiel, das als Browser-basierte Anwendung läuft und einfach in WordPress-Websites eingebunden werden kann.

## 🎮 Features

- **Vollständiges Management-Erlebnis**: Fahrer, Teams, Rennen, Entwicklung
- **Browser-basiert**: Keine Installation erforderlich
- **WordPress-kompatibel**: Einfache Integration als iframe oder Plugin
- **Responsive Design**: Funktioniert auf Desktop, Tablet und Mobile
- **Offline-Speicherung**: Spielstände werden im Browser gespeichert
- **Historische Saisons**: Spiele Formel-1-Saisons ab 1996

## 🚀 Schnellstart

### Lokal ausführen

**Voraussetzungen:** Node.js

1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

2. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

3. Browser öffnen: `http://localhost:3000`

### Für Produktion bauen

```bash
npm run build
```

Die fertigen Dateien befinden sich im `dist/` Ordner und können direkt auf einen Webserver hochgeladen werden.

## 📦 WordPress Integration

Das Spiel wurde speziell für die Einbindung in WordPress-Websites optimiert. 

### Schnellintegration

1. Baue das Projekt:
   ```bash
   npm run build
   ```

2. Lade den `dist/` Ordner-Inhalt nach `/wp-content/f1-manager/` hoch

3. Füge diesen Shortcode in deine WordPress-Seite ein:
   ```
   [f1_manager]
   ```

### Ausführliche Anleitung

Siehe **[WORDPRESS_INTEGRATION.md](WORDPRESS_INTEGRATION.md)** für:
- ✅ Schritt-für-Schritt Anleitung
- ✅ Drei verschiedene Integrationsmethoden
- ✅ Shortcode-Beispiele
- ✅ Plugin-Template
- ✅ Troubleshooting-Tipps

### Embedding Demo

Öffne `embed-example.html` im Browser, um ein Beispiel der Einbettung zu sehen.

## 🛠️ Technologie-Stack

- **React 19** - UI Framework
- **TypeScript** - Type-sicherer Code
- **Vite** - Build-Tool und Dev-Server
- **Tailwind CSS** - Styling (via CDN)
- **LocalStorage API** - Spielstand-Speicherung

## 📱 Browser-Kompatibilität

- ✅ Chrome/Edge (neueste Versionen)
- ✅ Firefox (neueste Versionen)
- ✅ Safari (neueste Versionen)
- ✅ Mobile Browser (iOS/Android)

## 🎯 Verwendung

1. **Teamauswahl**: Wähle dein Rennteam zu Beginn der Karriere
2. **Management**: Verwalte Fahrer, Entwicklung und Budget
3. **Rennen**: Nimm an Rennwochenenden teil und sammle Punkte
4. **Entwicklung**: Verbessere dein Auto durch Entwicklung
5. **Transfers**: Kaufe und verkaufe Fahrer auf dem Transfermarkt

## 📄 Lizenz

Siehe LICENSE-Datei für Details.

## 🔗 Links

- **Live Demo**: [Wird bereitgestellt]
- **WordPress Integration**: [WORDPRESS_INTEGRATION.md](WORDPRESS_INTEGRATION.md)
- **Embed Beispiel**: [embed-example.html](embed-example.html)

## 🤝 Beitragen

Beiträge sind willkommen! Bitte öffne ein Issue oder Pull Request.

---

*Entwickelt für Formel1-Geschichte.de* 🏎️🏁
