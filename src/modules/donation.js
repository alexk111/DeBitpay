import $ from 'jquery'

const urlOneTimeAddress = 'https://donate.alexkaul.com/debitpay/widget?isTransparentBg=1'

const tplScreen = `
<div>
  <iframe
    src="${urlOneTimeAddress}"
    allowtransparency="true"
    style="position: fixed; left: 0; top:0; display: block; width: 100%; height: 100%; border: none; background: rgba(204, 207, 210, 0.75); background: radial-gradient(circle, rgba(255, 255, 255, 0.75) 0%, rgba(204, 207, 210, 0.75) 100%);"
  ></iframe>
  <button
    type="button"
    class="close"
    aria-label="Close"
    style="position: fixed; right: 40px; top:20px;"
  >
    <span aria-hidden="true">&times;</span>
  </button>
</div>
`

let $donationScreen
let $preloadLink

export function showDonationScreen() {
  if ($donationScreen) {
    $donationScreen.remove()
  }

  $donationScreen = $(tplScreen)
  $('html').css('overflow', 'hidden')
  $donationScreen
    .hide()
    .appendTo('body')
    .fadeIn(300, 'swing')
  $('button.close', $donationScreen).click(evt => {
    evt.preventDefault()
    $donationScreen.fadeOut(300, 'swing', function() {
      $(this).remove()
      $('html').css('overflow', '')
    })
  })
}

export function preloadDonationScreen() {
  if (!$preloadLink) {
    $preloadLink = $(`<link rel="prefetch" href="${urlOneTimeAddress}">`) // use prefetch, because preload produces a warning for as=document
    $preloadLink.appendTo('head')
  }
}
