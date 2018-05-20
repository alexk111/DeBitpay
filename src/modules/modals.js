import $ from 'jquery'

import {btnToCopyBtn} from './clipboard'

const tplModal = `
<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
`

let $modal

export function showModal (title, $content, opts) {
  opts = opts || {}

  if ($modal) {
    $modal.remove()
  }

  $modal = $(tplModal)
  $('.modal-title', $modal).text(title)
  $('.modal-body', $modal).append($content)
  if (opts.size) {
    $('.modal-dialog', $modal).addClass('modal-' + opts.size)
    $('.modal-footer .btn', $modal).addClass('btn-' + opts.size)
  }
  $modal.appendTo('body').modal({
    keyboard: true,
    show: true
  })

  btnToCopyBtn($('.btn-clipboard', $modal), $modal)
}

