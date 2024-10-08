# Minimal Webflow Developement Starter

Uses [vite](https://vitejs.dev/) to run dev server and to minify output.

## Setup

- Clone
- Rename
- Open: `code .`
- `pnpm install`
- `git init`
- Push

## Usage

### Run locally

`pnpm run dev`: http://localhost:5555`

Local dev script can be added in Weblfow:

```
<script src="http://localhost:5555/main.js"></script>
```

Or in Chrome browser console:

```
var ele = document.createElement("script");
var scriptPath = "http://localhost:5555/main.js" //verify the script path
ele.setAttribute("src",scriptPath);
document.head.appendChild(ele)

```

### Minify and copy to webflow

`pnpm run build`
