import $ from 'jquery'
import ClipboardJS from 'clipboard'

export function btnToCopyBtn ($btn, $container) {
  $btn
    .tooltip()
    .on('mouseleave', function () {
      $(this).tooltip('hide')
    })

  for (let i = 0; i < $btn.length; i++) {
    const clipboard = new ClipboardJS($btn[i], {
      container: ($container ? $container[0] : undefined)
    })

    clipboard.on('success', function (e) {
      $(e.trigger)
        .attr('title', 'Copied!')
        .tooltip('_fixTitle')
        .tooltip('show')
        .attr('title', 'Copy to clipboard')
        .tooltip('_fixTitle')

      e.clearSelection()
    })

    clipboard.on('error', function (e) {
      var modifierKey = /Mac/i.test(navigator.userAgent) ? '\u2318' : 'Ctrl-'
      var fallbackMsg = 'Press ' + modifierKey + 'C to copy'

      $(e.trigger)
        .attr('title', fallbackMsg)
        .tooltip('_fixTitle')
        .tooltip('show')
        .attr('title', 'Copy to clipboard')
        .tooltip('_fixTitle')
    })
  }
}
