<?php
/**
 * Cart drawer rendering + WooCommerce cart fragments.
 *
 * The drawer markup is emitted once per request (guarded), either by the
 * Cart_Drawer widget where it is placed, or auto-injected into wp_footer.
 * Its dynamic inner content and the header count badge are registered as
 * Woo cart fragments so they refresh on every add/remove without a reload.
 *
 * @package PPP_Toolkit
 */

defined( 'ABSPATH' ) || exit;

class PPP_Toolkit_Cart {

	/** @var self|null */
	private static $instance = null;

	/** @var bool Guards against rendering the drawer twice. */
	private static $drawer_rendered = false;

	/** @var array Drawer options captured from the widget (or defaults). */
	private static $drawer_opts = array();

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_filter( 'woocommerce_add_to_cart_fragments', array( $this, 'cart_fragments' ) );
		// Auto-inject the drawer late in the footer if no widget rendered it.
		add_action( 'wp_footer', array( $this, 'maybe_auto_inject' ), 100 );
	}

	/* ── Public render API ─────────────────────────────────────── */

	/**
	 * Render the drawer once. Later calls are no-ops.
	 *
	 * @param array $opts { accent, radius, checkout_target, shipping_note }.
	 */
	public static function render_drawer( $opts = array() ) {
		if ( self::$drawer_rendered ) {
			return;
		}
		self::$drawer_rendered = true;

		self::$drawer_opts = wp_parse_args(
			$opts,
			array(
				'accent'          => '#F69311',
				'radius'          => 16,
				'checkout_target' => 'checkout',
				'shipping_note'   => '',
			)
		);

		$o = self::$drawer_opts;

		$style = sprintf( '--ppp-acc:%s;--ppp-drawer-r:%dpx;', esc_attr( $o['accent'] ), (int) $o['radius'] );
		$count = self::get_count();
		?>
		<div class="ppp-drawer-overlay" data-ppp-cart-close hidden></div>
		<aside class="ppp-cart-drawer" style="<?php echo esc_attr( $style ); ?>"
			role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Shopping basket', 'ppp-toolkit' ); ?>"
			aria-hidden="true" tabindex="-1" hidden>
			<div class="ppp-cart-drawer__inner ppp-drawer-fragment">
				<?php echo self::get_drawer_inner( self::$drawer_opts ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built with esc_* internally. ?>
			</div>
		</aside>
		<?php
	}

	public static function is_rendered() {
		return self::$drawer_rendered;
	}

	/**
	 * Fallback injection so the drawer always exists site-wide.
	 */
	public function maybe_auto_inject() {
		/**
		 * Toggle auto-injecting the cart drawer when no widget placed one.
		 *
		 * @param bool $auto
		 */
		if ( self::$drawer_rendered || ! apply_filters( 'ppp_toolkit_auto_inject_drawer', true ) ) {
			return;
		}
		self::render_drawer();
	}

	/* ── Fragments ─────────────────────────────────────────────── */

	/**
	 * Supply the refreshed drawer body + header count badge to Woo.
	 *
	 * @param array $fragments
	 * @return array
	 */
	public function cart_fragments( $fragments ) {
		$opts = self::$drawer_opts ? self::$drawer_opts : array();

		ob_start();
		echo self::get_drawer_inner( $opts ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		$fragments['.ppp-drawer-fragment'] = '<div class="ppp-cart-drawer__inner ppp-drawer-fragment">' . ob_get_clean() . '</div>';

		$fragments['.ppp-cart-count'] = self::get_count_badge();

		return $fragments;
	}

	/* ── Building blocks ───────────────────────────────────────── */

	public static function get_count() {
		return ( function_exists( 'WC' ) && WC()->cart ) ? WC()->cart->get_cart_contents_count() : 0;
	}

	/**
	 * The header cart count badge (hidden when empty).
	 *
	 * @return string
	 */
	public static function get_count_badge() {
		$count = self::get_count();
		return sprintf(
			'<span class="ppp-cart-count%s" aria-hidden="%s">%s</span>',
			$count > 0 ? '' : ' ppp-cart-count--empty',
			$count > 0 ? 'false' : 'true',
			esc_html( $count )
		);
	}

	/**
	 * Drawer inner markup (header, item list, footer). Used for both the
	 * initial render and the fragment refresh.
	 *
	 * @param array $opts
	 * @return string
	 */
	public static function get_drawer_inner( $opts = array() ) {
		$opts = wp_parse_args(
			$opts,
			array(
				'accent'          => '#F69311',
				'checkout_target' => 'checkout',
				'shipping_note'   => '',
			)
		);

		if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
			return '';
		}

		$cart  = WC()->cart;
		$count = $cart->get_cart_contents_count();

		ob_start();
		?>
		<div class="ppp-cart-drawer__head">
			<div>
				<div class="ppp-cart-drawer__title"><?php esc_html_e( 'Your basket', 'ppp-toolkit' ); ?></div>
				<div class="ppp-cart-drawer__count">
					<?php
					/* translators: %s: number of items */
					echo esc_html( sprintf( _n( '%s item', '%s items', $count, 'ppp-toolkit' ), number_format_i18n( $count ) ) );
					?>
				</div>
			</div>
			<button type="button" class="ppp-cart-drawer__close" data-ppp-cart-close aria-label="<?php esc_attr_e( 'Close basket', 'ppp-toolkit' ); ?>">&#10005;</button>
		</div>

		<div class="ppp-cart-drawer__body">
			<?php if ( $cart->is_empty() ) : ?>
				<div class="ppp-cart-drawer__empty">
					<div class="ppp-cart-drawer__empty-glyph" aria-hidden="true">&#9678;</div>
					<p><?php esc_html_e( 'Your basket is empty', 'ppp-toolkit' ); ?></p>
				</div>
			<?php else : ?>
				<div class="ppp-cart-drawer__items">
					<?php
					foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
						$product = $cart_item['data'];
						if ( ! $product || ! $product->exists() || $cart_item['quantity'] <= 0 ) {
							continue;
						}
						$thumb = $product->get_image( 'woocommerce_thumbnail', array( 'class' => 'ppp-cart-item__img', 'alt' => '' ) );
						$name  = $product->get_name();
						$price = wc_price( $cart->get_product_subtotal( $product, $cart_item['quantity'] ) );
						?>
						<div class="ppp-cart-item" data-key="<?php echo esc_attr( $cart_item_key ); ?>">
							<div class="ppp-cart-item__thumb"><?php echo wp_kses_post( $thumb ); ?></div>
							<div class="ppp-cart-item__meta">
								<div class="ppp-cart-item__name">
									<?php echo $cart_item['quantity'] > 1 ? esc_html( $cart_item['quantity'] . '× ' ) : ''; ?>
									<?php echo esc_html( $name ); ?>
								</div>
								<div class="ppp-cart-item__price"><?php echo wp_kses_post( $price ); ?></div>
							</div>
							<button type="button" class="ppp-cart-item__remove" data-ppp-remove="<?php echo esc_attr( $cart_item_key ); ?>" aria-label="<?php esc_attr_e( 'Remove item', 'ppp-toolkit' ); ?>">&#10005;</button>
						</div>
						<?php
					}
					?>
				</div>
			<?php endif; ?>
		</div>

		<?php if ( ! $cart->is_empty() ) : ?>
			<div class="ppp-cart-drawer__foot">
				<?php if ( ! empty( $opts['shipping_note'] ) ) : ?>
					<div class="ppp-cart-drawer__ship"><?php echo esc_html( $opts['shipping_note'] ); ?></div>
				<?php endif; ?>
				<div class="ppp-cart-drawer__subtotal">
					<span><?php esc_html_e( 'Subtotal', 'ppp-toolkit' ); ?></span>
					<span class="ppp-cart-drawer__subtotal-val"><?php echo wp_kses_post( $cart->get_cart_subtotal() ); ?></span>
				</div>
				<?php
				$target = 'cart' === $opts['checkout_target'] ? wc_get_cart_url() : wc_get_checkout_url();
				$label  = 'cart' === $opts['checkout_target'] ? __( 'View basket', 'ppp-toolkit' ) : __( 'Checkout', 'ppp-toolkit' );
				?>
				<a class="v2-btn-primary ppp-cart-drawer__checkout" href="<?php echo esc_url( $target ); ?>">
					<?php echo esc_html( $label ); ?> <span aria-hidden="true">&rarr;</span>
				</a>
			</div>
		<?php endif; ?>
		<?php
		return ob_get_clean();
	}

	/* ── Swatch helper (shared with the product grid) ──────────── */

	/**
	 * Pull up to $limit swatch hex colours for a product from a colour
	 * attribute's term meta, falling back to nothing if unavailable.
	 *
	 * @param WC_Product $product
	 * @param int        $limit
	 * @return string[] Array of hex colours.
	 */
	public static function get_product_swatches( $product, $limit = 5 ) {
		$swatches = array();
		if ( ! $product ) {
			return $swatches;
		}

		/**
		 * Which product attribute supplies swatch colours.
		 *
		 * @param string $taxonomy
		 */
		$taxonomy = apply_filters( 'ppp_toolkit_swatch_attribute', 'pa_colour' );

		$terms = wc_get_product_terms( $product->get_id(), $taxonomy, array( 'fields' => 'all' ) );
		if ( ! is_wp_error( $terms ) && $terms ) {
			foreach ( $terms as $term ) {
				// Support common colour-swatch meta keys used by Woo swatch plugins.
				$hex = get_term_meta( $term->term_id, 'ppp_swatch_color', true );
				if ( ! $hex ) {
					$hex = get_term_meta( $term->term_id, 'product_attribute_color', true );
				}
				if ( $hex && preg_match( '/^#?[0-9a-fA-F]{3,8}$/', $hex ) ) {
					$swatches[] = '#' === $hex[0] ? $hex : '#' . $hex;
				}
				if ( count( $swatches ) >= $limit ) {
					break;
				}
			}
		}

		/**
		 * Filter the resolved swatch colours for a product.
		 *
		 * @param string[]   $swatches
		 * @param WC_Product $product
		 */
		return apply_filters( 'ppp_toolkit_product_swatches', $swatches, $product );
	}
}
