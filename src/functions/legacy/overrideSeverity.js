'use strict';

/**
 * @import Core from "@stoplight/spectral-core"
 */

/**
 * Overrides certain rule severities for legacy APIs based on the API type.
 * @type {Core.RulesetFunction<any, null>}
 * @param {any} targetValue - The value to validate.
 * @param {null} _options - Additional options (not used).
 * @param {any} context - The context.
 */
export default (targetValue, _options = null, context) => {
  // Access the current ruleset
  const { rule } = (context);

  const { owner: { rules } } = /** @type {Core.Rule} */ (rule);
  // Check for API type
  const apiType = targetValue.info?.["x-api-type"] || "standard";

  if (apiType === "pygeoapi") {
    // Modify rule severity for legacy APIs
    console.log("Applying legacy overrides");
    //console.log(context.rule.owner);
    if (rules["should-have-info-x-contains-sensitive-data"]) {
      console.log(rules["should-have-info-x-contains-sensitive-data"].definition)
      rules["should-have-info-x-contains-sensitive-data"].severity = "info";
      console.log(rules["should-have-info-x-contains-sensitive-data"].definition)
    }
    //rules["parameter-description"].severity = "info";
  }

  return [];
}