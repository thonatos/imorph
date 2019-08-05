import camelcase from 'camelcase';
import path from 'path';
import { CompilerOptions, Project, QuoteKind, ScriptTarget } from 'ts-morph';

export default class Base {
  public dist: string;
  public extname: string;
  public project: Project;
  public workspace: string;

  constructor(options: IOptions) {
    const {
      dist = '.dist',
      extname= 'ts',
      workspace = process.cwd(),
      compilerOptions = {
        strict: true,
        target: ScriptTarget.ESNext,
      },
      manipulationSettings = {
        quoteKind: QuoteKind.Single,
      },
    } = options;

    this.dist = dist;
    this.extname = extname;
    this.workspace = workspace;

    this.project = new Project({
      compilerOptions,
      manipulationSettings,
    });
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
    const { workspace, dist } = this;
    const fileName = this.getFileName(name);
    return path.join(workspace, dist , prefix, fileName);
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
  dist?: string;
  extname?: string;
  workspace: string;
  manipulationSettings?: any;
  compilerOptions?: CompilerOptions;
}
