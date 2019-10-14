/**
 * NornJ tagged templates syntax `nj`(full name is `nj.taggedTmplH`), example:
 * 
 * `nj'<html>Hello World!</html>'()`
 */
declare namespace NornJ {
  /**
   * React(or other such as Preact) components.
   */
  export interface Component { }

  /**
   * NornJ filter options.
   */
  export interface FilterOption {
    onlyGlobal: boolean;
    hasOptions: boolean;
    isOperator: boolean;
    hasLevel: boolean;
    hasTmplCtx: boolean;
    alias: string;
    symbol: string;
    placeholder: string;
    [key: string]: any;
  }

  /**
   * NornJ filter configs.
   */
  export interface FilterConfig {
    [key: string]: FilterOption;
  }

  /**
   * `nj.registerComponent`, register component to NornJ.
   */
  export function registerComponent(name: string, component: Component, options?: object): Component | Component[];

  /**
   * `nj.registerComponent`, register component to NornJ.
   */
  export function registerComponent(options: object): Component | Component[];

  /**
   * `nj.registerFilter`, register filter and expression to NornJ.
   */
  export function registerFilter(name: string, filter: Function, options?: FilterOption, mergeConfig?: boolean): void;

  /**
   * `nj.registerFilter`, register filter and expression to NornJ.
   */
  export function registerFilter(options: object): void;

  /**
   * `nj.registerExtension`, register tag and directive to NornJ.
   */
  export function registerExtension(name: string, extension: Function, options?: object, mergeConfig?: boolean): void;

  /**
   * `nj.registerExtension`, register tag and directive to NornJ.
   */
  export function registerExtension(options: object): void;

  /**
   * `nj.taggedTmpl`, NornJ tagged templates syntax `njs`.
   */
  export function taggedTmpl(strs: TemplateStringsArray, ...args: any);

  /**
   * `nj.taggedTmplH`, NornJ tagged templates syntax `nj` and `html`.
   */
  export function taggedTmplH(strs: TemplateStringsArray, ...args: any);

  /**
   * `nj.template`, NornJ tagged templates syntax `t`.
   */
  export function template(strs: TemplateStringsArray, ...args: any);

  /**
   * `nj.expression`, NornJ tagged templates syntax `n`.
   */
  export function expression(strs: TemplateStringsArray, ...args: any);

  /**
   * `nj.css`, NornJ tagged templates syntax `s`.
   */
  export function css(strs: TemplateStringsArray, ...args: any);

  /**
   * `nj.components`.
   */
  export const components: object;

  /**
   * `nj.componentConfig`.
   */
  export const componentConfig: object;

  /**
   * `nj.filters`.
   */
  export const filters: object;

  /**
   * `nj.filterConfig`.
   */
  export const filterConfig: FilterConfig;

  /**
   * `nj.extensions`.
   */
  export const extensions: object;

  /**
   * `nj.extensionConfig`.
   */
  export const extensionConfig: object;
}

declare module 'nornj' {
  export = NornJ;
  export default NornJ;
}

declare module 'nornj/dist/nornj.common' {
  export = NornJ;
  export default NornJ;
}

declare module 'nornj/lib/*';