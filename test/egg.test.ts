import Debug from 'debug';
import { rimraf } from 'mz-modules';
import path from 'path';

import { Egg, utils } from '..';

const debug = Debug('imorph');

describe('egg.test.ts', () => {
  const workspace = path.resolve(__dirname, 'fixtures/egg');
  const distDir = '.dist';
  const targetDir = path.join(workspace, distDir);

  beforeEach(async () => {
    await rimraf(targetDir);
  });

  test('should work', async () => {
    const sourceFile = path.join(workspace, 'egg.yml');
    const config = await utils.load(sourceFile);

    debug('config', config);

    const egg = new Egg({
      distDir,
      workspace,
    });

    const { services } = config;

    for (const name in services) {
      if (services.hasOwnProperty(name)) {
        debug('name', name);
        const service = services[name];
        egg.addService(name, service);
      }
    }

    await egg.save();
    // expect(name).toBe('imorph');
  });
});
