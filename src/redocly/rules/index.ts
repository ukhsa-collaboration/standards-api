import { mustNotDefineRequestBodyForGetRequestsRule } from './mustNotDefineRequestBodyForGetRequests';
import { problemResponseRule } from './problemResponses';

const rules = {
  oas3: {
    'must-define-critical-problem-responses': () => problemResponseRule('critical'),
    'must-define-security-problem-responses': () => problemResponseRule('explicit-security'),
    'must-not-define-request-body-for-get-requests': mustNotDefineRequestBodyForGetRequestsRule,
  },
};

export default rules;
