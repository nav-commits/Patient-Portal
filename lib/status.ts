export enum Status {
  High = "High",
  Low = "Low",
  Normal = "Normal",
  Borderline = "Borderline",
}

export function getStatus(value: number, referenceRange: string): Status {
  if (!referenceRange) return Status.Normal;

  // Expecting format like: "4.0 - 10.0"
  const match = referenceRange.match(/([\d.]+)\s*-\s*([\d.]+)/);

  if (!match) return Status.Normal;

  const min = parseFloat(match[1]);
  const max = parseFloat(match[2]);

  if (isNaN(min) || isNaN(max)) return Status.Normal;

  // Borderline logic (within 5% of range edge)
  const lowerBorderline = min + (max - min) * 0.05;
  const upperBorderline = max - (max - min) * 0.05;

  if (value < min) return Status.Low;
  if (value > max) return Status.High;

  if (value <= lowerBorderline || value >= upperBorderline) {
    return Status.Borderline;
  }

  return Status.Normal;
}
export function getStatusColor(status: Status) {
  switch (status) {
    case Status.High:
      return "red";
    case Status.Low:
      return "blue";
    case Status.Borderline:
      return "yellow";
    case Status.Normal:
    default:
      return "green";
  }
}
