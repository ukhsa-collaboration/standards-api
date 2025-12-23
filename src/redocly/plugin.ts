import type { Plugin } from '@redocly/openapi-core';

import assertions from './assertions';
import rules from './rules';

const plugin: Plugin = {
  id: 'ukhsa',
  assertions,
  rules,
};

export = () => plugin;
