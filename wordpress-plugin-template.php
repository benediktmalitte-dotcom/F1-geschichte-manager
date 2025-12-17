<?php
/**
 * Plugin Name: F1 Geschichte Manager
 * Plugin URI: https://formel1-geschichte.de
 * Description: Motorsport Management Simulation - Ein vollständiges F1-Manager-Spiel für WordPress
 * Version: 1.0.0
 * Author: Formel1-Geschichte.de
 * Author URI: https://formel1-geschichte.de
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: f1-manager
 * Domain Path: /languages
 */

// Verhindere direkten Zugriff
if (!defined('ABSPATH')) {
    exit;
}

// Plugin-Konstanten definieren
define('F1_MANAGER_VERSION', '1.0.0');
define('F1_MANAGER_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('F1_MANAGER_PLUGIN_URL', plugin_dir_url(__FILE__));
define('F1_MANAGER_GAME_DIR', F1_MANAGER_PLUGIN_DIR . 'game/');
define('F1_MANAGER_GAME_URL', F1_MANAGER_PLUGIN_URL . 'game/');

/**
 * Hauptklasse für das F1 Manager Plugin
 */
class F1_Manager_Plugin {
    
    /**
     * Singleton-Instanz
     */
    private static $instance = null;
    
    /**
     * Gibt die Singleton-Instanz zurück
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Konstruktor
     */
    private function __construct() {
        $this->init_hooks();
    }
    
    /**
     * Initialisiert WordPress-Hooks
     */
    private function init_hooks() {
        // Shortcode registrieren
        add_shortcode('f1_manager', array($this, 'shortcode_handler'));
        
        // Admin-Menü hinzufügen
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // Settings registrieren
        add_action('admin_init', array($this, 'register_settings'));
        
        // Plugin-Links in der Plugin-Liste
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), array($this, 'add_plugin_links'));
    }
    
    /**
     * Shortcode-Handler für [f1_manager]
     */
    public function shortcode_handler($atts) {
        // Standard-Attribute
        $atts = shortcode_atts(array(
            'height' => get_option('f1_manager_height', '800px'),
            'width' => get_option('f1_manager_width', '100%'),
            'border' => get_option('f1_manager_border', 'none'),
            'shadow' => get_option('f1_manager_shadow', 'true'),
        ), $atts, 'f1_manager');
        
        // Spiel-URL
        $game_url = F1_MANAGER_GAME_URL . 'index.html';
        
        // Zusätzliche Styles basierend auf Optionen
        $additional_styles = '';
        if ($atts['shadow'] === 'true') {
            $additional_styles .= 'box-shadow: 0 10px 40px rgba(0,0,0,0.3); border-radius: 8px;';
        }
        
        // HTML generieren
        ob_start();
        ?>
        <div class="f1-manager-wrapper" style="width: <?php echo esc_attr($atts['width']); ?>; height: <?php echo esc_attr($atts['height']); ?>; position: relative; margin: 20px auto; <?php echo esc_attr($additional_styles); ?>">
            <iframe 
                src="<?php echo esc_url($game_url); ?>"
                style="width: 100%; height: 100%; border: <?php echo esc_attr($atts['border']); ?>; display: block; border-radius: inherit;"
                allowfullscreen
                allow="fullscreen"
                title="F1 Geschichte Manager"
                loading="lazy"
            ></iframe>
        </div>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Fügt Admin-Menü hinzu
     */
    public function add_admin_menu() {
        add_menu_page(
            'F1 Manager',                    // Seitentitel
            'F1 Manager',                    // Menütitel
            'manage_options',                // Berechtigung
            'f1-manager',                    // Slug
            array($this, 'settings_page'),   // Callback
            'dashicons-flag',                // Icon
            30                               // Position
        );
    }
    
    /**
     * Registriert Plugin-Einstellungen
     */
    public function register_settings() {
        register_setting('f1_manager_settings', 'f1_manager_height');
        register_setting('f1_manager_settings', 'f1_manager_width');
        register_setting('f1_manager_settings', 'f1_manager_border');
        register_setting('f1_manager_settings', 'f1_manager_shadow');
    }
    
    /**
     * Einstellungsseite
     */
    public function settings_page() {
        // Prüfe ob Game-Dateien existieren
        $game_exists = file_exists(F1_MANAGER_GAME_DIR . 'index.html');
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            
            <?php if (!$game_exists): ?>
            <div class="notice notice-error">
                <p>
                    <strong>⚠️ Spieledateien nicht gefunden!</strong><br>
                    Bitte laden Sie den Inhalt des <code>dist/</code> Ordners in das Verzeichnis 
                    <code><?php echo esc_html(F1_MANAGER_GAME_DIR); ?></code> hoch.
                </p>
            </div>
            <?php endif; ?>
            
            <div class="card" style="max-width: 800px; margin-top: 20px;">
                <h2>📝 Verwendung</h2>
                <p>Fügen Sie diesen Shortcode in einen Post oder eine Seite ein:</p>
                <code style="background: #f0f0f0; padding: 10px; display: block; margin: 10px 0; font-size: 14px;">[f1_manager]</code>
                
                <h3 style="margin-top: 20px;">🎨 Optionen</h3>
                <ul style="line-height: 2;">
                    <li><code>[f1_manager height="900px"]</code> - Benutzerdefinierte Höhe</li>
                    <li><code>[f1_manager width="1200px"]</code> - Benutzerdefinierte Breite</li>
                    <li><code>[f1_manager shadow="false"]</code> - Schatten deaktivieren</li>
                    <li><code>[f1_manager border="1px solid #ccc"]</code> - Rahmen hinzufügen</li>
                </ul>
                
                <h3 style="margin-top: 20px;">⚙️ Standard-Einstellungen</h3>
                <form method="post" action="options.php">
                    <?php settings_fields('f1_manager_settings'); ?>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Standard-Höhe</th>
                            <td>
                                <input type="text" name="f1_manager_height" value="<?php echo esc_attr(get_option('f1_manager_height', '800px')); ?>" class="regular-text" />
                                <p class="description">z.B. 800px, 90vh</p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Standard-Breite</th>
                            <td>
                                <input type="text" name="f1_manager_width" value="<?php echo esc_attr(get_option('f1_manager_width', '100%')); ?>" class="regular-text" />
                                <p class="description">z.B. 100%, 1200px</p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Schatten anzeigen</th>
                            <td>
                                <input type="checkbox" name="f1_manager_shadow" value="true" <?php checked(get_option('f1_manager_shadow', 'true'), 'true'); ?> />
                                <p class="description">Fügt einen Schatten um das Spiel hinzu</p>
                            </td>
                        </tr>
                    </table>
                    <?php submit_button('Einstellungen speichern'); ?>
                </form>
            </div>
            
            <div class="card" style="max-width: 800px; margin-top: 20px;">
                <h2>📊 System-Info</h2>
                <table class="widefat">
                    <tbody>
                        <tr>
                            <td><strong>Plugin-Version</strong></td>
                            <td><?php echo esc_html(F1_MANAGER_VERSION); ?></td>
                        </tr>
                        <tr>
                            <td><strong>Spiel-Verzeichnis</strong></td>
                            <td><code><?php echo esc_html(F1_MANAGER_GAME_DIR); ?></code></td>
                        </tr>
                        <tr>
                            <td><strong>Spiel-URL</strong></td>
                            <td><code><?php echo esc_html(F1_MANAGER_GAME_URL); ?></code></td>
                        </tr>
                        <tr>
                            <td><strong>Spieledateien vorhanden</strong></td>
                            <td><?php echo $game_exists ? '✅ Ja' : '❌ Nein'; ?></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="card" style="max-width: 800px; margin-top: 20px;">
                <h2>🚀 Installation</h2>
                <ol style="line-height: 2;">
                    <li>Baue das Projekt: <code>npm run build</code></li>
                    <li>Lade den Inhalt des <code>dist/</code> Ordners in <code><?php echo esc_html(F1_MANAGER_GAME_DIR); ?></code> hoch</li>
                    <li>Erstelle eine neue Seite in WordPress</li>
                    <li>Füge den Shortcode <code>[f1_manager]</code> ein</li>
                    <li>Veröffentliche die Seite</li>
                </ol>
            </div>
            
            <div class="card" style="max-width: 800px; margin-top: 20px;">
                <h2>ℹ️ Über das Spiel</h2>
                <p>
                    <strong>F1 Geschichte Manager</strong> ist ein vollständiges Motorsport-Management-Spiel,
                    das komplett im Browser läuft. Es speichert Spielstände lokal im Browser und benötigt
                    keine Server-seitige Verarbeitung.
                </p>
                <p style="margin-top: 15px;">
                    <strong>Features:</strong>
                </p>
                <ul style="line-height: 1.8;">
                    <li>✅ Vollständige Teamverwaltung</li>
                    <li>✅ Fahrer-Transfers</li>
                    <li>✅ Auto-Entwicklung</li>
                    <li>✅ Historische F1-Saisons</li>
                    <li>✅ Responsive Design</li>
                    <li>✅ Offline-Spielstand-Speicherung</li>
                </ul>
            </div>
        </div>
        <?php
    }
    
    /**
     * Fügt Plugin-Links hinzu
     */
    public function add_plugin_links($links) {
        $settings_link = '<a href="admin.php?page=f1-manager">Einstellungen</a>';
        array_unshift($links, $settings_link);
        return $links;
    }
}

/**
 * Initialisiere das Plugin
 */
function f1_manager_init() {
    return F1_Manager_Plugin::get_instance();
}

// Plugin starten
add_action('plugins_loaded', 'f1_manager_init');

/**
 * Aktivierungs-Hook
 */
function f1_manager_activate() {
    // Standard-Optionen setzen
    add_option('f1_manager_height', '800px');
    add_option('f1_manager_width', '100%');
    add_option('f1_manager_border', 'none');
    add_option('f1_manager_shadow', 'true');
}
register_activation_hook(__FILE__, 'f1_manager_activate');

/**
 * Deaktivierungs-Hook
 */
function f1_manager_deactivate() {
    // Optional: Cleanup-Code hier
}
register_deactivation_hook(__FILE__, 'f1_manager_deactivate');
