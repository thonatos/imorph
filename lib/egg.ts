import pathToRegexp from 'path-to-regexp';
import Base, { IOptions } from './base';

export default class Render extends Base {
  constructor(options: IOptions) {
    super(options);
  }

  public createClass(namespace: string, options: IClassOptions) {
    const { base, detail, dest, type, framework } = options;

    if (!type || !dest) {
      throw new Error('class type and dest is required.');
    }

    // source file
    const className = this.getClassName(namespace, type);
    const classPath = this.getFilePath(namespace, dest);
    const sourceFile = this.project.createSourceFile(classPath);

    // import
    sourceFile.addImportDeclaration({
      namedImports: [base],
      moduleSpecifier: framework,
    });

    // default class
    const { description = className } = detail;
    const exportedClass = sourceFile.addClass({
      name: className,
      extends: base,
      isDefaultExport: true,
      docs: [{ description }],
    });

    return {
      sourceFile,
      exportedClass,
    };
  }

  public async addService(namespace: string, service: IService) {
    const { sourceFile, exportedClass } = this.createClass(namespace, {
      type: 'service',
      dest: 'service',
      base: 'Service',
      detail: service,
      framework: 'egg',
    });

    const { methods } = service;

    // class methods
    methods.forEach((method) => {
      const {
        request,
        response,
        name: methodName,
        description: methodDescription,
      } = method;

      const classMethod = exportedClass.addMethod({
        isAsync: true,
        name: methodName,
      });

      // parameters
      request.forEach((parameter) => {
        const {
          name: parameterName,
          type: parameterType,
          required: parameterRequired,
        } = parameter;

        classMethod.addParameter({
          name: parameterName,
          type: parameterType,
          hasQuestionToken: !parameterRequired,
        });
      });

      // body
      const params = request.map((p) =>
        p.required ? p.name : `${p.name} || null`
      );

      classMethod.setBodyText(
        `return this.ctx.proxy.${namespace}.${methodName}(${params.join(',')});`
      );

      // return
      const { type: returnType, description: returnDescription } = response;
      classMethod.setReturnType(`Promise<${returnType}>`);

      // jsdoc
      classMethod.addJsDoc({
        description: (writer) => {
          // description
          writer.writeLine(methodDescription);

          // @param {string} author - The author of the book.
          request.map(({ name, type, description: parameterDescription }) =>
            writer.writeLine(
              `@param {${type}} ${name} - ${parameterDescription}`
            )
          );

          // @returns {number}
          writer.write(`@returns {${returnType}} ${returnDescription}`);
        },
      });
    });

    // format
    sourceFile.formatText({
      indentSize: 2,
    });
  }

  public addController(namespace: string, controller: IController) {
    const { sourceFile, exportedClass } = this.createClass(namespace, {
      type: 'controller',
      dest: 'controller',
      base: 'Controller',
      detail: controller,
      framework: 'egg',
    });

    const { prefix, routes } = controller;

    // class methods
    routes.forEach((route) => {
      const {
        path: routePath,
        name: methodName,
        body = [],
        query = [],
        method: routeMethod,
        handler: handlerName,
        description: methodDescription,
      } = route;

      const classMethod = exportedClass.addMethod({
        isAsync: true,
        name: methodName,
        docs: [{
          description: methodDescription,
        }],
      });

      const keys: any = [];
      const re = pathToRegexp(routePath, keys);
      const params = keys.map((k) => k.name);

      const bodyText: string[] = [];

      if (params.length > 0) {
        bodyText.push(`const { ${params.join(',')} } = this.ctx.params;`);
      }

      if (query.length > 0) {
        bodyText.push(`const { ${query.join(',')} } = this.ctx.query;`);
      }

      if (body.length > 0) {
        bodyText.push(`const { ${body.join(',')} } = this.ctx.request.body;`);
      }

      bodyText.push(
        `return this.ctx.service.${handlerName}( ${[...params, ...query, ...body, ].join(',')} );`
      );

      classMethod.setBodyText((writer) => {
        bodyText.map((t) => writer.writeLine(t));
      });
    });

    // format
    sourceFile.formatText({
      indentSize: 2,
    });

  }
}

interface IParameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

interface IMethod {
  name: string;
  description: string;
  request: IParameter[];
  response: {
    type: string;
    description?: string;
  };
}

interface IService {
  methods: IMethod[];
  description?: string;
}

interface IRoute {
  name: string;
  path: string;
  body?: string[];
  query?: string[];
  method: string;
  handler: string;
  description: string;
}

interface IController {
  routes: IRoute[];
  prefix?: string;
  description?: string;
}

interface IClassOptions {
  base: string;
  type: string;
  dest: string;
  detail: IService | IController;
  framework: string;
}
