---
order: 1
---
# Severity overrides

Some OpenAPI definitions produced by platforms like [pygeoapi][1] might struggle to meet every **MUST** requirement. This is often because these issues are outside the consuming team's direct control, as fixes would require upstream contributions or maintaining a fork. To accommodate this, `ukhsa.oas.rules.yml` ships paired `<rule>-pygeoapi` rule variants. They fire at `warn` instead of `error` for OpenAPI documents marked with `info.x-api-type: pygeoapi`.

There is a single ruleset; no extra configuration is needed. The strict variant and its pygeoapi sibling use mutually exclusive [JSON Path Plus][3] `@root` filters, so for any given document exactly one of the two fires.

The following error-level rules are relaxed to `warn` via paired `-pygeoapi` siblings:

- `must-define-a-format-for-integer-types` → `must-define-a-format-for-integer-types-pygeoapi`
- `must-define-a-format-for-number-types` → `must-define-a-format-for-number-types-pygeoapi`
- `must-define-security-schemes` → `must-define-security-schemes-pygeoapi`
- `must-have-info-api-audience` → `must-have-info-api-audience-pygeoapi`
- `must-have-info-contact-email` → `must-have-info-contact-email-pygeoapi`
- `must-have-info-value-chain` → `must-have-info-value-chain-pygeoapi`
- `must-have-info-version` → `must-have-info-version-pygeoapi`
- `must-specify-default-response` → `must-specify-default-response-pygeoapi`
- `must-use-camel-case-for-property-names` → `must-use-camel-case-for-property-names-pygeoapi`
- `must-use-camel-case-for-query-parameters` → `must-use-camel-case-for-query-parameters-pygeoapi`
- `must-use-https-protocol-only` → `must-use-https-protocol-only-pygeoapi`
- `must-use-problem-json-as-default-response` → `must-use-problem-json-as-default-response-pygeoapi`
- `must-use-problem-json-for-errors` → `must-use-problem-json-for-errors-pygeoapi`
- `must-use-valid-version-info-schema` → `must-use-valid-version-info-schema-pygeoapi`

Other rules continue to run normally, so pygeoapi definitions should still be linted and improved where possible. Rules already at `warn` are not changed.

> [!IMPORTANT]
> The relaxed siblings apply to the whole OpenAPI definition; review the reported warnings and errors carefully and fix where possible.

To make intent explicit, the `info.x-api-type` field is treated as an enum:

- `standard` – default behavior; strict variants apply.
- `pygeoapi` – pygeoapi-based definitions; the `-pygeoapi` siblings apply at `warn` and the strict variants are silenced.

If you omit `info.x-api-type`, the ruleset assumes the API is `standard` and the strict variants apply.

See also: [MAY have info.x-api-type][2].

When generating a definition from a local pygeoapi instance, you can inject the `info.x-api-type` flag during export so the relaxed siblings apply. The example below wraps the `pygeoapi openapi generate` command in Docker, binds your local configuration, and uses `yq` to add `info.x-api-type: pygeoapi` before writing the result to `openapi-pygeoapi.yml`.

```sh
docker run --entrypoint= --rm -p 5000:80 \
  --mount type=bind,src=./pygeoapi-config.yml,dst=/pygeoapi/config.yml \
  -e PYGEOAPI_CONFIG=/pygeoapi/config.yml geopython/pygeoapi:latest \
  sh -c 'pygeoapi openapi generate $PYGEOAPI_CONFIG'  \
| yq '.info += {"x-api-type": "pygeoapi"}' - > openapi-pygeoapi.yml
```

[1]: https://pygeoapi.io/
[2]: may/may-have-info-x-api-type.md
[3]: https://github.com/JSONPath-Plus/JSONPath#syntax-through-examples
