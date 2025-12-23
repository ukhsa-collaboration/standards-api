const mustNotDefineRequestBodyForGetRequestsRule = () => ({
  Operation(operation: any, ctx: any) {
    if (ctx.key === 'get' && operation.requestBody !== undefined) {
      ctx.report({
        message: 'A GET request MUST NOT accept a request body.',
        location: ctx.location.child(['requestBody']),
      });
    }
  },
});

export { mustNotDefineRequestBodyForGetRequestsRule };
