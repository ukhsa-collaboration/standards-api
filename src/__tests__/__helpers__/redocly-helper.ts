import { createConfig, lintFromString } from '@redocly/openapi-core';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import plugin from '../../redocly/plugin';

const CONFIG_PATH = path.join(__dirname, '../../..', 'redocly.yaml');

export async function lintDocument(source: string, onlyRules?: string[]) {
  const raw = yaml.load(fs.readFileSync(CONFIG_PATH, 'utf8')) as Record<string, any>;
  raw.plugins = [plugin()];

  if (onlyRules && onlyRules.length > 0 && raw.rules) {
    raw.extends = [];
    raw.rules = Object.fromEntries(
      Object.entries(raw.rules).filter(([id]) => onlyRules.includes(id))
    );
  }

  const config = await createConfig(raw, { configPath: CONFIG_PATH });

  if (onlyRules && onlyRules.length > 0) {
    const rules = config.styleguide.rules ?? {};
    for (const [id, value] of Object.entries(rules)) {
      if (onlyRules.includes(id)) continue;
      rules[id] = typeof value === 'string' ? 'off' : { ...(value as any), severity: 'off' };
    }
    config.styleguide.rules = rules;
  }

  return lintFromString({
    source,
    absoluteRef: CONFIG_PATH,
    config,
  });
}
