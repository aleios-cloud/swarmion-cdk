import { JSONSchema } from 'json-schema-to-ts';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

import { ConstrainedJSONSchema } from 'types/constrainedJSONSchema';
import { HttpMethod } from 'types/http';

import {
  ApiGatewayAuthorizerType,
  ApiGatewayIntegrationType,
} from './types/constants';
import { InputSchemaType } from './types/input';

/**
 * ApiGatewayContract:
 *
 * a contract used to define a type-safe interaction between AWS Services through Api Gateway.
 *
 * Main features:
 * - input and output dynamic validation with JSONSchemas on both end of the contract;
 * - type inference for both input and output;
 * - generation of a contract document that can be checked for breaking changes;
 * - generation of open api documentation
 */
export class ApiGatewayContract<
  Path extends string = string,
  Method extends HttpMethod = HttpMethod,
  IntegrationType extends ApiGatewayIntegrationType = ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType = ApiGatewayAuthorizerType,
  PathParametersSchema extends ConstrainedJSONSchema | undefined =
    | ConstrainedJSONSchema
    | undefined,
  QueryStringParametersSchema extends ConstrainedJSONSchema | undefined =
    | ConstrainedJSONSchema
    | undefined,
  HeadersSchema extends ConstrainedJSONSchema | undefined =
    | ConstrainedJSONSchema
    | undefined,
  BodySchema extends JSONSchema | undefined = JSONSchema | undefined,
  OutputSchema extends JSONSchema | undefined = JSONSchema | undefined,
> {
  public contractType = 'apiGateway' as const;
  public id: string;
  public path: Path;
  public method: Method;
  public integrationType: IntegrationType;
  public authorizerType: AuthorizerType;
  public pathParametersSchema: PathParametersSchema;
  public queryStringParametersSchema: QueryStringParametersSchema;
  public headersSchema: HeadersSchema;
  public bodySchema: BodySchema;
  public outputSchema: OutputSchema;
  public inputSchema: InputSchemaType<
    PathParametersSchema,
    QueryStringParametersSchema,
    HeadersSchema,
    BodySchema,
    true
  >;

  /**
   * Builds a new ApiGateway contract
   *
   * @param props - the contract properties
   */
  constructor(props: {
    /**
     * An id to uniquely identify the contract among services. Beware of uniqueness!
     */
    id: string;
    /**
     * The path on which the lambda will be triggered
     */
    path: Path;
    /**
     * The http method
     */
    method: Method;
    /**
     * `'httpApi'` or `'restApi'`, see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html
     */
    integrationType: IntegrationType;
    /**
     * A JSONSchema used to validate the path parameters and infer their types.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     *
     * Also please note that for Typescript reasons, you need to explicitly pass `undefined` if you don't want to use the schema.
     */
    pathParametersSchema: PathParametersSchema;
    /**
     * A JSONSchema used to validate the query parameters and infer their types.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     *
     * Also please note that for Typescript reasons, you need to explicitly pass `undefined` if you don't want to use the schema.
     */
    queryStringParametersSchema: QueryStringParametersSchema;
    /**
     * A JSONSchema used to validate the headers and infer their types.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     *
     * Also please note that for Typescript reasons, you need to explicitly pass `undefined` if you don't want to use the schema.
     */
    headersSchema: HeadersSchema;
    /**
     * A JSONSchema used to validate the body and infer its type.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     *
     * Also please note that for Typescript reasons, you need to explicitly pass `undefined` if you don't want to use the schema.
     */
    bodySchema: BodySchema;
    /**
     * A JSONSchema used to validate the output and infer its type.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     *
     * Also please note that for Typescript reasons, you need to explicitly pass `undefined` if you don't want to use the schema.
     */
    outputSchema: OutputSchema;
    /**
     * Indicates which type of authorizer is used for this contract.
     */
    authorizerType: AuthorizerType;
  }) {
    this.id = props.id;
    this.path = props.path;
    this.method = props.method;
    this.integrationType = props.integrationType;
    this.pathParametersSchema = props.pathParametersSchema;
    this.queryStringParametersSchema = props.queryStringParametersSchema;
    this.headersSchema = props.headersSchema;
    this.bodySchema = props.bodySchema;
    this.outputSchema = props.outputSchema;
    this.inputSchema = this.getInputSchema();
    this.authorizerType = props.authorizerType;
  }

  private getInputSchema(): InputSchemaType<
    PathParametersSchema,
    QueryStringParametersSchema,
    HeadersSchema,
    BodySchema,
    true
  > {
    const properties = omitBy(
      {
        pathParameters: this.pathParametersSchema,
        queryStringParameters: this.queryStringParametersSchema,
        headers: this.headersSchema,
        body: this.bodySchema,
      } as const,
      isUndefined,
    );

    return {
      type: 'object',
      properties,
      // @ts-ignore here object.keys is not precise enough
      required: Object.keys(properties),
      additionalProperties: true,
    };
  }
}
