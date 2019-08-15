# iMorph &middot; [![GitHub license][license-square]][license-url]

[![Egg.js][egg-square]][egg-url]
[![Semantic Release][semantic-release-square]][semantic-release-url]
[![NPM Version][npm-square]][npm-url]
[![Codecov][codecov-square]][codecov-url]

[license-square]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: https://github.com/thonatos/imorph/blob/HEAD/LICENSE
[egg-square]: https://img.shields.io/badge/Awesome-Egg.js-ff69b4.svg?style=flat-square
[egg-url]: https://eggjs.org/
[npm-square]: https://img.shields.io/npm/v/imorph.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/imorph
[codecov-square]: https://img.shields.io/codecov/c/github/thonatos/imorph.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/thonatos/imorph
[semantic-release-square]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[github-actions-square]: https://github.com/thonatos/imorph/workflows/Actions%20Release/badge.svg?style=flat-square
[github-actions-url]: https://github.com/thonatos/imorph

> a morph lib.

[![Github Actions][github-actions-square]][github-actions-url]

## Features

### Code Analyzer

- [x] analysis project dependencies

### Egg generator

> Use the specific description file to generate an egg application.

#### TODO

- [x] egg controllers
- [x] egg services
- [ ] egg router
- [ ] egg config

config file

```yml
# egg.yml

version: '1.0.0'

models:
  user:
    - id: number
    - name: string
    - mail: string
    - nickname: string

controllers:
  user:
    routes:
      - route: /user/:id
        method: GET
        auth: 'BASIC_LOGIN'
        description: get user detail by user id

services:
  user:
    methods:
      - name: getUserById
        description: get user detail by user id
        request:
          - name: id
            type: number
            required: true
            description: user id
        response:
          type: any
          description: user detail
      - name: getUserByName
        description: get user detail by user name
        request:
          - name: name
            type: string
            required: true
            description: user name
          - name: privateInfo
            type: boolean
            required: false
            description: show private user info
        response:
          type: any
          description: user detail
    description: user service

plugins:
  - buc
  - acl
```

services code

```typescript
// services/user.ts

import { Service } from 'egg';

/**
 * user service
 */
export default class UserService extends Service {
  /**
   * get user detail by user id
   * @param {number} id - user id
   * @return {any} user detail
   */
  public async getUserById(id: number): Promise<any> {
    return this.ctx.proxy.user.getUserById(id);
  }

  /**
   * get user detail by user name
   * @param {string} name - user name
   * @param {boolean} privateInfo - show private user info
   * @return {any} user detail
   */
  public async getUserByName(name: string, privateInfo?: boolean): Promise<any> {
    return this.ctx.proxy.user.getUserByName(name, privateInfo || null);
  }
}
```

## Development

### prepare

```bash
yarn
```

### test

```bash
yarn test
```

> you can debug with Visual Studio Code (Jest).
