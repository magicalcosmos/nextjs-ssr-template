const execa = require('execa');
// const consola = require('consola');
const argv = require('yargs/yargs')(process.argv.slice(2)).parse();

async function buildSrc(env, { analyze } = {}) {
  console.info(`start building app...`);

  const cmdArr = [
    'cross-env',
    `NEXT_APP_ENV=${env}`,
    `ANALYZE=${analyze}`,
    'next build',
  ];

  const cmdStr = cmdArr.join(' ');

  await execa.command(cmdStr, {
    stdio: 'inherit',
  });

  console.info(`App build complete.`);
}

async function run() {
  try {
    const { env = 'production', analyze } = argv;

    console.info('build with analyze?', analyze === '1' ? 'yes' : 'no');

    await buildSrc(env, { analyze });
  } catch (err) {
    console.error(err);
  }
}

run();
