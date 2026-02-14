export enum Status {
  Normal = "Normal",
  Abnormal = "Abnormal",
}

export function getStatus(value: number, range: string): Status {
  const [minStr, maxStr] = range.split("-");
  const min = parseFloat(minStr);
  const max = parseFloat(maxStr);

  if (isNaN(min) || isNaN(max)) return Status.Normal;
  return value < min || value > max ? Status.Abnormal : Status.Normal;
}

export function getStatusColor(status: Status) {
  return status === Status.Normal ? "green" : "yellow";
}
