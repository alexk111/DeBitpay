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

### Download

1. [Download DeBitpay](https://github.com/alexk111/DeBitpay/archive/master.zip) from GitHub.
2. Unpack the downloaded zip and install dependencies:

```
yarn install
```

### Build

```
yarn run build
```

The command will build the app in /dist folder.

### Open

Go to /dist folder and open *index.html* with your browser.

## Backers 💝

[![Backer](https://mynode.alexkaul.com/gh-backer/top/0/avatar/60)](https://mynode.alexkaul.com/gh-backer/top/0/profile)
[![Backer](https://mynode.alexkaul.com/gh-backer/top/1/avatar/60)](https://mynode.alexkaul.com/gh-backer/top/1/profile)
[![Backer](https://mynode.alexkaul.com/gh-backer/top/2/avatar/60)](https://mynode.alexkaul.com/gh-backer/top/2/profile)
[![Backer](https://mynode.alexkaul.com/gh-backer/top/3/avatar/60)](https://mynode.alexkaul.com/gh-backer/top/3/profile)
[![Backer](https://mynode.alexkaul.com/gh-backer/top/4/avatar/60)](https://mynode.alexkaul.com/gh-backer/top/4/profile)
[![Backer](https://mynode.alexkaul.com/gh-backer/top/5/avatar/60)](https://mynode.alexkaul.com/gh-backer/top/5/profile)
[![Backer](https://mynode.alexkaul.com/gh-backer/top/6/avatar/60)](https://mynode.alexkaul.com/gh-backer/top/6/profile)
[![Backer](https://mynode.alexkaul.com/gh-backer/top/7/avatar/60)](https://mynode.alexkaul.com/gh-backer/top/7/profile)
[![Backer](https://mynode.alexkaul.com/gh-backer/top/8/avatar/60)](https://mynode.alexkaul.com/gh-backer/top/8/profile)
[![Backer](https://mynode.alexkaul.com/gh-backer/top/9/avatar/60)](https://mynode.alexkaul.com/gh-backer/top/9/profile)

Thank you for your support! 🙌

[[Donate](https://mynode.alexkaul.com/gh-donate)]

## License

MIT © Alex Kaul


