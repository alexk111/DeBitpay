import $ from 'jquery'
import {btnToCopyBtn} from './clipboard'
import {normalizePaymentLink} from './paymentLink'
import {getAndParsePaymentRequest} from './paymentRequest'
import {showModal} from './modals'
import {paymentDataToModalContent} from './paymentModal'
import {htmlHowToRunLocally} from './howToRunLocally'
import {htmlHowItWorks} from './howItWorks'
import {htmlImportantNotice} from './importantNotice'
import {showDonationScreen, preloadDonationScreen} from './donation'

const isLocalApp = (window.location.protocol === 'file:')

function getParsingState () {
  return (!!$('#indexForm button').prop('disabled'))
}

function setParsingState (val) {
  $('#indexForm button').prop('disabled', val)
}

function initTitle () {
  if (isLocalApp) {
    $('#app-title').text('DeBitpay (Local)')
    document.title = 'DeBitpay (Local)'
  }
}

function initParseButton () {
  $('#indexForm').submit((evt) => {
    evt.preventDefault()

    if (!getParsingState()) {
      setParsingState(true)
      const invUrl = $('#indexForm input').val()
      if (invUrl) {
        getAndParsePaymentRequest(normalizePaymentLink(invUrl))
          .done((data) => {
            showModal('Payment Request Data', paymentDataToModalContent(data), { size: 'lg' })
            setParsingState(false)
          })
          .fail((err) => {
            showModal('Error', err)
            setParsingState(false)
          })
      } else {
        showModal('Warning', 'Enter Payment URL or Invoice Page URL to continue')
        setParsingState(false)
      }
    }
  })
}

function initHowToRunLocally () {
  if (isLocalApp) {
    // hide 'how to run locally' button if local version is opened
    $('button.how-to-run-locally').remove()
  } else {
    $('button.how-to-run-locally').click((evt) => {
      evt.preventDefault()
      showModal('How To Run DeBitpay Locally', htmlHowToRunLocally, { size: 'lg' })
    })
  }
}

function initHowItWorks () {
  $('button.how-it-works').click((evt) => {
    evt.preventDefault()
    showModal('How It Works', htmlHowItWorks, { size: 'lg' })
  })
}

function initImportantNotice () {
  $('button.important-notice').click((evt) => {
    evt.preventDefault()
    showModal('Important Notice', htmlImportantNotice, { size: 'lg' })
  })
}

function initDonate() {
  $('button.donate').click(evt => {
    evt.preventDefault()
    showDonationScreen()
  })
  $('button.donate').mouseover(_ => {
    preloadDonationScreen()
  })
}

function initFooter () {
  btnToCopyBtn($('footer .btn-clipboard'))
}

function loadingDone () {
  $('body > .is-loading').remove()
}

export function initPage () {
  initTitle()
  initParseButton()
  initHowToRunLocally()
  initHowItWorks()
  initImportantNotice()
  initDonate()
  initFooter()
  loadingDone()
}
