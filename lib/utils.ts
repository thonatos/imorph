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

export const extractDependencyName = (moduleName: string) => {
  if (!moduleName) {
    return;
  }

  const first = moduleName[0];
  // ignore file path, `require('./test')`
  if (first === '.' || first === '/') {
    return;
  }

  const arr = moduleName.split('/');
  const name = first === '@' ? `${arr[0]}/${arr[1]}` : arr[0];

  return name;
};

export default {
  load,
  getPathParams,
  extractDependencyName,
};
