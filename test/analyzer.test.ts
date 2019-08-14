import assert from 'assert';
import debugUtil from 'debug';
import path from 'path';
import { Analyzer } from '..';

const debug = debugUtil('imorph');

describe('analyzer.test.ts', () => {
  const workspace = path.resolve(__dirname, 'fixtures/analyzer');
  const pkgInfo = require(path.join(workspace, 'package.json'));

  let analyzer: Analyzer;

  beforeAll(async () => {
    analyzer = new Analyzer({
      workspace,
    });
  });

  it('should return dependencies', async () => {
    const { dependencies } = analyzer.extractDependencies(pkgInfo);
    debug('dependencies', dependencies);

    assert.deepEqual(Object.keys(dependencies).sort(), [ 'egg', 'egg-ci', 'mz-modules' ]);
  });
});
