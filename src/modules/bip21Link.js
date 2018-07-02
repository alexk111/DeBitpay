// Implements BIP 0021 Link Encoding
// More: https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki

// Format:
// bitcoin:<address>[?amount=<amount>][?label=<label>][?message=<message>]
// bitcoincash:<address>[?amount=<amount>][?label=<label>][?message=<message>]

export function encodeBip21Link (isBCH, address, amount, label, message) {
  const parts = []
  if (amount) parts.push('amount=' + encodeURIComponent(amount))
  if (label) parts.push('label=' + encodeURIComponent(label))
  if (message) parts.push('message=' + encodeURIComponent(message))
  return (isBCH ? 'bitcoincash' : 'bitcoin') + ':' + address +
          (parts ? '?' + parts.join('&') : '')
}

