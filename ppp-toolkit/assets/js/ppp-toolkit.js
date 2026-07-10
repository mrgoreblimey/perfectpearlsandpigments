/**
 * PPP Toolkit front-end behaviour.
 *
 * Vanilla JS for everything; jQuery is used only to emit/observe the
 * WooCommerce cart-fragment events (jQuery is a Woo dependency anyway).
 */
( function () {
	'use strict';

	var CFG = window.PPP_TOOLKIT || {};
	var $ = window.jQuery || null;
	var reduceMotion = window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	document.addEventListener( 'DOMContentLoaded', init );

	function init() {
		initDrawer();
		initCarousels();
		initQuickAdd();
		initStickyATC();
		bindFragmentEvents();
	}

	/* ── Utilities ─────────────────────────────────────────────── */

	function wcAjaxUrl( endpoint ) {
		if ( CFG.wcAjaxUrl ) {
			return CFG.wcAjaxUrl.replace( '%%endpoint%%', endpoint );
		}
		var sep = -1 !== location.href.indexOf( '?' ) ? '&' : '?';
		return location.origin + location.pathname + sep + 'wc-ajax=' + endpoint;
	}

	/**
	 * Apply a Woo-style fragments map (selector -> outerHTML) to the DOM.
	 */
	function applyFragments( fragments ) {
		if ( ! fragments ) {
			return;
		}
		Object.keys( fragments ).forEach( function ( selector ) {
			var nodes = document.querySelectorAll( selector );
			nodes.forEach( function ( node ) {
				var tmp = document.createElement( 'div' );
				tmp.innerHTML = fragments[ selector ].trim();
				var replacement = tmp.firstElementChild;
				if ( replacement && node.parentNode ) {
					node.parentNode.replaceChild( replacement, node );
				}
			} );
		} );
		if ( $ ) {
			$( document.body ).trigger( 'wc_fragments_refreshed' );
		}
	}

	/* ── Cart drawer ───────────────────────────────────────────── */

	var drawer, overlay, lastFocused;

	function initDrawer() {
		drawer  = document.querySelector( '.ppp-cart-drawer' );
		overlay = document.querySelector( '.ppp-drawer-overlay' );
		if ( ! drawer ) {
			return;
		}

		// Openers.
		document.addEventListener( 'click', function ( e ) {
			var toggle = e.target.closest( '.ppp-cart-toggle, [data-ppp-cart-toggle]' );
			if ( toggle ) {
				e.preventDefault();
				openDrawer();
				return;
			}
			// Convenience: hijack an Elementor/Woo menu-cart toggle if present.
			var menuCart = e.target.closest( '.elementor-menu-cart__toggle_button, a.wc-menu-cart, .ppp-header .cart-contents' );
			if ( menuCart ) {
				e.preventDefault();
				openDrawer();
			}
		} );

		// Closers.
		document.addEventListener( 'click', function ( e ) {
			if ( e.target.closest( '[data-ppp-cart-close]' ) ) {
				e.preventDefault();
				closeDrawer();
			}
		} );

		// Remove item (delegated).
		document.addEventListener( 'click', function ( e ) {
			var btn = e.target.closest( '[data-ppp-remove]' );
			if ( btn ) {
				e.preventDefault();
				removeItem( btn );
			}
		} );

		// Esc + focus trap.
		document.addEventListener( 'keydown', function ( e ) {
			if ( ! drawer.classList.contains( 'is-open' ) ) {
				return;
			}
			if ( 'Escape' === e.key ) {
				closeDrawer();
			} else if ( 'Tab' === e.key ) {
				trapFocus( e );
			}
		} );
	}

	function openDrawer() {
		if ( ! drawer ) {
			return;
		}
		lastFocused = document.activeElement;
		drawer.hidden = false;
		if ( overlay ) {
			overlay.hidden = false;
		}
		// next frame so the transition runs
		requestAnimationFrame( function () {
			drawer.classList.add( 'is-open' );
			if ( overlay ) {
				overlay.classList.add( 'is-open' );
			}
		} );
		drawer.setAttribute( 'aria-hidden', 'false' );
		document.body.classList.add( 'ppp-cart-open' );
		var closeBtn = drawer.querySelector( '[data-ppp-cart-close]' );
		if ( closeBtn ) {
			closeBtn.focus();
		}
	}

	function closeDrawer() {
		if ( ! drawer ) {
			return;
		}
		drawer.classList.remove( 'is-open' );
		if ( overlay ) {
			overlay.classList.remove( 'is-open' );
		}
		drawer.setAttribute( 'aria-hidden', 'true' );
		document.body.classList.remove( 'ppp-cart-open' );

		var done = function () {
			drawer.hidden = true;
			if ( overlay ) {
				overlay.hidden = true;
			}
		};
		if ( reduceMotion ) {
			done();
		} else {
			setTimeout( done, 340 );
		}
		if ( lastFocused && lastFocused.focus ) {
			lastFocused.focus();
		}
	}

	function trapFocus( e ) {
		var focusable = drawer.querySelectorAll( 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])' );
		if ( ! focusable.length ) {
			return;
		}
		var first = focusable[ 0 ];
		var last  = focusable[ focusable.length - 1 ];
		if ( e.shiftKey && document.activeElement === first ) {
			e.preventDefault();
			last.focus();
		} else if ( ! e.shiftKey && document.activeElement === last ) {
			e.preventDefault();
			first.focus();
		}
	}

	function removeItem( btn ) {
		var key = btn.getAttribute( 'data-ppp-remove' );
		if ( ! key ) {
			return;
		}
		var row = btn.closest( '.ppp-cart-item' );
		if ( row ) {
			row.classList.add( 'is-removing' );
		}

		var body = new URLSearchParams();
		body.append( 'action', 'ppp_remove_from_cart' );
		body.append( 'nonce', CFG.removeNonce || '' );
		body.append( 'cart_item_key', key );

		fetch( CFG.ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: body.toString()
		} )
			.then( function ( r ) { return r.json(); } )
			.then( function ( res ) {
				if ( res && res.success && res.data && res.data.fragments ) {
					applyFragments( res.data.fragments );
					if ( $ ) {
						$( document.body ).trigger( 'removed_from_cart', [ res.data.fragments, res.data.cart_hash ] );
					}
				} else if ( row ) {
					row.classList.remove( 'is-removing' );
				}
			} )
			.catch( function () {
				if ( row ) {
					row.classList.remove( 'is-removing' );
				}
			} );
	}

	/* ── Category carousel ─────────────────────────────────────── */

	function initCarousels() {
		document.querySelectorAll( '[data-ppp-scroll]' ).forEach( function ( arrow ) {
			arrow.addEventListener( 'click', function () {
				var carousel = arrow.closest( '.ppp-cat-carousel' );
				var track = carousel ? carousel.querySelector( '[data-ppp-track]' ) : null;
				if ( ! track ) {
					return;
				}
				var dir = parseInt( arrow.getAttribute( 'data-ppp-scroll' ), 10 ) || 1;
				track.scrollBy( { left: dir * 240, behavior: reduceMotion ? 'auto' : 'smooth' } );
			} );
		} );
	}

	/* ── Quick add ─────────────────────────────────────────────── */

	function initQuickAdd() {
		document.addEventListener( 'click', function ( e ) {
			var btn = e.target.closest( '.ppp-quick-add' );
			if ( ! btn ) {
				return;
			}
			e.preventDefault();
			quickAdd( btn );
		} );
	}

	function quickAdd( btn ) {
		if ( btn.disabled ) {
			return;
		}
		var productId = btn.getAttribute( 'data-product-id' );
		if ( ! productId ) {
			return;
		}
		var original = btn.innerHTML;
		var added    = btn.getAttribute( 'data-added-label' ) || ( CFG.i18n && CFG.i18n.added ) || 'Added ✓';

		btn.disabled = true;
		btn.classList.add( 'is-loading' );

		var body = new URLSearchParams();
		body.append( 'product_id', productId );
		body.append( 'quantity', '1' );

		fetch( wcAjaxUrl( 'add_to_cart' ), {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: body.toString()
		} )
			.then( function ( r ) { return r.json(); } )
			.then( function ( res ) {
				btn.classList.remove( 'is-loading' );

				if ( res && res.error && res.product_url ) {
					// e.g. product requires options — send them to the product page.
					window.location = res.product_url;
					return;
				}

				if ( res && res.fragments ) {
					applyFragments( res.fragments );
					if ( $ ) {
						$( document.body ).trigger( 'added_to_cart', [ res.fragments, res.cart_hash, $( btn ) ] );
					}
				}

				// "Added ✓" state for 1.6s.
				btn.innerHTML = added;
				btn.classList.add( 'is-added' );
				setTimeout( function () {
					btn.innerHTML = original;
					btn.classList.remove( 'is-added' );
					btn.disabled = false;
				}, 1600 );

				if ( CFG.autoOpen ) {
					openDrawer();
				}
			} )
			.catch( function () {
				btn.classList.remove( 'is-loading' );
				btn.innerHTML = original;
				btn.disabled = false;
			} );
	}

	/* ── Sticky ATC ────────────────────────────────────────────── */

	function initStickyATC() {
		var bar = document.querySelector( '[data-ppp-sticky-atc]' );
		if ( ! bar || bar.getAttribute( 'data-editor' ) === '1' ) {
			return;
		}

		var form = document.querySelector( 'form.cart' );
		if ( ! form ) {
			return; // no buy box on this page
		}

		var offset = parseInt( bar.getAttribute( 'data-offset' ), 10 ) || 80;

		if ( 'IntersectionObserver' in window ) {
			var io = new IntersectionObserver( function ( entries ) {
				entries.forEach( function ( entry ) {
					// Show once the buy box has scrolled up out of view.
					var above = entry.boundingClientRect.top < 0;
					toggleBar( bar, ! entry.isIntersecting && above );
				} );
			}, { rootMargin: '-' + offset + 'px 0px 0px 0px', threshold: 0 } );
			io.observe( form );
		} else {
			// Fallback: scroll listener.
			window.addEventListener( 'scroll', function () {
				var rect = form.getBoundingClientRect();
				toggleBar( bar, rect.bottom < offset );
			}, { passive: true } );
		}

		// Mirror the real ATC button.
		var trigger = bar.querySelector( '[data-ppp-atc-trigger]' );
		if ( trigger ) {
			trigger.addEventListener( 'click', function ( e ) {
				e.preventDefault();
				var realBtn = form.querySelector( 'button[type="submit"], .single_add_to_cart_button' );
				if ( realBtn && ! realBtn.classList.contains( 'disabled' ) ) {
					realBtn.click();
				} else if ( form.requestSubmit ) {
					form.requestSubmit();
				} else {
					form.submit();
				}
			} );
		}

		// Reflect variation selection + price (variable products).
		if ( $ && form.classList.contains( 'variations_form' ) ) {
			var priceEl = bar.querySelector( '[data-ppp-atc-price]' );
			var varEl   = bar.querySelector( '[data-ppp-atc-variation]' );
			var btn     = bar.querySelector( '[data-ppp-atc-trigger]' );

			$( form ).on( 'found_variation', function ( ev, variation ) {
				if ( priceEl && variation.price_html ) {
					priceEl.innerHTML = variation.price_html;
				}
				if ( varEl ) {
					varEl.textContent = buildVariationLabel( form );
				}
				if ( btn ) {
					btn.disabled = false;
				}
			} );
			$( form ).on( 'reset_data hide_variation', function () {
				if ( varEl ) {
					varEl.textContent = '';
				}
				if ( btn ) {
					btn.disabled = true;
				}
			} );
			// Start disabled until a valid variation is chosen.
			if ( btn ) {
				btn.disabled = true;
			}
		}
	}

	function buildVariationLabel( form ) {
		var parts = [];
		form.querySelectorAll( 'select[name^="attribute"]' ).forEach( function ( sel ) {
			if ( sel.value ) {
				var opt = sel.options[ sel.selectedIndex ];
				parts.push( opt ? opt.textContent : sel.value );
			}
		} );
		return parts.join( ' · ' );
	}

	function toggleBar( bar, show ) {
		bar.classList.toggle( 'is-visible', !! show );
		bar.setAttribute( 'aria-hidden', show ? 'false' : 'true' );
	}

	/* ── Woo fragment events (open drawer when Woo itself adds) ── */

	function bindFragmentEvents() {
		if ( ! $ ) {
			return;
		}
		// If another Woo add-to-cart button fires, keep our badge in sync
		// (Woo already applied fragments; nothing else needed here) and
		// optionally surface the drawer.
		$( document.body ).on( 'added_to_cart', function ( e, fragments, hash, button ) {
			// Only auto-open for our own quick-add (handled inline). Native
			// single-product AJAX adds also open the drawer for consistency.
			if ( CFG.autoOpen && button && ! button.hasClass( 'ppp-quick-add' ) ) {
				openDrawer();
			}
		} );
	}
} )();
