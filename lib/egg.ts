
import Base, { IOptions } from './base';

export default class Render extends Base {
  constructor(options: IOptions) {
    super(options);
  }

  public async addService(namespace: string, service: IService, options?: IServiceOptions) {
    // service
    const classType = 'service';
    const className = this.getClassName(namespace, classType);
    const classTarget = 'services';

    // file
    const filePath = this.getFilePath(namespace, classTarget);
    const sourceFile = this.project.createSourceFile(filePath);

    // import
    const {
      baseFramework = 'egg',
      baseService = 'Service',
    } = options || {};

    sourceFile.addImportDeclaration({
      namedImports: [baseService],
      moduleSpecifier: baseFramework,
    });

    // default class
    const { description = className, methods } = service;
    const exportedClass = sourceFile.addClass({
      name: className,
      extends: baseService,
      isDefaultExport: true,
      docs: [{ description }],
    });

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
      const params = request.map((p) => p.required ? p.name : `${p.name} || null`);

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
          request.map(
            ({ name, type, description: parameterDescription }) =>
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

interface IServiceOptions {
  baseService?: string;
  baseFramework?: string;
}
