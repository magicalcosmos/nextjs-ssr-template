/* for development mode */

const argv = require('yargs/yargs')(process.argv.slice(2)).parse();
const execa = require('execa');

async function run() {
  try {
    const { env = 'development', host = '0.0.0.0', port = 9527, https } = argv;
    const cmdStr = `cross-env NODE_ENV=development HOST=${host} PORT=${port} NEXT_APP_HTTPS=${https} NEXT_APP_ENV=${env} node server/index.js`;

    await execa.command(cmdStr, {
      stdio: 'inherit',
    });
  } catch (err) {
    console.error(err);
  }
}

run();
