import camelcase from 'camelcase';
import path from 'path';
import { CompilerOptions, Project, QuoteKind, ScriptTarget } from 'ts-morph';

export default class Base {
  public extname: string;
  public project: Project;
  public workspace: string;
  public destination: string;

  constructor(options: IOptions) {
    const {
      extname= 'ts',
      workspace = process.cwd(),
      destination,
      compilerOptions = {
        strict: true,
        target: ScriptTarget.ESNext,
      },
      manipulationSettings = {
        quoteKind: QuoteKind.Single,
      },
    } = options;

    const project = new Project({
      compilerOptions,
      manipulationSettings,
    });

    this.extname = extname;
    this.project = project;
    this.workspace = workspace;
    this.destination = destination || workspace;
  }

  public getClassName(namespace: string, type: string = '') {
    return camelcase(`${namespace}_${type}`, {
      pascalCase: true,
    });
  }

  public getFileName(name: string) {
    const {extname} = this;
    return `${name}.${extname}`;
  }

  public getFilePath(name: string, prefix: string = '') {
    const { destination } = this;
    const fileName = this.getFileName(name);
    return path.join(destination , prefix, fileName);
  }

  public load(configPath: string) {
    throw new Error('TODO.');
  }

  public dump(configPath: string) {
    throw new Error('TODO.');
  }

  public async save() {
    await this.project.save();
  }
}

export interface IOptions {
  extname?: string;
  workspace: string;
  destination?: string;
  manipulationSettings?: any;
  compilerOptions?: CompilerOptions;
}
