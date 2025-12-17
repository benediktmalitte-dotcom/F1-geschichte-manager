# WordPress Integration Guide
## F1-Geschichte Manager Browser-Spiel

Dieses Dokument beschreibt, wie Sie das F1-Geschichte Manager Spiel in Ihre WordPress-Website einbinden können.

---

## 🎯 Übersicht

Das F1-Geschichte Manager Spiel ist eine vollständige Browser-basierte Anwendung, die als Single Page Application (SPA) entwickelt wurde. Sie können es auf verschiedene Arten in WordPress einbinden.

---

## 📦 Vorbereitung: Spiel bauen

### 1. Projekt bauen

```bash
npm install
npm run build
```

Dies erstellt einen `dist/` Ordner mit allen notwendigen Dateien:
- `index.html` - Die Hauptdatei
- `assets/` - JavaScript und CSS Dateien

---

## 🚀 Methode 1: Upload auf WordPress-Server (Empfohlen)

### Schritt 1: Dateien hochladen

1. Erstellen Sie einen Ordner in Ihrem WordPress-Verzeichnis:
   ```
   /wp-content/f1-manager/
   ```

2. Laden Sie den gesamten Inhalt des `dist/` Ordners in diesen Ordner hoch:
   ```
   /wp-content/f1-manager/index.html
   /wp-content/f1-manager/assets/index-XXX.js
   ```

### Schritt 2: Shortcode erstellen

Fügen Sie diesen Code in die `functions.php` Ihrer WordPress-Theme ein:

```php
<?php
// F1 Manager Shortcode
function f1_manager_game_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '800px',
        'width' => '100%'
    ), $atts);
    
    $game_url = site_url('/wp-content/f1-manager/index.html');
    
    return '<div class="f1-manager-container" style="position: relative; width: ' . esc_attr($atts['width']) . '; height: ' . esc_attr($atts['height']) . ';">
        <iframe 
            src="' . esc_url($game_url) . '" 
            style="width: 100%; height: 100%; border: none; display: block;"
            allowfullscreen
            title="F1 Geschichte Manager"
        ></iframe>
    </div>';
}
add_shortcode('f1_manager', 'f1_manager_game_shortcode');
?>
```

### Schritt 3: Shortcode verwenden

Fügen Sie diesen Shortcode in jeden WordPress-Post oder jede Seite ein:

```
[f1_manager]
```

Oder mit benutzerdefinierten Abmessungen:

```
[f1_manager height="900px" width="100%"]
```

---

## 🎨 Methode 2: Als Vollbild-Seite

### Schritt 1: Neue Seiten-Template erstellen

Erstellen Sie eine neue Datei `page-f1-manager.php` in Ihrem Theme-Ordner:

```php
<?php
/*
Template Name: F1 Manager Vollbild
*/
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php bloginfo('name'); ?> - F1 Manager</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        iframe {
            width: 100%;
            height: 100vh;
            border: none;
            display: block;
        }
    </style>
</head>
<body>
    <iframe src="<?php echo site_url('/wp-content/f1-manager/index.html'); ?>" allowfullscreen></iframe>
</body>
</html>
```

### Schritt 2: Seite erstellen

1. Erstellen Sie eine neue Seite in WordPress
2. Wählen Sie das Template "F1 Manager Vollbild"
3. Veröffentlichen Sie die Seite

---

## 🔧 Methode 3: Als WordPress-Plugin

### Plugin erstellen

Erstellen Sie einen Ordner `/wp-content/plugins/f1-manager/` mit folgender Struktur:

```
f1-manager/
├── f1-manager.php
└── game/
    ├── index.html
    └── assets/
```

`f1-manager.php`:

```php
<?php
/**
 * Plugin Name: F1 Geschichte Manager
 * Plugin URI: https://formel1-geschichte.de
 * Description: Motorsport Management Simulation für WordPress
 * Version: 1.0.0
 * Author: Formel1-Geschichte.de
 * License: GPL-2.0+
 */

// Verhindere direkten Zugriff
if (!defined('ABSPATH')) exit;

// Shortcode registrieren
function f1_manager_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '800px',
        'width' => '100%'
    ), $atts);
    
    $game_url = plugins_url('game/index.html', __FILE__);
    
    ob_start();
    ?>
    <div class="f1-manager-wrapper" style="width: <?php echo esc_attr($atts['width']); ?>; height: <?php echo esc_attr($atts['height']); ?>; position: relative;">
        <iframe 
            src="<?php echo esc_url($game_url); ?>"
            style="width: 100%; height: 100%; border: none; display: block;"
            allowfullscreen
            title="F1 Geschichte Manager"
        ></iframe>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('f1_manager', 'f1_manager_shortcode');

// Admin-Menü hinzufügen
function f1_manager_admin_menu() {
    add_menu_page(
        'F1 Manager',
        'F1 Manager',
        'manage_options',
        'f1-manager',
        'f1_manager_settings_page',
        'dashicons-games',
        30
    );
}
add_action('admin_menu', 'f1_manager_admin_menu');

function f1_manager_settings_page() {
    ?>
    <div class="wrap">
        <h1>F1 Geschichte Manager</h1>
        <div class="card">
            <h2>Verwendung</h2>
            <p>Fügen Sie diesen Shortcode in einen Post oder eine Seite ein:</p>
            <code>[f1_manager]</code>
            <h3>Optionen</h3>
            <ul>
                <li><code>[f1_manager height="900px"]</code> - Benutzerdefinierte Höhe</li>
                <li><code>[f1_manager width="1200px"]</code> - Benutzerdefinierte Breite</li>
            </ul>
        </div>
    </div>
    <?php
}
?>
```

---

## 📱 Responsive Design

Das Spiel ist bereits für mobile Geräte optimiert. Empfohlene Mindest-Container-Größen:

- **Desktop**: 1200px × 800px
- **Tablet**: 768px × 600px
- **Mobile**: 100% × 600px

---

## 🎮 Hinweise zur Einbettung

### Speicherung

Das Spiel verwendet `localStorage` zum Speichern des Spielstands. Stellen Sie sicher, dass:
- Ihr Browser Cookies und localStorage erlaubt
- Die Domain konsistent ist (nicht zwischen www und nicht-www wechseln)

### Performance

- Das Spiel lädt ca. 200KB JavaScript
- Tailwind CSS wird über CDN geladen
- React wird über ESM.sh CDN geladen
- Keine Server-seitige Verarbeitung erforderlich

### Sicherheit

Das Spiel:
- Sendet keine Daten an externe Server
- Speichert Daten nur lokal im Browser
- Benötigt keine API-Schlüssel oder Authentifizierung

---

## 🔍 Troubleshooting

### Problem: Spiel wird nicht angezeigt

**Lösung**: Überprüfen Sie die Browser-Konsole auf Fehler. Häufige Ursachen:
- Falsche Dateipfade
- CORS-Fehler (verwenden Sie relativen Upload, nicht externe URLs)
- Ad-Blocker blockiert CDN-Ressourcen

### Problem: Spielstand wird nicht gespeichert

**Lösung**: 
- Stellen Sie sicher, dass localStorage aktiviert ist
- Prüfen Sie, ob die URL konsistent bleibt
- Löschen Sie keine Browser-Daten zwischen Sitzungen

### Problem: Spiel ist zu klein/groß

**Lösung**: Passen Sie die `height` und `width` Parameter im Shortcode an:
```
[f1_manager height="1000px" width="100%"]
```

---

## 🚀 Erweiterte Konfiguration

### Eigenes Styling

Sie können zusätzliches CSS hinzufügen, um die Einbettung anzupassen:

```css
.f1-manager-container {
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    border-radius: 8px;
    overflow: hidden;
}

.f1-manager-container iframe {
    border-radius: 8px;
}
```

### Gutenberg Block (Optional)

Für erweiterte Integration können Sie einen Gutenberg-Block erstellen. Fügen Sie dies zu Ihrem Plugin hinzu:

```php
function f1_manager_register_block() {
    register_block_type('f1-manager/game', array(
        'render_callback' => 'f1_manager_shortcode'
    ));
}
add_action('init', 'f1_manager_register_block');
```

---

## 📞 Support

Bei Fragen oder Problemen:
- Website: https://formel1-geschichte.de
- Repository: https://github.com/benediktmalitte-dotcom/F1-geschichte-manager

---

## ✅ Checkliste

- [ ] Spiel gebaut (`npm run build`)
- [ ] Dateien in `/wp-content/f1-manager/` hochgeladen
- [ ] Shortcode in `functions.php` hinzugefügt
- [ ] Testseite erstellt
- [ ] Spiel getestet (Desktop)
- [ ] Spiel getestet (Mobile)
- [ ] Spielstand-Speicherung getestet

---

*Viel Erfolg mit Ihrem F1 Geschichte Manager!* 🏎️🏁
