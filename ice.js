//limitations:
//1. cross-domain ajax so checkout buttons redirect to cart instead of iGlobal
//2. very very old version of jquery will cause problems with welcome mat
//3.

var $igc = jQuery;

function ig_getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getSelectedCountry() {
	return ig_country;
}

function igcCheckout() {
    igcGoToCheckout('375');//Should be set by customer in Shopify app
}

function getSubDomain() {
    return "polerstuff";//Should be set by customer in Shopify app
}

function igcGetItems() {

    var items = new Array();
    var itemRows = $igc(".ig-cart-item");
    if(window.location.href.indexOf("cart") != -1) {
        itemRows = $igc(".ig-cart-item");
    } else {
        $igc.ajax({
            url:"http://www.polerstuff.com/cart",
            datatype:"html",
            async:false,
            success : function(r){
                itemRows = $igc(r).filter(".ig-cart-item");
            }
        });
    }

    $igc(itemRows).each(function() {
        var $item = $igc(this);
        items.push({
          "itemDescription": $igc.trim($item.data('name')),
          "itemQuantity": $item.data('qty'),
          "itemUnitPrice": (parseFloat($item.data('price')) / 100).toString(),
          "itemURL": $item.data('url'),
          "itemImageURL": $item.data('img'),
          "itemSku": $item.data('sku'),
          "itemProductId": $item.data('product'),
          "itemWeight": $item.data('weight') || null,
          "itemWeightUnits": "G"
        });

    });
    return items;
}

function ig_domesticActions() {                 //todo-find global selectors for paypal and shipping estimators
	$igc('input[name="goto_pp"]').show();
}

//international configuration
function ig_internationalActions() {
	//take over button
	$igc('input[name="goto_pp"]').hide();
}


function igcIceReady() {

  if(!ig_isDomesticCountry){
    ig_internationalActions()
  }
    else{
      ig_domesticActions();
    }

	var $checkoutButton = $igc('button[name="checkout"]');//todo find a global selector for all checkout buttons. Done

		$checkoutButton.click(function(){
			if (ig_country) {
				if (!ig_isDomesticCountry()) {
					igcCheckout();
					return false;
				} else {
					return true;
				}
			} else {
				alert("Please select your country from the list, and click the Checkout button again.");
			    ig_showTheSplash();
			    return false;
			}
		});

}

//Testing mode, remove this requirement for the iGlobal url param, to make a site live
var iGlobalUrlParam = ig_getParameterByName("iGlobal");//This function should be toggleable in the Shopify app
// if (iGlobalUrlParam === "true") {


$(document).ajaxComplete(function(){

		//only do this outside the cart page in this situation. Not always the case
		$('button[name="checkout"]').click(function() {
			//this if clause for ig_country, essentially makes the site require the welcome mat to continue.
			//can be removed if the site should continue domestically when the welcome mat failed to get a country.
			if(ig_country) {
                if(!ig_isDomesticCountry()) {
                    igcIceReady();
                    return false;
                } else {
                    return true;
                }
            } else {
                alert("Please select your destination country from the modal and click the checkout button again.");
                ig_showTheSplash();
            }
		});

});

// }
