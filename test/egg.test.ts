import assertFile from 'assert-file';
import debugUtil from 'debug';
import { rimraf } from 'mz-modules';
import path from 'path';

import { Egg, utils } from '..';

const debug = debugUtil('imorph');

describe('egg.test.ts', () => {
  const fixtures = path.resolve(__dirname, 'fixtures');
  const workspace = path.resolve(__dirname, 'fixtures/egg');
  const destination = path.join(fixtures, '.dist');

  let egg: Egg;
  let config: any;

  beforeAll(async () => {
    const src = path.join(workspace, 'egg.yml');

    config = await utils.load(src);
    debug('config', config);

    egg = new Egg({
      workspace,
      destination,
    });

    await rimraf(destination);
  });

  it('should generate controller', async () => {
    const targets: string[] = [];
    const { controllers } = config;

    for (const name in controllers) {
      if (controllers.hasOwnProperty(name)) {
        debug('controller name', name);
        const controller = controllers[name];
        egg.addController(name, controller);

        const target = egg.getFilePath(name, 'controller');
        targets.push(target);
      }
    }

    await egg.save();
    targets.forEach((t) => assertFile(t));
  });

  it('should generate service', async () => {
    const targets: string[] = [];
    const { services } = config;

    for (const name in services) {
      if (services.hasOwnProperty(name)) {
        debug('service name', name);
        const service = services[name];
        egg.addService(name, service);

        const target = egg.getFilePath(name, 'service');
        targets.push(target);
      }
    }

    await egg.save();
    targets.forEach((t) => assertFile(t));
  });
});
