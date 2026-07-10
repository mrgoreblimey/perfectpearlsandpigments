<?php
/**
 * AJAX endpoints for the toolkit.
 *
 * Quick-add uses WooCommerce's native `?wc-ajax=add_to_cart` (handled by
 * Woo core), so we only need a remove endpoint for the drawer. On success it
 * returns refreshed cart fragments so the drawer + count update in place.
 *
 * @package PPP_Toolkit
 */

defined( 'ABSPATH' ) || exit;

add_action( 'wp_ajax_ppp_remove_from_cart', 'ppp_toolkit_remove_from_cart' );
add_action( 'wp_ajax_nopriv_ppp_remove_from_cart', 'ppp_toolkit_remove_from_cart' );

/**
 * Remove a single cart line by its key, then return fragments.
 */
function ppp_toolkit_remove_from_cart() {
	check_ajax_referer( 'ppp_remove_from_cart', 'nonce' );

	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		wp_send_json_error( array( 'message' => __( 'Cart unavailable.', 'ppp-toolkit' ) ), 400 );
	}

	$cart_item_key = isset( $_POST['cart_item_key'] ) ? sanitize_text_field( wp_unslash( $_POST['cart_item_key'] ) ) : '';

	if ( '' === $cart_item_key || ! WC()->cart->get_cart_item( $cart_item_key ) ) {
		wp_send_json_error( array( 'message' => __( 'Item not found in basket.', 'ppp-toolkit' ) ), 404 );
	}

	WC()->cart->remove_cart_item( $cart_item_key );
	WC()->cart->calculate_totals();

	// Mirror Woo's fragment response shape so the JS can reuse one handler.
	ob_start();
	woocommerce_mini_cart();
	$mini_cart = ob_get_clean();

	$data = array(
		'fragments' => apply_filters(
			'woocommerce_add_to_cart_fragments',
			array(
				'div.widget_shopping_cart_content' => '<div class="widget_shopping_cart_content">' . $mini_cart . '</div>',
			)
		),
		'cart_hash' => WC()->cart->get_cart_hash(),
	);

	wp_send_json_success( $data );
}
