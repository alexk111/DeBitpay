export function normalizePaymentLink (paymentLink) {
  const pos = paymentLink.indexOf('?id=')
  if (pos > -1) { // bitpay invoice url
    return 'bitcoin:?r=https://bitpay.com/i/' + paymentLink.substr(pos + 4)
  }

  return paymentLink
}

