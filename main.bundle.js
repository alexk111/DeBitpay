/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 401:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


// EXTERNAL MODULE: ./node_modules/bootstrap/dist/css/bootstrap.min.css
var bootstrap_min = __webpack_require__(39);
// EXTERNAL MODULE: ./node_modules/bootstrap/dist/js/bootstrap.js
var bootstrap = __webpack_require__(734);
// EXTERNAL MODULE: ./node_modules/jquery/dist/jquery.js
var jquery = __webpack_require__(755);
var jquery_default = /*#__PURE__*/__webpack_require__.n(jquery);
// EXTERNAL MODULE: ./node_modules/clipboard/dist/clipboard.js
var dist_clipboard = __webpack_require__(152);
var clipboard_default = /*#__PURE__*/__webpack_require__.n(dist_clipboard);
;// CONCATENATED MODULE: ./src/modules/clipboard.js


function btnToCopyBtn($btn, $container) {
  $btn.tooltip().on('mouseleave', function () {
    jquery_default()(this).tooltip('hide');
  });

  for (var i = 0; i < $btn.length; i++) {
    var clipboard = new (clipboard_default())($btn[i], {
      container: $container ? $container[0] : undefined
    });
    clipboard.on('success', function (e) {
      jquery_default()(e.trigger).attr('title', 'Copied!').tooltip('_fixTitle').tooltip('show').attr('title', 'Copy to clipboard').tooltip('_fixTitle');
      e.clearSelection();
    });
    clipboard.on('error', function (e) {
      var modifierKey = /Mac/i.test(navigator.userAgent) ? "\u2318" : 'Ctrl-';
      var fallbackMsg = 'Press ' + modifierKey + 'C to copy';
      jquery_default()(e.trigger).attr('title', fallbackMsg).tooltip('_fixTitle').tooltip('show').attr('title', 'Copy to clipboard').tooltip('_fixTitle');
    });
  }
}
;// CONCATENATED MODULE: ./src/modules/paymentLink.js
function normalizePaymentLink(paymentLink) {
  var pos = paymentLink.indexOf('?id=');

  if (pos > -1) {
    // bitpay invoice url
    return 'bitcoin:?r=https://bitpay.com/i/' + paymentLink.substr(pos + 4);
  }

  return paymentLink;
}
// EXTERNAL MODULE: ./node_modules/url-parse/index.js
var url_parse = __webpack_require__(564);
var url_parse_default = /*#__PURE__*/__webpack_require__.n(url_parse);
;// CONCATENATED MODULE: ./src/modules/paymentRequest.js
 // import shajs from 'sha.js'


/*
  [Header Issue]
  Response from Bitpay server doesn't have 'digest' in Access-Control-Expose-Headers,
  so browsers don't give us access to it. We have to disable the digest hash verification.
*/

function getRawPaymentRequest(paymentUrl) {
  var deferred = jquery_default().Deferred();
  var paymentUrlObject = new (url_parse_default())(paymentUrl, true); // Detect 'bitcoin:' urls and extract payment-protocol section

  if (paymentUrlObject.protocol !== 'http:' && paymentUrlObject.protocol !== 'https:') {
    if (!paymentUrlObject.query.r) {
      return deferred.reject(new Error('Invalid payment protocol url'));
    } else {
      paymentUrl = paymentUrlObject.query.r;
    }
  }

  var requestOptions = {
    dataType: 'text',
    url: paymentUrl,
    headers: {
      'Accept': 'application/payment-request'
    }
  };
  jquery_default().get(requestOptions).done(function (data, textStatus, jqXHR) {
    /* See [Header Issue] section above
    const digest = jqXHR.getResponseHeader('digest')
    if (digest) {
      deferred.resolve(data, digest)
    } else {
      deferred.reject('Digest missing from response headers')
    }
    */
    deferred.resolve(data, null);
  }).fail(function (xhr) {
    deferred.reject(xhr.responseText || 'Could not get data for the specified payment request');
  });
  return deferred;
}

function parsePaymentRequest(rawBody, digestHeader) {
  var deferred = jquery_default().Deferred();
  var paymentRequest;

  if (!rawBody) {
    return deferred.reject('Parameter rawBody is required');
  }
  /* See [Header Issue] section above
  if (!digestHeader) {
    return deferred.reject('Parameter digestHeader is required')
  }
  */


  try {
    paymentRequest = JSON.parse(rawBody);
  } catch (e) {
    return deferred.reject("Unable to parse request - ".concat(e));
  }
  /* See [Header Issue] section above
  const digest = digestHeader.split('=')[1]
  const hash = shajs('sha256').update(rawBody).digest('hex')
   if (digest !== hash) {
    return deferred.reject(`Response body hash does not match digest header. Actual: ${hash} Expected: ${digest}`)
  }
  */


  return deferred.resolve(paymentRequest);
}

function getAndParsePaymentRequest(paymentUrl) {
  var deferred = jquery_default().Deferred();
  getRawPaymentRequest(paymentUrl).done(function (data, digest) {
    parsePaymentRequest(data, digest).done(function (parsedRequest) {
      deferred.resolve(parsedRequest);
    }).fail(function (err) {
      deferred.reject(err);
    });
  }).fail(function (err) {
    deferred.reject(err);
  });
  return deferred;
}
;// CONCATENATED MODULE: ./src/modules/modals.js


var tplModal = "\n<div class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\" role=\"document\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <h5 class=\"modal-title\"></h5>\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n      <div class=\"modal-body\">\n      </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\n      </div>\n    </div>\n  </div>\n</div>\n";
var $modal;
function showModal(title, $content, opts) {
  opts = opts || {};

  if ($modal) {
    $modal.remove();
  }

  $modal = jquery_default()(tplModal);
  jquery_default()('.modal-title', $modal).text(title);
  jquery_default()('.modal-body', $modal).append($content);

  if (opts.size) {
    jquery_default()('.modal-dialog', $modal).addClass('modal-' + opts.size);
    jquery_default()('.modal-footer .btn', $modal).addClass('btn-' + opts.size);
  }

  $modal.appendTo('body').modal({
    keyboard: true,
    show: true
  });
  btnToCopyBtn(jquery_default()('.btn-clipboard', $modal), $modal);
}
;// CONCATENATED MODULE: ./src/modules/bip21Link.js
// Implements BIP 0021 Link Encoding
// More: https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki
// Format:
// bitcoin:<address>[?amount=<amount>][?label=<label>][?message=<message>]
// bitcoincash:<address>[?amount=<amount>][?label=<label>][?message=<message>]
function encodeBip21Link(isBCH, address, amount, label, message) {
  var parts = [];
  if (amount) parts.push('amount=' + encodeURIComponent(amount));
  if (label) parts.push('label=' + encodeURIComponent(label));
  if (message) parts.push('message=' + encodeURIComponent(message));
  return (isBCH ? 'bitcoincash' : 'bitcoin') + ':' + address + (parts ? '?' + parts.join('&') : '');
}
;// CONCATENATED MODULE: ./src/modules/currency.js
function satsToBTC(sats) {
  return sats / 100000000;
}
// EXTERNAL MODULE: ./node_modules/qrcode-generator/qrcode.js
var qrcode = __webpack_require__(192);
var qrcode_default = /*#__PURE__*/__webpack_require__.n(qrcode);
;// CONCATENATED MODULE: ./src/modules/paymentModal.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }





var paymentFormLabels = {
  currency: "Currency",
  requiredFeeRate: "Fee Rate (sats/byte)",
  time: "Created at",
  expires: "Expires at",
  memo: "Memo",
  amountBTC: "Amount",
  amount: "Amount in Satoshis",
  address: "Address",
  bip21Link: "Open in Wallet"
};
var paymentFormInfoStruct = [["currency", "requiredFeeRate"], ["time", "expires"], "memo"];
var paymentFormTxStruct = [["amountBTC", "amount"], "address", "bip21Link"];
var paymentFormTextAreas = ["memo"];
var paymentFormLinks = ["bip21Link"];
var paymentFormQRCodeEnabled = ["bip21Link"];
var paymentFormCopyEnabled = ["amountBTC", "amount", "address"];

function genInputOrTextArea(dataKey, dataVal) {
  if (paymentFormTextAreas.indexOf(dataKey) > -1) {
    return jquery_default()("<textarea class=\"form-control form-control-lg\" readonly>".concat(dataVal, "</textarea>"));
  } else {
    var $input = jquery_default()("<input type=\"text\" class=\"form-control form-control-lg\" value=\"".concat(dataVal, "\" readonly>"));

    if (paymentFormCopyEnabled.indexOf(dataKey) > -1) {
      var $inputGroup = jquery_default()('<div class="input-group"></div>');
      $inputGroup.append($input).append("\n        <div class=\"input-group-append\">\n          <button class=\"btn btn-clipboard btn-success btn-lg\" data-clipboard-text=\"".concat(dataVal, "\" title=\"Copy to clipboard\">COPY</button>\n        </div>\n      "));
      return $inputGroup;
    } else {
      return $input;
    }
  }
}

function genQRCode(dataVal) {
  var qr = qrcode_default()(0, "M");
  qr.addData(dataVal);
  qr.make();
  return jquery_default()(qr.createImgTag(5));
}

function paymentDataToModalContentItem(data, item) {
  var $item;

  if (_typeof(item) === _typeof([])) {
    $item = jquery_default()('<div class="form-row"></div>');
    item.forEach(function (subItem) {
      var $subItem = jquery_default()("\n        <div class=\"form-group col-lg\">\n          <label>".concat(paymentFormLabels[subItem], "</label>\n        </div>\n      "));
      var $subItemInput = genInputOrTextArea(subItem, data[subItem]);
      $subItem.append($subItemInput);
      $item.append($subItem);
    });
  } else {
    if (paymentFormLinks.indexOf(item) > -1) {
      $item = jquery_default()("<div class=\"text-center\"></div>");

      if (paymentFormQRCodeEnabled.indexOf(item) > -1) {
        var $itemQRCode = genQRCode(data[item]);
        $itemQRCode.addClass("img-fluid");
        $item.append($itemQRCode);
      }

      var $itemBtn = jquery_default()("<div><a href=\"".concat(data[item], "\" class=\"btn btn-lg btn-primary\">").concat(paymentFormLabels[item], "</a><div>"));
      $item.append($itemBtn);
    } else {
      $item = jquery_default()("\n        <div class=\"form-group\">\n          <label>".concat(paymentFormLabels[item], "</label>\n        </div>\n      "));
      var $itemInput = genInputOrTextArea(item, data[item]);
      $item.append($itemInput);
    }
  }

  return [$item];
}

function paymentDataToModalContent(data) {
  var $content = jquery_default()("<div></div>");
  paymentFormInfoStruct.forEach(function (item) {
    $content.append(paymentDataToModalContentItem(data, item));
  });
  $content.append("<hr>");
  data.outputs.forEach(function (output) {
    output.amountBTC = satsToBTC(output.amount);
    output.bip21Link = encodeBip21Link(data.currency === "BCH", output.address, output.amountBTC, "Bitpay", "Payment");
    paymentFormTxStruct.forEach(function (item) {
      $content.append.apply($content, paymentDataToModalContentItem(output, item));
    });
  });
  $content.append('<div class="alert alert-info mt-3" role="alert">' + '💬 Paid the invoice? Please <a href="https://github.com/alexk111/DeBitpay/issues/23" target="_blank" rel="noopener noreferrer">post a comment</a> to let others know that it still works.' + "</div>");
  return $content;
}
;// CONCATENATED MODULE: ./src/modules/howToRunLocally.js
var htmlHowToRunLocally = "\n  <p>For increased security, you can run DeBitpay on your computer instead of from the GitHub servers.</p>\n  <p class=\"h5\">Downloading and installing</p>\n  <ol>\n    <li>Download the latest release of DeBitpay <a href=\"https://github.com/alexk111/DeBitpay/releases\" target=\"_blank\">here</a>, by clicking on <code>debitpay-vX.X.X.zip</code> under the release assets </li>\n    <li>Extract the downloaded zip archive to a folder at your computer. You should now have a folder containing three files: <code>index.html</code>, <code>main.bundle.js</code> and <code>vendors.bundle.js</code></li>\n  </ol>\n  <p class=\"h5\">Running DeBitpay locally</p>\n  <ol>\n    <li>Double-click the <code>index.html</code> file</li>\n    <li>Local version of DeBitpay should open in your browser</li>\n  </ol>\n";
;// CONCATENATED MODULE: ./src/modules/howItWorks.js
var htmlHowItWorks = "\n  <p>When you press the <i>Get Transaction Requirements</i> button:</p>\n  <ol>\n    <li>DeBitpay extracts an invoice url from the entered payment url (string after 'bitcoin:?r='), or keeps the url as is if you entered an invoice url (begins with http:// or https://)</li>\n    <li>DeBitpay loads data from the invoice url using a HTTP GET request with 'Accept: application/payment-request' header</li>\n    <li>DeBitpay shows a window with the data returned by the invoice url, structured and formatted for convenience. Bitcoin amount is calculated from satoshis data, QR Code image and Open In Wallet button are rendered from Address and Amount data, the rest data is shown as-is without modifications.</li>\n  </ol>\n  <p class=\"alert alert-info\">Entered Invoice URL is the only external resource DeBitpay connects to. No analytics, no external scripts, etc.</p>\n";
;// CONCATENATED MODULE: ./src/modules/importantNotice.js
var htmlImportantNotice = "\n  <p>DeBitpay should be used as a temporary solution - that's not how Bitcoin transactions supposed to work! Each time you extract data with DeBitpay and pay an invoice, please ask the merchant to switch to another payment processor. <a href=\"https://alexk111.github.io/DeBitpay-Merchants/\" target=\"_blank\">Read more...</a></p>\n";
;// CONCATENATED MODULE: ./src/modules/page.js









var isLocalApp = window.location.protocol === "file:";

function getParsingState() {
  return !!jquery_default()("#indexForm button").prop("disabled");
}

function setParsingState(val) {
  jquery_default()("#indexForm button").prop("disabled", val);
}

function initTitle() {
  if (isLocalApp) {
    jquery_default()("#app-title").text("DeBitpay (Local)");
    document.title = "DeBitpay (Local)";
  }
}

function initParseButton() {
  jquery_default()("#indexForm").submit(function (evt) {
    evt.preventDefault();

    if (!getParsingState()) {
      setParsingState(true);
      var invUrl = jquery_default()("#indexForm input").val();

      if (invUrl) {
        getAndParsePaymentRequest(normalizePaymentLink(invUrl)).done(function (data) {
          showModal("Payment Request Data", paymentDataToModalContent(data), {
            size: "lg"
          });
          setParsingState(false);
        }).fail(function (err) {
          showModal("Error", err);
          setParsingState(false);
        });
      } else {
        showModal("Warning", "Enter Payment URL or Invoice Page URL to continue");
        setParsingState(false);
      }
    }
  });
}

function initHowToRunLocally() {
  if (isLocalApp) {
    // hide 'how to run locally' button if local version is opened
    jquery_default()("button.how-to-run-locally").remove();
  } else {
    jquery_default()("button.how-to-run-locally").click(function (evt) {
      evt.preventDefault();
      showModal("How To Run DeBitpay Locally", htmlHowToRunLocally, {
        size: "lg"
      });
    });
  }
}

function initHowItWorks() {
  jquery_default()("button.how-it-works").click(function (evt) {
    evt.preventDefault();
    showModal("How It Works", htmlHowItWorks, {
      size: "lg"
    });
  });
}

function initImportantNotice() {
  jquery_default()("button.important-notice").click(function (evt) {
    evt.preventDefault();
    showModal("Important Notice", htmlImportantNotice, {
      size: "lg"
    });
  });
}

function initFooter() {
  btnToCopyBtn(jquery_default()("footer .btn-clipboard"));
}

function loadingDone() {
  jquery_default()("body > .is-loading").remove();
}

function initPage() {
  initTitle();
  initParseButton();
  initHowToRunLocally();
  initHowItWorks();
  initImportantNotice();
  initFooter();
  loadingDone();
}
;// CONCATENATED MODULE: ./src/index.js



initPage();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	// It's empty as some runtime module handles the default behavior
/******/ 	__webpack_require__.x = x => {}
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			179: 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			[401,216]
/******/ 		];
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		var checkDeferredModules = x => {};
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime, executeModules] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 			// add entry modules from loaded chunk to deferred list
/******/ 			if(executeModules) deferredModules.push.apply(deferredModules, executeModules);
/******/ 		
/******/ 			// run deferred modules when all chunks ready
/******/ 			return checkDeferredModules();
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkdebitpay"] = self["webpackChunkdebitpay"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 		
/******/ 		function checkDeferredModulesImpl() {
/******/ 			var result;
/******/ 			for(var i = 0; i < deferredModules.length; i++) {
/******/ 				var deferredModule = deferredModules[i];
/******/ 				var fulfilled = true;
/******/ 				for(var j = 1; j < deferredModule.length; j++) {
/******/ 					var depId = deferredModule[j];
/******/ 					if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferredModules.splice(i--, 1);
/******/ 					result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 				}
/******/ 			}
/******/ 			if(deferredModules.length === 0) {
/******/ 				__webpack_require__.x();
/******/ 				__webpack_require__.x = x => {};
/******/ 			}
/******/ 			return result;
/******/ 		}
/******/ 		var startup = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			// reset startup function so it can be called again when more startup code is added
/******/ 			__webpack_require__.x = startup || (x => {});
/******/ 			return (checkDeferredModules = checkDeferredModulesImpl)();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// run startup
/******/ 	return __webpack_require__.x();
/******/ })()
;