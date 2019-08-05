# iMorph

> a morph lib.

## Features

### Egg generator

> Use the specific description file to generate a egg application.

#### TODO

- [ ] egg controllers
- [x] egg services
- [ ] egg router
- [ ] egg config

```yml
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
        description: get user detaik by user id

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

## More
