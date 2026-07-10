<?php
/**
 * Plugin Name:       PPP Toolkit
 * Plugin URI:        https://perfectpearlsandpigments.co.uk/
 * Description:        Custom Elementor widgets that recreate the Perfect Pearls & Pigments "V2" design at 1:1 fidelity — product grid, category carousel, cart drawer and sticky add-to-cart — plus the shared V2 token stylesheet.
 * Version:           1.0.0
 * Author:            Perfect Pearls & Pigments
 * Text Domain:       ppp-toolkit
 * Domain Path:       /languages
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * WC requires at least: 8.0
 *
 * @package PPP_Toolkit
 */

defined( 'ABSPATH' ) || exit;

define( 'PPP_TOOLKIT_VERSION', '1.0.0' );
define( 'PPP_TOOLKIT_FILE', __FILE__ );
define( 'PPP_TOOLKIT_PATH', plugin_dir_path( __FILE__ ) );
define( 'PPP_TOOLKIT_URL', plugin_dir_url( __FILE__ ) );

// Minimum versions required for the widgets to register.
define( 'PPP_TOOLKIT_MIN_ELEMENTOR', '3.23.0' );
define( 'PPP_TOOLKIT_MIN_PHP', '7.4' );

/**
 * Main plugin class. Boots on plugins_loaded so Elementor / WooCommerce are known.
 */
final class PPP_Toolkit {

	/** @var PPP_Toolkit|null */
	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'plugins_loaded', array( $this, 'init' ) );
	}

	/**
	 * Verify dependencies then wire everything up.
	 */
	public function init() {
		if ( ! did_action( 'elementor/loaded' ) ) {
			add_action( 'admin_notices', array( $this, 'notice_missing_elementor' ) );
			return;
		}

		if ( version_compare( ELEMENTOR_VERSION, PPP_TOOLKIT_MIN_ELEMENTOR, '<' ) ) {
			add_action( 'admin_notices', array( $this, 'notice_old_elementor' ) );
			return;
		}

		if ( version_compare( PHP_VERSION, PPP_TOOLKIT_MIN_PHP, '<' ) ) {
			add_action( 'admin_notices', array( $this, 'notice_old_php' ) );
			return;
		}

		load_plugin_textdomain( 'ppp-toolkit', false, dirname( plugin_basename( PPP_TOOLKIT_FILE ) ) . '/languages' );

		// Shared cart logic (fragments, drawer render, remove endpoint) — needs WooCommerce.
		if ( class_exists( 'WooCommerce' ) ) {
			require_once PPP_TOOLKIT_PATH . 'includes/ajax.php';
			require_once PPP_TOOLKIT_PATH . 'includes/class-cart.php';
			PPP_Toolkit_Cart::instance();
		}

		// Register Elementor category + widgets.
		require_once PPP_TOOLKIT_PATH . 'includes/class-widgets-loader.php';
		PPP_Toolkit_Widgets_Loader::instance();

		// Register (and front-end enqueue) the shared asset bundle.
		add_action( 'elementor/frontend/after_register_scripts', array( $this, 'register_assets' ) );
		add_action( 'elementor/frontend/after_register_styles', array( $this, 'register_assets' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_assets' ), 5 );

		// The header cart badge + drawer are site-wide, so load the bundle everywhere on the front end.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend' ), 20 );

		// Editor preview needs the bundle too.
		add_action( 'elementor/editor/after_enqueue_styles', array( $this, 'enqueue_editor' ) );
	}

	/**
	 * Register the single CSS + JS handles. Idempotent — safe to call from several hooks.
	 */
	public function register_assets() {
		if ( ! wp_style_is( 'ppp-toolkit', 'registered' ) ) {
			wp_register_style(
				'ppp-toolkit',
				PPP_TOOLKIT_URL . 'assets/css/ppp-toolkit.css',
				array(),
				PPP_TOOLKIT_VERSION
			);
		}

		if ( ! wp_script_is( 'ppp-toolkit', 'registered' ) ) {
			$deps = array();
			if ( wp_script_is( 'jquery', 'registered' ) ) {
				$deps[] = 'jquery';
			}
			// Woo cart fragments drive the drawer refresh + header count.
			if ( wp_script_is( 'wc-cart-fragments', 'registered' ) ) {
				$deps[] = 'wc-cart-fragments';
			}

			wp_register_script(
				'ppp-toolkit',
				PPP_TOOLKIT_URL . 'assets/js/ppp-toolkit.js',
				$deps,
				PPP_TOOLKIT_VERSION,
				true
			);

			wp_localize_script( 'ppp-toolkit', 'PPP_TOOLKIT', $this->js_config() );
		}
	}

	/**
	 * Config handed to the front-end JS.
	 *
	 * @return array
	 */
	private function js_config() {
		$checkout_url = '';
		$cart_url     = '';
		if ( function_exists( 'wc_get_checkout_url' ) ) {
			$checkout_url = wc_get_checkout_url();
			$cart_url     = wc_get_cart_url();
		}

		return array(
			'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
			'wcAjaxUrl'   => class_exists( 'WC_AJAX' ) ? WC_AJAX::get_endpoint( '%%endpoint%%' ) : '',
			'removeNonce' => wp_create_nonce( 'ppp_remove_from_cart' ),
			'checkoutUrl' => $checkout_url,
			'cartUrl'     => $cart_url,
			/**
			 * Auto-open the drawer after a successful quick-add.
			 *
			 * @param bool $auto_open
			 */
			'autoOpen'    => (bool) apply_filters( 'ppp_toolkit_auto_open_on_add', true ),
			'i18n'        => array(
				'added'  => __( 'Added ✓', 'ppp-toolkit' ),
				'adding' => __( 'Adding…', 'ppp-toolkit' ),
			),
		);
	}

	public function enqueue_frontend() {
		$this->register_assets();
		wp_enqueue_style( 'ppp-toolkit' );
		wp_enqueue_script( 'ppp-toolkit' );
	}

	public function enqueue_editor() {
		$this->register_assets();
		wp_enqueue_style( 'ppp-toolkit' );
	}

	/* ── Admin notices ─────────────────────────────────────────── */

	public function notice_missing_elementor() {
		$this->render_notice(
			sprintf(
				/* translators: %s: plugin name */
				esc_html__( '%s requires Elementor to be installed and active.', 'ppp-toolkit' ),
				'<strong>PPP Toolkit</strong>'
			)
		);
	}

	public function notice_old_elementor() {
		$this->render_notice(
			sprintf(
				/* translators: 1: plugin name, 2: required version */
				esc_html__( '%1$s requires Elementor version %2$s or greater.', 'ppp-toolkit' ),
				'<strong>PPP Toolkit</strong>',
				PPP_TOOLKIT_MIN_ELEMENTOR
			)
		);
	}

	public function notice_old_php() {
		$this->render_notice(
			sprintf(
				/* translators: 1: plugin name, 2: required version */
				esc_html__( '%1$s requires PHP version %2$s or greater.', 'ppp-toolkit' ),
				'<strong>PPP Toolkit</strong>',
				PPP_TOOLKIT_MIN_PHP
			)
		);
	}

	private function render_notice( $message ) {
		echo '<div class="notice notice-warning"><p>' . wp_kses_post( $message ) . '</p></div>';
	}
}

PPP_Toolkit::instance();
