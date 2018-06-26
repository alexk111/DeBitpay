import $ from 'jquery'
import {btnToCopyBtn} from './clipboard'
import {normalizePaymentLink} from './paymentLink'
import {getAndParsePaymentRequest} from './paymentRequest'
import {showModal} from './modals'
import {paymentDataToModalContent} from './paymentModal'
import {htmlHowItWorks} from './howItWorks'

function getParsingState () {
  return (!!$('#indexForm button').prop('disabled'))
}

function setParsingState (val) {
  $('#indexForm button').prop('disabled', val)
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

function initHowItWorks () {
  $('button.how-it-works').click((evt) => {
    evt.preventDefault()
    showModal('How it works?', htmlHowItWorks, { size: 'lg' })
  })
}

function initFooter () {
  btnToCopyBtn($('footer .btn-clipboard'))
}

function loadingDone () {
  $('body > .is-loading').remove()
}

export function initPage () {
  initParseButton()
  initHowItWorks()
  initFooter()
  loadingDone()
}
