(function attachTechnicalValueFormatter(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.RevLogTechnicalValueFormatter = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createFormatter() {
  "use strict";

  function formatValue(value, options = {}) {
    if (!value || typeof value !== "object") {
      throw new TypeError("A structured Technical Profile value is required.");
    }

    const localized = options.localized !== false;
    const locale = options.locale || "pl-PL";
    const formatNumber = number => localized
      ? new Intl.NumberFormat(locale, {
          useGrouping: false,
          maximumFractionDigits: 20
        }).format(number)
      : String(number);

    if (value.type === "quantity") {
      return withUnit(formatNumber(value.amount), value.unit);
    }

    if (value.type === "range") {
      return withUnit(
        `${formatNumber(value.min)}–${formatNumber(value.max)}`,
        value.unit
      );
    }

    if (value.type === "quantity-with-tolerance") {
      return withUnit(
        `${formatNumber(value.nominal)} ± ${formatNumber(value.tolerance)}`,
        value.unit
      );
    }

    if (value.type === "ratio") {
      return `${formatNumber(value.numerator)}:${formatNumber(value.denominator)}`;
    }

    if (value.type === "text") {
      return value.text;
    }

    if (value.type === "multi") {
      return value.values
        .map(item => formatValue(item, options))
        .join(options.multiSeparator || " / ");
    }

    throw new TypeError(`Unsupported Technical Profile value type: ${value.type}`);
  }

  function withUnit(formattedNumber, unit) {
    return unit ? `${formattedNumber} ${unit}` : formattedNumber;
  }

  return Object.freeze({ formatValue });
});
