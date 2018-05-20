import $ from 'jquery'

// import shajs from 'sha.js'
import URL from 'url-parse'

/*
  [Header Issue]
  Response from Bitpay server doesn't have 'digest' in Access-Control-Expose-Headers,
  so browsers don't give us access to it. We have to disable the digest hash verification.
*/

function getRawPaymentRequest (paymentUrl) {
  const deferred = $.Deferred()

  let paymentUrlObject = new URL(paymentUrl, true)

  // Detect 'bitcoin:' urls and extract payment-protocol section
  if (paymentUrlObject.protocol !== 'http:' && paymentUrlObject.protocol !== 'https:') {
    if (!paymentUrlObject.query.r) {
      return deferred.reject(new Error('Invalid payment protocol url'))
    } else {
      paymentUrl = paymentUrlObject.query.r
    }
  }

  const requestOptions = {
    dataType: 'text',
    url: paymentUrl,
    headers: {
      'Accept': 'application/payment-request'
    }
  }

  $.get(requestOptions)
    .done((data, textStatus, jqXHR) => {
      /* See [Header Issue] section above
      const digest = jqXHR.getResponseHeader('digest')
      if (digest) {
        deferred.resolve(data, digest)
      } else {
        deferred.reject('Digest missing from response headers')
      }
      */
      deferred.resolve(data, null)
    })
    .fail((xhr) => {
      deferred.reject(xhr.responseText || 'Could not get data for the specified payment request')
    })

  return deferred
}

function parsePaymentRequest (rawBody, digestHeader) {
  const deferred = $.Deferred()
  let paymentRequest

  if (!rawBody) {
    return deferred.reject('Parameter rawBody is required')
  }

  /* See [Header Issue] section above
  if (!digestHeader) {
    return deferred.reject('Parameter digestHeader is required')
  }
  */

  try {
    paymentRequest = JSON.parse(rawBody)
  } catch (e) {
    return deferred.reject(`Unable to parse request - ${e}`)
  }

  /* See [Header Issue] section above
  const digest = digestHeader.split('=')[1]
  const hash = shajs('sha256').update(rawBody).digest('hex')

  if (digest !== hash) {
    return deferred.reject(`Response body hash does not match digest header. Actual: ${hash} Expected: ${digest}`)
  }
  */

  return deferred.resolve(paymentRequest)
}

export function getAndParsePaymentRequest (paymentUrl) {
  const deferred = $.Deferred()

  getRawPaymentRequest(paymentUrl)
    .done((data, digest) => {
      parsePaymentRequest(data, digest)
        .done((parsedRequest) => {
          deferred.resolve(parsedRequest)
        })
        .fail((err) => {
          deferred.reject(err)
        })
    })
    .fail((err) => {
      deferred.reject(err)
    })

  return deferred
}
