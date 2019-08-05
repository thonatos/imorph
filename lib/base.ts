import camelcase from 'camelcase';
import path from 'path';
import { CompilerOptions, Project, QuoteKind, ScriptTarget } from 'ts-morph';

export default class Base {
  public ext: string;
  public distDir: string;
  public workspace: string;
  public project: Project;

  constructor(options: IOptions) {
    const {
      ext = 'ts',
      distDir = '.dist',
      workspace = process.cwd(),
      compilerOptions = {
        strict: true,
        target: ScriptTarget.ESNext,
      },
      manipulationSettings = {
        quoteKind: QuoteKind.Single,
      },
    } = options;

    this.workspace = workspace;

    this.ext = ext;
    this.distDir = distDir;

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
    const { ext } = this;
    return `${name}.${ext}`;
  }

  public getFilePath(name: string, prefix: string = '') {
    const { workspace, distDir } = this;
    const fileName = this.getFileName(name);
    return path.join(workspace, distDir , prefix, fileName);
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
  workspace: string;
  ext?: string;
  distDir?: string;
  compilerOptions?: CompilerOptions;
  manipulationSettings?: any;
}
