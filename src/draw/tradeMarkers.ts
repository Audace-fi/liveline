import type { ChartLayout, TradeMarker } from '../types'

const BUY = '#22c55e'
const SELL = '#ef4444'

/**
 * Draws trade markers (e.g. whale prints) at (time, price): a filled, outlined
 * circle whose radius scales with the trade's size relative to the largest
 * visible trade, coloured green for buys and red for sells. Clipped to the plot.
 */
export function drawTradeMarkers(
  ctx: CanvasRenderingContext2D,
  layout: ChartLayout,
  trades: TradeMarker[],
  alpha: number,
): void {
  if (!trades || trades.length === 0 || alpha < 0.01) return
  const { toX, toY, leftEdge, rightEdge, pad, chartW, chartH } = layout

  // Relative sizing from the largest currently-visible trade.
  let maxSize = 0
  for (const t of trades) {
    if (t.time < leftEdge || t.time > rightEdge) continue
    if (t.size > maxSize) maxSize = t.size
  }
  if (maxSize <= 0) return

  ctx.save()
  ctx.beginPath()
  ctx.rect(pad.left, pad.top, chartW, chartH)
  ctx.clip()
  for (const t of trades) {
    if (t.time < leftEdge || t.time > rightEdge) continue
    const x = toX(t.time)
    const y = toY(t.price)
    const r = 3 + Math.sqrt(Math.max(0, t.size) / maxSize) * 9
    const col = t.side === 'buy' ? BUY : SELL
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.globalAlpha = alpha * 0.3
    ctx.fillStyle = col
    ctx.fill()
    ctx.globalAlpha = alpha * 0.85
    ctx.lineWidth = 1.25
    ctx.strokeStyle = col
    ctx.stroke()
  }
  ctx.restore()
}
