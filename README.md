## Launch DeBitpay 👉 [https://alexk111.github.io/DeBitpay/](https://alexk111.github.io/DeBitpay/)

DeBitpay is hosted on GitHub via [gh-pages](https://github.com/alexk111/DeBitpay/tree/gh-pages) branch consisting of compiled /dist files.

## DeBitpay

Does your Bitcoin wallet not support Bitpay payments? DeBitpay is a simple app which decodes Bitpay payment links into Bitcoin transaction requirements, so that you could make the payments with Bitcoin wallets not supporting Bitpay.

## Story Behind the App

I make Bitcoin payments thru Bitpay from time to time. Everything went good until someday they started forcing payers to use their payment protocol and hiding native Bitcoin addresses on the invoice pages. If the wallet you use supports the protocol, then you don't have problems with that, but what about those who use wallets not supporting it? First there were a hackish way of getting output addresses by changing the invoice url to *bitpay.com/invoice-noscript?id=INVOICEID*. When that stopped working, someone found another url for reading transaction data: *bitpay.com/invoiceData/INVOICEID?poll=false*. After a while this one also stopped showing the transaction details. I couldn't tolerate this anymore and decided to make a long-lasting solution that gets the transaction requirements the same way the wallets supporting Bitpay do, and unveils the data so that Bitpay transactions could be made with any Bitcoin wallet.

The app is basically a nice wrapper around the following code.  You could use the below, running on your own system, to verify that the output of the app is showing you the right QR code and that your wallet is reading it properly.

### Equivalent cURL
```curl -X GET http://bitpay.com/i/$BITPAYINVOICEID -H 'accept: application/payment-request'```
### Equivalent Python
```python
from requests import get
url = 'https://bitpay.com/i/BITPAYINVOICEID'
resp = get(url, headers={'Accept' : 'application/payment-request'}).json()
print(resp)
```

## Security Note

Due to a missing header in responses from Bitpay servers I had to skip a hash verification of Bitpay data. More details on [DeBitpay (NodeJS edition) repo](https://github.com/alexk111/DeBitpay-nodejs).

## Installing on your system

1. [Download DeBitpay](https://github.com/alexk111/DeBitpay/archive/master.zip) from GitHub.
2. Unpack the downloaded zip and install dependencies:

```
npm install
```

## Build

```
npm run build
```

The command will build the app in /dist folder.

## Open

Go to /dist folder and open *index.html* with your browser.

## License

MIT © Alex Kaul


