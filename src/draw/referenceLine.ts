import type { LivelinePalette, ChartLayout, ReferenceLine } from '../types'

export function drawReferenceLine(
  ctx: CanvasRenderingContext2D,
  layout: ChartLayout,
  palette: LivelinePalette,
  ref: ReferenceLine,
) {
  const { w, h, pad, toY, chartW } = layout
  const y = toY(ref.value)

  if (y < pad.top - 10 || y > h - pad.bottom + 10) return

  const label = ref.label ?? ''
  const stroke = ref.color ?? palette.refLine
  const labelColor = ref.color ?? palette.refLabel

  // Left-aligned: dashed line across the plot + a filled colored tag at the left edge.
  // Used for order/entry lines so their labels don't collide with the centered Index label.
  if (ref.align === 'left' && label) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(pad.left, y)
    ctx.lineTo(w - pad.right, y)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.font = '600 10px system-ui, sans-serif'
    const tw = ctx.measureText(label).width
    const padX = 5
    const tagH = 14
    ctx.fillStyle = stroke
    ctx.fillRect(pad.left, y - tagH / 2, tw + padX * 2, tagH)
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, pad.left + padX, y + 0.5)
    ctx.textBaseline = 'alphabetic'
    return
  }

  if (label) {
    ctx.font = '500 11px system-ui, sans-serif'
    const textW = ctx.measureText(label).width
    const centerX = pad.left + chartW / 2
    const gapPad = 8

    // Line left of text
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(pad.left, y)
    ctx.lineTo(centerX - textW / 2 - gapPad, y)
    ctx.stroke()

    // Line right of text
    ctx.beginPath()
    ctx.moveTo(centerX + textW / 2 + gapPad, y)
    ctx.lineTo(w - pad.right, y)
    ctx.stroke()

    // Label
    ctx.fillStyle = labelColor
    ctx.textAlign = 'center'
    ctx.fillText(label, centerX, y + 4)
  } else {
    // Full line, no label
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(pad.left, y)
    ctx.lineTo(w - pad.right, y)
    ctx.stroke()
    ctx.setLineDash([])
  }
}
