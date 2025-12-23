import { buildAssertCustomFunction } from './utils';
import apiInfoSchemaAssertion from './apiInfoSchema';
import countResourceTypesAssertion from './countResourceTypes';
import forbidEnumAssertion from './forbidEnum';
import infoApiTypeAssertion from './infoApiType';
import infoContainsSensitiveDataAssertion from './infoContainsSensitiveData';
import locationHeaderAssertion from './locationHeader';
import objectSchemaAssertion from './objectSchema';
import problemJsonAssertion from './problemJson';

const assertions = {
  objectSchema: buildAssertCustomFunction(objectSchemaAssertion),
  problemJsonSchema: buildAssertCustomFunction(problemJsonAssertion),
  apiInfoSchema: buildAssertCustomFunction(apiInfoSchemaAssertion),
  countResourceTypes: buildAssertCustomFunction(countResourceTypesAssertion),
  forbidEnum: buildAssertCustomFunction(forbidEnumAssertion),
  infoApiType: buildAssertCustomFunction(infoApiTypeAssertion),
  infoContainsSensitiveData: buildAssertCustomFunction(infoContainsSensitiveDataAssertion),
  locationHeader: buildAssertCustomFunction(locationHeaderAssertion),
};

export default assertions;
