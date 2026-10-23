# SVAR React Gantt: task grid rows jump while scrolling (React 19)

Minimal reproduction with `@svar-ui/react-gantt` 2.8.1 (`@svar-ui/react-grid` 2.7.6), 115 tasks and default settings. The same page runs on React 19.2.7, on React 18.3.1, or on React 19.2.7 with a one-line react-grid fix applied at build time.

```sh
npm install
npm run dev:react19          # http://localhost:5191
npm run dev:react18          # http://localhost:5181
npm run dev:react19-fixed    # http://localhost:5192
npm run prod:react19         # http://localhost:4191  (production build)
npm run prod:react18         # http://localhost:4181
npm run prod:react19-fixed   # http://localhost:4192
```

Scroll the task list up and down. On React 19 the rows on the left jump by one or more rows and snap back, while the bars on the right stay put. Project and group rows are colored (CSS only) so the jump is easy to see. Add `?fullwidth` to stretch the project bars across the chart, like the cargo dividers in our app. It's easier to see with DevTools > Performance > CPU 4x slowdown.

The bar at the top counts DOM states, checked at the end of each task, where a grid row and its bar are more than 20 px apart. These are states the browser can paint. Press Reset before scrolling.

- `src/main.jsx`: the Gantt
- `src/probe.js`: the counter only
- `vite.config.js`: React 18 aliasing and the react-grid fix (`react19-fixed` mode)
