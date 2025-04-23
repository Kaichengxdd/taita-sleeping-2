import Decimal from "break_eternity.js";

export default function displayNum(value: Decimal): string {
  if (value.lt(new Decimal(1000))) {
    return value.toFixed(2);
  }
  if (value.lt(new Decimal(1000000))) {
    return value.dividedBy(new Decimal(1000)).toFixed(2) + "K";
  }
  if (value.lt(new Decimal(1000000000))) {
    return value.dividedBy(new Decimal(1000000)).toFixed(2) + "M";
  }
  if (value.lt(new Decimal(1000000000000))) {
    return value.dividedBy(new Decimal(1000000000)).toFixed(2) + "B";
  }
  if (value.lt(new Decimal(1000000000000000))) {
    return value.dividedBy(new Decimal(1000000000000)).toFixed(2) + "T";
  }
  if (value.lt(new Decimal(1000000000000000000))) {
    return value.dividedBy(new Decimal(1000000000000000)).toFixed(2) + "Qa";
  }
  if (value.lt(new Decimal("1000000000000000000000"))) {
    return (
      value.dividedBy(new Decimal("1000000000000000000")).toFixed(2) + "Qt"
    );
  }
  if (value.lt(new Decimal("1000000000000000000000000"))) {
    return (
      value.dividedBy(new Decimal("1000000000000000000000")).toFixed(2) + "Sx"
    );
  }
  if (value.lt(new Decimal("1000000000000000000000000000"))) {
    return (
      value.dividedBy(new Decimal("1000000000000000000000000")).toFixed(2) +
      "Sp"
    );
  }
  if (value.lt(new Decimal("1000000000000000000000000000000"))) {
    return (
      value.dividedBy(new Decimal("1000000000000000000000000000")).toFixed(2) +
      "Oc"
    );
  }
  if (value.lt(new Decimal("1000000000000000000000000000000000"))) {
    return (
      value
        .dividedBy(new Decimal("1000000000000000000000000000000"))
        .toFixed(2) + "No"
    );
  }
  if (value.lt(new Decimal("1000000000000000000000000000000000000"))) {
    return (
      value
        .dividedBy(new Decimal("1000000000000000000000000000000000"))
        .toFixed(2) + "Dc"
    );
  }
  return value.mantissaWithDecimalPlaces(2).toString() + "e" + value.exponent;
}
