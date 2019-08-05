import Debug from 'debug';
import { rimraf } from 'mz-modules';
import path from 'path';

import { Egg, utils } from '..';

const debug = Debug('imorph');

describe('egg.test.ts', () => {
  const dist = '.dist';
  const workspace = path.resolve(__dirname, 'fixtures/egg');
  const destination = path.join(workspace, dist);

  beforeEach(async () => {
    await rimraf(destination);
  });

  test('should work', async () => {
    const src = path.join(workspace, 'egg.yml');
    const config = await utils.load(src);

    debug('config', config);

    const egg = new Egg({
      dist,
      workspace,
    });

    const { services, controllers } = config;

    for (const name in services) {
      if (services.hasOwnProperty(name)) {
        debug('name', name);
        const service = services[name];
        egg.addService(name, service);
      }
    }

    for (const name in controllers) {
      if (controllers.hasOwnProperty(name)) {
        debug('name', name);
        const controller = controllers[name];
        egg.addController(name, controller);
      }
    }

    await egg.save();
    // expect(name).toBe('imorph');
  });
});
