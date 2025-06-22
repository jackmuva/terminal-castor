# terminal-castor - the ai app meant to train you to be proficient with the terminal and then be deleted
For MacOS terminal
## dev setup
### electron app
- use `npm run start` to start the electron app
- use `npm run tw` to create the tailwind output.css
### Cloudflare Worker
- use `npm run dev` to start localhost for development
- use `npm run deploy` to deploy cloudflare worker
    - use `npx wrangler login` if you need to auth the right cloudflare account
- update the `wrangler.jsonc` with the right env variables if deploying
    - update the `.dev.vars` files for running locally

