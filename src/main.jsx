import React from 'react'
import { createRoot } from 'react-dom/client'
import { Gantt, Willow } from '@svar-ui/react-gantt'
import '@svar-ui/react-gantt/all.css'
import './style.css'
import { installGridAlignmentProbe } from './probe.js'

// 5 projects x 2 groups x 10 tasks = 115 rows, enough for vertical virtualization.
const tasks = []
const start = new Date(2026, 9, 13)
for (let p = 0; p < 5; p++) {
  const project = `project-${p}`
  tasks.push({ id: project, text: `Project ${p + 1}`, type: 'summary', open: true })
  for (let g = 0; g < 2; g++) {
    const group = `group-${p}-${g}`
    tasks.push({ id: group, parent: project, text: `Group ${g + 1}`, type: 'summary', open: true })
    for (let t = 0; t < 10; t++) {
      tasks.push({
        id: `task-${p}-${g}-${t}`,
        parent: group,
        text: `Task ${t + 1}`,
        type: 'task',
        start: new Date(start.getTime() + (p + t * 0.2) * 86_400_000),
        duration: 1,
      })
    }
  }
}
const fullWidth = new URLSearchParams(location.search).has('fullwidth')

const fixed = import.meta.env.MODE === 'react19-fixed' ? ' + useLayoutEffect fix' : ''
installGridAlignmentProbe(`React ${React.version}${fixed}`)

createRoot(document.getElementById('root')).render(
  <div className={fullWidth ? 'gantt fullwidth' : 'gantt'}>
    <Willow>
      <Gantt tasks={tasks} />
    </Willow>
  </div>,
)
