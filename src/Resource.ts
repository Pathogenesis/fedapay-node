import { AxiosResponse } from 'axios';
import * as pluralize from 'pluralize';
import { ApiConnectionError, InvalidRequest } from './Error';
import { FedaPay } from './FedaPay';
import { FedaPayObject } from './FedaPayObject';
import { Requestor } from './Requestor';
import { arrayToFedaPayObject } from './Util';

export class Resource extends FedaPayObject {
    protected static requestor: Requestor = new Requestor();

    static setRequestor(req: Requestor) {
        Resource.requestor = req;
    }

    static getRequestor(req: Requestor) {
        return Resource.requestor;
    }

    static className(): string {
        return this.name.toLowerCase();
    }

    static classPath() {
        let base = this.className();
        let plural = pluralize(base);

        return `/${plural}`;
    }

    static resourcePath(id: number | string) {
        if (id === null) {
            let klass = this.className();
            let message = `Could not determine which URL to request: ${klass} instance has invalid ID: ${id}`;

            throw new InvalidRequest(message);
        }

        let base = this.classPath();
        let extn = encodeURI(`${id}`);

        return `${base}/${extn}`;
    }

    instanceUrl() {
        return (<any>this).constructor.resourcePath(this.id);
    }

    protected static validateParams(params = null) {
        if (params && typeof params != 'object') {
            let message = `You must pass an object as the first argument to FedaPay API
            method calls.  (HINT: an example call to create a customer
            would be: FedaPay.Customer.create({'firstname': toto,
            'lastname': 'zoro', 'email': 'admin@gmail.com', 'phone': '66666666'})`;
            throw new InvalidRequest(message);
        }
    }

    protected static staticRequest(
        method: any,
        url: any,
        params: any = null,
        headers: any = null
    ) {
        return this.requestor.request(method, url, params, headers)
            .then(response => {
                let options = {
                    'apiVersion': FedaPay.getApiVersion(),
                    'environment': FedaPay.getEnvironment()
                };

                return { data: response.data, options };
            });
    }

    protected static retrieve(id: any, headers = []): Promise<FedaPayObject> {
        let url = this.resourcePath(id);
        let className = this.className();

        return this.staticRequest('get', url)
            .then(({ data, options }) => {
                return <FedaPayObject>arrayToFedaPayObject(data, options);
            });
    }

    protected static all(
        params: any = {},
        headers: any = {}
    ): Promise<FedaPayObject[]> {
        this.validateParams(params);

        let path = this.classPath();

        return this.staticRequest('get', path, params, headers)
            .then(({ data, options }) => {
                return <FedaPayObject[]>arrayToFedaPayObject(data, options);
            })
    }

    protected static create(params: any, headers: any): Promise<FedaPayObject> {
        this.validateParams(params);
        let url = this.classPath();

        return this.staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                return <FedaPayObject>arrayToFedaPayObject(data, options);
            });
    }

    protected static update(params: any, headers: any): Promise<FedaPayObject> {
        this.validateParams(params);
        let url = this.classPath();

        return this.staticRequest('put', url, params, headers)
            .then(({ data, options }) => {
                return <FedaPayObject>arrayToFedaPayObject(data, options);
            });
    }

    protected delete(headers: any) {
        let url = this.instanceUrl();
        return Resource.staticRequest('delete', url, [], headers);
    }

    protected save(headers: any) {
        let params = this.serializeParameters();
        let className = Resource.className();
        let url = this.instanceUrl();

        return Resource.staticRequest('PUT', url, params, headers)
            .then(({ data, options }) => {
                let klass = `${options.apiVersion} / ${className}`;
                let json = data[klass];

                this.refreshFrom(json, options);

                return this;
            });
    }
}
