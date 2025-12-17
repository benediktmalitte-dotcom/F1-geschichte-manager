# Quick Start - WordPress Integration

Schnellstart-Anleitung um das F1-Manager Spiel in WordPress einzubinden.

## 🚀 In 5 Minuten live!

### 1️⃣ Projekt bauen
```bash
npm install
npm run build
```

### 2️⃣ Dateien hochladen
- Erstelle Ordner: `/wp-content/f1-manager/`
- Lade Inhalt von `dist/` dort hoch

### 3️⃣ Shortcode hinzufügen
Füge in `functions.php` ein:
```php
function f1_manager_game_shortcode($atts) {
    $atts = shortcode_atts(array('height' => '800px', 'width' => '100%'), $atts);
    $game_url = site_url('/wp-content/f1-manager/index.html');
    return '<iframe src="' . esc_url($game_url) . '" style="width: ' . esc_attr($atts['width']) . '; height: ' . esc_attr($atts['height']) . '; border: none;" allowfullscreen></iframe>';
}
add_shortcode('f1_manager', 'f1_manager_game_shortcode');
```

### 4️⃣ Shortcode verwenden
In jedem Post/Seite:
```
[f1_manager]
```

## 📚 Weitere Dokumentation

- **[WORDPRESS_INTEGRATION.md](WORDPRESS_INTEGRATION.md)** - Vollständige Integration-Anleitung
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Schritt-für-Schritt Deployment
- **[README.md](README.md)** - Projekt-Übersicht

## 🎮 Features

✅ Vollständig browser-basiert  
✅ Keine Backend-Anforderungen  
✅ LocalStorage für Spielstände  
✅ Responsive Design  
✅ Einfache WordPress-Integration  

## 🛠️ Optionen

```
[f1_manager height="900px"]        # Höhe anpassen
[f1_manager width="1200px"]        # Breite anpassen
[f1_manager height="100vh"]        # Vollbild-Höhe
```

## ⚡ Alternative: Als Plugin

1. Verwende `wordpress-plugin-template.php` als Basis
2. Erstelle Plugin-Struktur in `/wp-content/plugins/f1-manager/`
3. Kopiere Spiel nach `game/` Unterordner
4. Aktiviere Plugin in WordPress

---

**Ready to race!** 🏎️🏁
