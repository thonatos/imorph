import camelcase from 'camelcase';
import Base, { IOptions } from './base';

export default class Render extends Base {
  constructor(options: IOptions) {
    super(options);
  }

  public async addService(namespace: string, service: IService) {
    const filePath = this.getFilePath(namespace, 'services');
    const sourceFile = this.project.createSourceFile(filePath);
    const { description, methods } = service;

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
        docs: [
          {
            description: methodDescription,
          },
        ],
        isAsync: true,
      });

      // parameters
      request.forEach((parameter) => {
        const {
          name: parameterName,
          type: parameterType,
          required: parameterRequired,
          // description: parameterDescription,
        } = parameter;

        // TODO
        // supoort add jsdoc tag
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
      classMethod.setBodyText(`
        return this.ctx.proxy.${namespace}.${methodName}(${params.join(',')});
      `);

      // return
      const { type: returnType } = response;
      classMethod.setReturnType(`Promise<${returnType}>`);
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
  description: string;
}

interface IMethod {
  name: string;
  description: string;
  request: IParameter[];
  response: {
    type: string;
  };
}

interface IService {
  description: string;
  methods: IMethod[];
}
