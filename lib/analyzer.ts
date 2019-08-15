import {
  CallExpression,
  Expression,
  ExpressionStatement,
  ImportDeclaration,
  SourceFile,
  Statement,
  VariableStatement,
} from 'ts-morph';
import Base, { IOptions } from './base';
import { extractDependencyName } from './utils';

export default class Analysis extends Base {
  constructor(options: IOptions) {
    super(options);
  }

  /**
   * extract dependencies
   *
   * @param {Object} packageInfo package info
   * @returns {Object} package dependencies
   */
  public extractDependencies(packageInfo: IPackageInfo) {
    const workspace = this.workspace;
    const pkgDependencies = packageInfo.dependencies || {};

    // source files
    const sourceFiles = this.project.addExistingSourceFiles(
      `${workspace}/**/*.{ts|js}`
    );

    // extract modules
    const projectModules = this.extractModules(sourceFiles);

    const dependencies = this.combineDependencies(
      pkgDependencies,
      projectModules
    );

    return {
      dependencies,
    };
  }

  public handleCallExpression(
    expression: Expression | CallExpression
  ): string | undefined {
    if (expression.getKindName() !== 'CallExpression') {
      return;
    }

    const identifier = (expression as CallExpression).getExpression();

    if (identifier.getText() === 'require') {
      const args = (expression as CallExpression).getArguments();
      const stringLiteral: any = args[0];
      return stringLiteral.getLiteralText();
    }
  }

  /**
   * match rules:
   *   ```ts
   *
   *   // js
   *   require('egg')
   *   require('@ali/mm')
   *   require('egg-mock/bootstrap')
   *   require('./test');
   *   require('/test');
   *   const egg = require('egg')
   *   const mz = require('mz-modules'), debug = require('debug')
   *   const { Service } = require('egg')
   *
   *   // ts
   *   import Egg from 'egg'
   *   import { Service } from 'egg'
   *   ```
   *
   * @param {Statement} statement AST Statement
   * @return {Array} modules ['egg', './req', '/lib']
   */
  private handleStatement(statement: Statement) {
    const kindName = statement.getKindName();

    // match：import
    if (kindName === 'ImportDeclaration') {
      const moduleName = (statement as ImportDeclaration)
        .getModuleSpecifier()
        .getLiteralText();
      return [moduleName];
    }

    // match：require('egg')
    if (kindName === 'ExpressionStatement') {
      const expression = (statement as ExpressionStatement).getExpression();
      const moduleName = this.handleCallExpression(expression);
      return moduleName ? [moduleName] : [];
    }

    // match：const egg = require('egg')
    if (kindName === 'VariableStatement') {
      const modules: string[] = [];

      (statement as VariableStatement)
        .getDeclarations()
        .forEach((variableDeclaration) => {
          const initializer = variableDeclaration.getInitializer();
          if (!initializer) { return; }
          const moduleName = this.handleCallExpression(initializer);

          if (moduleName) {
            modules.push(moduleName);
          }
        });

      return modules;
    }

    return [];
  }

  private extractModules(files: SourceFile[]) {
    const all: string[] = [];
    return files.reduce((acc, curr) => {
      const fileModules: string[] = [];
      curr.getStatements().forEach((statement) => {
        const modules = this.handleStatement(statement);
        fileModules.push(...modules);
      });
      return acc.concat(fileModules);
    }, all);
  }

  private combineDependencies(pkgDependencies: IDependencies, projectModules: string[]) {
    const dependencies: IDependencies = {};

    const deps = this.filterDependencies(projectModules);

    for (const name of deps) {
      if (!name) {
        continue;
      }

      const version = pkgDependencies[name];
      if (version) {
        dependencies[name] = version;
      }
    }

    return dependencies;
  }

  /**
   * handle dependencies
   * @param {Array} modules project modules
   */
  private filterDependencies(modules: string[]) {
    const dependencies = new Set<string>();
    for (const moduleName of modules) {
      const name = extractDependencyName(moduleName);
      if (name) {
        dependencies.add(name);
      }
    }
    return dependencies;
  }
}

interface IDependencies {
  [key: string]: string;
}

interface IPackageInfo {
  dependencies: IDependencies;
}
