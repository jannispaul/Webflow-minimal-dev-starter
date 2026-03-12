# Minimal Webflow Developement Starter

Repository template that uses [vite](https://vitejs.dev/) to run dev server and to minify output.

## Setup

Use with setup script `new-webflow-project project-name`
```
gh repo create "$PROJECT_NAME" \
  --template jannispaul/Webflow-minimal-dev-starter \
  --private \
  --clone
```

## Usage

### Branches

- Use *dev* for active development.
- Merge into *test* for staging.
- Merge into *main* for production.  


### Run locally

`npm run dev`: http://localhost:5555`

Use with dev proxy: `https://dev.arise.so/?url=https://project.webflow.io`

Use with test proxy: `https://test.arise.so/ ? test=netlify-url.com & url=https://project.webflow.io`


### Minify and deploy to netlify

`pnpm run build`

### Use in webflow

Use script tags with 3 attributes for production, test, and dev environments.

```
<script
  src="https://project.netlify.app/dist/script.js"
  test-src="https://test--project.netlify.app/dist/script.js"
  dev-src="http://localhost:5555/dist/script.js"
></script>
```
