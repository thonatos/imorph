import camelcase from 'camelcase';
import Base, { IOptions } from './base';

export default class Render extends Base {
  constructor(options: IOptions) {
    super(options);
  }

  public async addService(namespace: string, service: IService) {
    const filePath = this.getFilePath(namespace, 'services');
    const sourceFile = this.project.createSourceFile(filePath);
    const { description = '', methods } = service;

    const serviceName = camelcase(`${namespace}_service`, {
      pascalCase: true,
    });

    // import
    sourceFile.addImportDeclaration({
      moduleSpecifier: 'egg',
      namedImports: ['Service'],
    });

    // class
    const exportedClass = sourceFile.addClass({
      name: serviceName,
      isDefaultExport: true,
      extends: 'Service',
      docs: [{ description }],
    });

    // method
    methods.forEach((method) => {
      const {
        name: methodName,
        description: methodDescription,
        request,
        response,
      } = method;

      const classMethod = exportedClass.addMethod({
        name: methodName,
        isAsync: true,
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
          hasQuestionToken: !parameterRequired,
          type: parameterType,
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

          // parameters
          request.map(({ name, type, description: parameterDescription }) =>
            // @param {string} author - The author of the book.
            writer.writeLine(
              `@param {${type}} ${name} - ${parameterDescription}`
            )
          );

          // return
          // @returns {number}
          writer.write(`@return {${returnType}} ${returnDescription}`);
        },
      });
    });

    sourceFile.formatText({
      indentSize: 2,
    });
  }

  public addController(namespace: string, controller: any) {
    throw new Error('TODO.');
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
