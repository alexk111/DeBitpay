import $ from 'jquery'

import {satsToBTC} from './currency'

const paymentFormLabels = {
  'currency': 'Currency',
  'requiredFeeRate': 'Fee Rate (sats/byte)',
  'time': 'Creaated at',
  'expires': 'Expires at',
  'memo': 'Memo',
  'amountBTC': 'Amount',
  'amount': 'Amount in Satoshis',
  'address': 'Address'
}

const paymentFormInfoStruct = [
  ['currency', 'requiredFeeRate'],
  ['time', 'expires'],
  'memo'
]

const paymentFormTxStruct = [
  ['amountBTC', 'amount'],
  'address'
]

const paymentFormTextAreas = [
  'memo'
]

const paymentFormCopyEnabled = [
  'amountBTC', 'amount', 'address'
]

function genInputOrTextArea (dataKey, dataVal) {
  if (paymentFormTextAreas.indexOf(dataKey) > -1) {
    return $(`<textarea class="form-control form-control-lg" readonly>${dataVal}</textarea>`)
  } else {
    const $input = $(`<input type="text" class="form-control form-control-lg" value="${dataVal}" readonly>`)
    if (paymentFormCopyEnabled.indexOf(dataKey) > -1) {
      const $inputGroup = $('<div class="input-group"></div>')
      $inputGroup.append($input).append(`
        <div class="input-group-append">
          <button class="btn btn-clipboard btn-success btn-lg" data-clipboard-text="${dataVal}" title="Copy to clipboard">COPY</button>
        </div>
      `)
      return $inputGroup
    } else {
      return $input
    }
  }
}
function paymentDataToModalContentItem (data, item) {
  let $item
  if (typeof item === typeof []) {
    $item = $('<div class="form-row"></div>')
    item.forEach((subItem) => {
      const $subItem = $(`
        <div class="form-group col-lg">
          <label>${paymentFormLabels[subItem]}</label>
        </div>
      `)
      const $subItemInput = genInputOrTextArea(subItem, data[subItem])
      $subItem.append($subItemInput)
      $item.append($subItem)
    })
  } else {
    $item = $(`
      <div class="form-group">
        <label>${paymentFormLabels[item]}</label>
      </div>
    `)
    const $itemInput = genInputOrTextArea(item, data[item])
    $item.append($itemInput)
  }
  return $item
}

export function paymentDataToModalContent (data) {
  const $content = $('<div></div>')
  paymentFormInfoStruct.forEach((item) => {
    $content.append(paymentDataToModalContentItem(data, item))
  })
  $content.append('<hr>')
  data.outputs.forEach((output) => {
    output.amountBTC = satsToBTC(output.amount)
    paymentFormTxStruct.forEach((item) => {
      $content.append(paymentDataToModalContentItem(output, item))
    })
  })
  return $content
}
