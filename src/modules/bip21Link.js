// Implements BIP 0021 Link Encoding
// More: https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki

// Format:
// bitcoin:<address>[?amount=<amount>][?label=<label>][?message=<message>]
// bitcoincash:<address>[?amount=<amount>][?label=<label>][?message=<message>]

export function encodeBip21Link (isBCH, address, amount, label, message) {
  return (isBCH ? 'bitcoincash' : 'bitcoin') + ':' + address +
          (amount ? '?amount=' + encodeURIComponent(amount) : '') +
          (label ? '?label=' + encodeURIComponent(label) : '') +
          (message ? '?message=' + encodeURIComponent(message) : '')
}

