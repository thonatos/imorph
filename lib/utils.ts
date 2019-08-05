// import lowerCaseFirst from 'lower-case-first';

import fs from 'fs';
import yaml from 'js-yaml';

const load = async (filepath: string) => {
  const content = fs.readFileSync(filepath, {
    encoding: 'utf8',
  });

  return yaml.safeLoad(content);
};

export default {
  load,
};
