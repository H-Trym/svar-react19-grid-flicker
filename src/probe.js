// Diagnostics only. MutationObserver callbacks run at the end of the task that changed the DOM,
// i.e. before the browser can paint, so every state counted here is one that could be painted.
export function installGridAlignmentProbe(label) {
  const panel = document.createElement('div')
  panel.className = 'probe'
  panel.innerHTML = `
    <strong></strong>
    <span>Misaligned grid states <output data-misaligned>0</output></span>
    <span>DOM updates checked <output data-checked>0</output></span>
    <span>Largest offset <output data-worst>0</output> px</span>
    <button type="button">Reset</button>`
  panel.querySelector('strong').textContent = label
  document.body.append(panel)

  let checked = 0
  let misaligned = 0
  let worst = 0
  let flashTimer
  const show = () => {
    panel.querySelector('[data-misaligned]').value = misaligned
    panel.querySelector('[data-checked]').value = checked
    panel.querySelector('[data-worst]').value = Math.round(worst)
  }
  panel.querySelector('button').addEventListener('click', () => {
    checked = misaligned = worst = 0
    show()
  })

  // Largest vertical distance between a grid row and the chart bar of the same task.
  const offset = (gantt) => {
    let largest = 0
    for (const row of gantt.querySelectorAll('.wx-table .wx-body .wx-row[data-id]')) {
      const bar = gantt.querySelector(`.wx-bar[data-id="${CSS.escape(row.dataset.id)}"]`)
      if (!bar) continue
      const r = row.getBoundingClientRect()
      const b = bar.getBoundingClientRect()
      const delta = r.top + r.height / 2 - (b.top + b.height / 2)
      if (Math.abs(delta) > Math.abs(largest)) largest = delta
    }
    return Math.abs(largest)
  }

  const attach = () => {
    const gantt = document.querySelector('.wx-gantt')
    if (!gantt) return requestAnimationFrame(attach)
    new MutationObserver(() => {
      checked++
      const delta = offset(gantt)
      if (delta > 20) {
        misaligned++
        worst = Math.max(worst, delta)
        panel.classList.add('hit')
        clearTimeout(flashTimer)
        flashTimer = setTimeout(() => panel.classList.remove('hit'), 250)
      }
      show()
    }).observe(gantt, { subtree: true, childList: true, attributes: true, attributeFilter: ['style'] })
  }
  attach()
}
