// import lowerCaseFirst from 'lower-case-first';

import fs from 'fs';
import yaml from 'js-yaml';
import pathToRegexp from 'path-to-regexp';

export const load = async (filepath: string) => {
  const content = fs.readFileSync(filepath, {
    encoding: 'utf8',
  });

  return yaml.safeLoad(content);
};

export const getPathParams = (urlPath: string) => {
  if (!urlPath) {
    return [];
  }

  const keys: any[] = [];
  const re = pathToRegexp(urlPath, keys);
  return keys.map((k) => k.name);
};

export default {
  load,
  getPathParams,
};
