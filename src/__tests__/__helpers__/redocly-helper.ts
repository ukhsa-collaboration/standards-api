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
    const disableRule = (value: unknown) =>
      typeof value === 'string' ? 'off' : { ...(value as any), severity: 'off' };

    if (config.styleguide?.rules) {
      const rules = config.styleguide.rules ?? {};
      for (const [id, value] of Object.entries(rules)) {
        if (id === 'assertions' || onlyRules.includes(id)) continue;
        rules[id] = disableRule(value);
      }
      config.styleguide.rules = rules;
    } else if (config.rules) {
      for (const [version, rules] of Object.entries(config.rules)) {
        for (const [id, value] of Object.entries(rules as Record<string, unknown>)) {
          if (id === 'assertions' || onlyRules.includes(id)) continue;
          (rules as Record<string, unknown>)[id] = disableRule(value);
        }
        (config.rules as Record<string, unknown>)[version] = rules;
      }
    }
  }

  return lintFromString({
    source,
    absoluteRef: CONFIG_PATH,
    config,
  });
}
