## Launch DeBitpay 👉 [https://alexk111.github.io/DeBitpay/](https://alexk111.github.io/DeBitpay/)

DeBitpay is hosted on GitHub via [gh-pages](https://github.com/alexk111/DeBitpay/tree/gh-pages) branch consisting of compiled /dist files.

## DeBitpay

Does your Bitcoin wallet not support Bitpay payments? DeBitpay is a simple app which decodes Bitpay payment links into Bitcoin transaction requirements, so that you could make the payments with Bitcoin wallets not supporting Bitpay.

It is basically a nice wrapper around the following code. You could use the below, running on your own system, to verify that the output of the app is showing you the right QR code and that your wallet is reading it properly.

### Equivalent cURL
```curl -X GET https://bitpay.com/i/$BITPAYINVOICEID -H 'accept: application/payment-request'```
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


