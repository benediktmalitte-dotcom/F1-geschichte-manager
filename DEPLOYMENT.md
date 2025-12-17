# Deployment-Anleitung für WordPress

Diese Anleitung zeigt Ihnen, wie Sie das F1-Geschichte Manager Spiel auf Ihrer WordPress-Website bereitstellen.

---

## 📋 Voraussetzungen

- WordPress-Website mit Admin-Zugriff
- FTP/SFTP-Zugang oder Zugriff auf das Hosting-Control-Panel
- Node.js (nur für den Build-Prozess)

---

## 🔨 Schritt 1: Projekt bauen

1. Navigieren Sie zum Projekt-Verzeichnis:
   ```bash
   cd /pfad/zum/F1-geschichte-manager
   ```

2. Installieren Sie die Abhängigkeiten (falls noch nicht geschehen):
   ```bash
   npm install
   ```

3. Bauen Sie das Projekt:
   ```bash
   npm run build
   ```

4. Der `dist/` Ordner enthält nun alle Dateien für die Bereitstellung:
   ```
   dist/
   ├── index.html
   └── assets/
       └── index-[hash].js
   ```

---

## 🚀 Schritt 2: Dateien hochladen

### Option A: Via FTP/SFTP (Empfohlen)

1. Verbinden Sie sich mit Ihrem WordPress-Server via FTP/SFTP

2. Navigieren Sie zum WordPress-Verzeichnis:
   ```
   /public_html/wp-content/
   ```

3. Erstellen Sie einen neuen Ordner:
   ```
   /public_html/wp-content/f1-manager/
   ```

4. Laden Sie **alle Dateien** aus dem `dist/` Ordner in diesen Ordner hoch:
   ```
   /public_html/wp-content/f1-manager/index.html
   /public_html/wp-content/f1-manager/assets/index-[hash].js
   ```

### Option B: Via WordPress Media-Library (Nicht empfohlen)

Die Media-Library ist für diese Dateien nicht geeignet, da JavaScript-Dateien möglicherweise nicht korrekt verarbeitet werden.

### Option C: Via Hosting Control Panel

1. Loggen Sie sich in Ihr Hosting Control Panel ein (z.B. cPanel, Plesk)
2. Verwenden Sie den Datei-Manager
3. Navigieren Sie zu `/public_html/wp-content/`
4. Erstellen Sie den Ordner `f1-manager`
5. Laden Sie die Dateien aus `dist/` hoch

---

## 🔧 Schritt 3: Shortcode einrichten

### Methode A: Via functions.php

1. Öffnen Sie das WordPress-Dashboard
2. Gehen Sie zu **Design** → **Theme-Editor**
3. Öffnen Sie die Datei `functions.php`
4. Fügen Sie am Ende der Datei folgenden Code ein:

```php
<?php
/**
 * F1 Manager Shortcode
 */
function f1_manager_game_shortcode($atts) {
    // Standard-Attribute
    $atts = shortcode_atts(array(
        'height' => '800px',
        'width' => '100%',
        'border' => 'none',
    ), $atts);
    
    // URL zum Spiel
    $game_url = site_url('/wp-content/f1-manager/index.html');
    
    // HTML ausgeben
    $output = '<div class="f1-manager-container" style="width: ' . esc_attr($atts['width']) . '; height: ' . esc_attr($atts['height']) . '; position: relative; margin: 20px auto;">';
    $output .= '<iframe src="' . esc_url($game_url) . '" ';
    $output .= 'style="width: 100%; height: 100%; border: ' . esc_attr($atts['border']) . '; display: block; border-radius: 8px;" ';
    $output .= 'allowfullscreen title="F1 Geschichte Manager">';
    $output .= '</iframe>';
    $output .= '</div>';
    
    return $output;
}
add_shortcode('f1_manager', 'f1_manager_game_shortcode');
?>
```

5. Klicken Sie auf **Datei aktualisieren**

### Methode B: Als Plugin (Professioneller)

1. Laden Sie die Datei `wordpress-plugin-template.php` herunter
2. Benennen Sie sie um in `f1-manager.php`
3. Erstellen Sie die folgende Ordnerstruktur auf Ihrem Server:
   ```
   /wp-content/plugins/f1-manager/
   ├── f1-manager.php
   └── game/
       ├── index.html
       └── assets/
           └── index-[hash].js
   ```
4. Loggen Sie sich ins WordPress-Dashboard ein
5. Gehen Sie zu **Plugins** → **Installierte Plugins**
6. Aktivieren Sie "F1 Geschichte Manager"

---

## 📝 Schritt 4: Spiel einbinden

### Neue Seite erstellen

1. Gehen Sie zu **Seiten** → **Erstellen**
2. Geben Sie der Seite einen Titel, z.B. "F1 Manager"
3. Fügen Sie den Shortcode ein:
   ```
   [f1_manager]
   ```
4. Klicken Sie auf **Veröffentlichen**

### Benutzerdefinierte Optionen

Sie können die Größe anpassen:

```
[f1_manager height="900px" width="100%"]
```

Oder einen Rahmen hinzufügen:

```
[f1_manager border="2px solid #e10600"]
```

---

## ✅ Schritt 5: Testen

1. Öffnen Sie die veröffentlichte Seite in einem neuen Browser-Tab
2. Das Spiel sollte geladen werden und funktionieren
3. Testen Sie:
   - ✅ Spielstart und Namenseingabe
   - ✅ Teamauswahl
   - ✅ Navigation im Spiel
   - ✅ Responsive Design (Mobile-Ansicht)
   - ✅ Spielstand-Speicherung (Seite neu laden)

---

## 🛠️ Troubleshooting

### Problem: Weißer Bildschirm / Spiel lädt nicht

**Mögliche Ursachen:**
1. Falsche Dateipfade
2. Dateien nicht korrekt hochgeladen
3. JavaScript-Fehler

**Lösung:**
1. Öffnen Sie die Browser-Konsole (F12 → Console)
2. Suchen Sie nach Fehler-Meldungen
3. Überprüfen Sie, ob alle Dateien korrekt hochgeladen wurden:
   - Öffnen Sie direkt: `https://ihre-domain.de/wp-content/f1-manager/index.html`
   - Funktioniert das? → Shortcode-Problem
   - Funktioniert das nicht? → Datei-Upload-Problem

### Problem: 404-Fehler für JavaScript-Dateien

**Lösung:**
1. Stellen Sie sicher, dass der `assets/` Ordner korrekt hochgeladen wurde
2. Überprüfen Sie die Dateistruktur:
   ```
   f1-manager/
   ├── index.html
   └── assets/
       └── index-[hash].js
   ```
3. Die Hash-Nummer im Dateinamen ändert sich bei jedem Build

### Problem: Spiel funktioniert direkt, aber nicht im Shortcode

**Lösung:**
1. Überprüfen Sie die URL im Shortcode-Code
2. Stellen Sie sicher, dass `site_url()` die korrekte Domain zurückgibt
3. Testen Sie mit einer absoluten URL:
   ```php
   $game_url = 'https://ihre-domain.de/wp-content/f1-manager/index.html';
   ```

### Problem: Spielstand wird nicht gespeichert

**Ursachen:**
- LocalStorage ist deaktiviert
- Browser im Inkognito-Modus
- Browser-Erweiterungen blockieren LocalStorage

**Lösung:**
1. Aktivieren Sie LocalStorage im Browser
2. Deaktivieren Sie den Inkognito-Modus
3. Testen Sie mit einem anderen Browser

### Problem: Spiel zu klein/groß auf Mobile

**Lösung:**
Fügen Sie responsive CSS hinzu (in Customizer oder Theme-CSS):

```css
@media (max-width: 768px) {
    .f1-manager-container {
        height: 600px !important;
    }
}

@media (max-width: 480px) {
    .f1-manager-container {
        height: 500px !important;
    }
}
```

---

## 🔄 Updates durchführen

Wenn Sie das Spiel aktualisieren möchten:

1. Führen Sie erneut `npm run build` aus
2. Laden Sie die neuen Dateien aus `dist/` hoch
3. **Wichtig:** Überschreiben Sie die alten Dateien
4. Leeren Sie den Browser-Cache oder testen Sie im Inkognito-Modus

---

## 🔒 Sicherheitshinweise

✅ **Sicher:**
- Das Spiel sendet keine Daten an externe Server
- Alle Spielstände werden lokal im Browser gespeichert
- Keine Datenbank-Verbindung erforderlich
- Keine API-Keys notwendig

⚠️ **Beachten Sie:**
- Stellen Sie sicher, dass Ihr WordPress up-to-date ist
- Verwenden Sie HTTPS für Ihre Website
- Regelmäßige Backups durchführen

---

## 📊 Performance-Optimierung

### Caching

Fügen Sie diese Zeilen zu Ihrer `.htaccess` hinzu (optional):

```apache
# Cache für F1 Manager Dateien
<IfModule mod_expires.c>
    <FilesMatch "\.(js|css|html)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 month"
    </FilesMatch>
</IfModule>
```

### CDN (Optional)

Für bessere Performance können Sie die Dateien auf ein CDN hochladen (z.B. Cloudflare, BunnyCDN).

---

## 📞 Support

Bei Problemen:
1. Überprüfen Sie die Browser-Konsole
2. Testen Sie das Spiel direkt (ohne WordPress)
3. Kontaktieren Sie Ihren Hosting-Provider bei Server-Problemen

---

## 📝 Checkliste

- [ ] Projekt gebaut (`npm run build`)
- [ ] Dateien nach `/wp-content/f1-manager/` hochgeladen
- [ ] Shortcode in `functions.php` oder als Plugin installiert
- [ ] Seite erstellt und Shortcode eingefügt
- [ ] Seite veröffentlicht
- [ ] Desktop-Browser getestet
- [ ] Mobile-Browser getestet
- [ ] Spielstand-Speicherung getestet
- [ ] Performance überprüft

---

✅ **Fertig!** Ihr F1 Manager ist jetzt live auf WordPress! 🏎️🏁
