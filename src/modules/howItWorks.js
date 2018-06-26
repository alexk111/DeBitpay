export const htmlHowItWorks = `
  <p>When you press the <i>Get Transaction Requirements</i> button:</p>
  <ol>
    <li>DeBitpay extracts an invoice url from the entered payment url (string after 'bitcoin:?r='), or keeps the url as is if you entered an invoice url (begins with http:// or https://)</li>
    <li>DeBitpay loads data from the invoice url using a HTTP GET request with 'Accept: application/payment-request' header</li>
    <li>DeBitpay shows a window with the data returned by the invoice url, structured and formatted for convenience. Bitcoin amount is calculated from satoshis data, QR Code image and Open In Wallet button are rendered from Address and Amount data, the rest data is shown as-is without modifications.</li>
  </ol>
  <p class="alert alert-info">Entered Invoice URL is the only external resource DeBitpay connects to. No analytics, no external scripts, etc.</p>
`
