/*!
 * NornJ-React v5.2.0
 * (c) 2016-2019 Joe_Sky
 * Released under the MIT License.
 */
import { ElementType } from 'nornj';

declare function bindTemplate<T extends ElementType>(target: T): T;
declare function bindTemplate(name: string | ElementType): <T extends ElementType>(target: T) => T;

interface FormDataInstance {
    _njMobxFormData: boolean;
    fieldDatas: Map<any, any>;
    validate(name: string): Promise<any>;
    error(help: string, name: string): void;
    clear(name: string): void;
    reset(name: string): void;
    add(fieldData: any): void;
    delete(name: string): void;
    setValue(name: string, value: any): void;
    formData: FormDataInstance;
    [key: string]: any;
}
/**
 * React bindings for NornJ template engine.
 */
interface Export {
    /**
     * `njr.bindTemplate`, register React component to NornJ template.
     */
    bindTemplate?: typeof bindTemplate;
    /**
     * [Deprecated]`njr.registerTmpl`, register React component to NornJ template.
     */
    registerTmpl?: typeof bindTemplate;
}

declare const njr: Export;

export default njr;
export { Export, FormDataInstance, bindTemplate, bindTemplate as registerTmpl };
