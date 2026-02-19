
export interface LabResult {
    date: string;
    orderedItems: string[];
    results: Record<string, number | string>;
    units: Record<string, string>;
    referenceRanges: Record<string, string>;
  }
  
  export interface Patient {
    id: string;
    name: string;
    dob: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    primaryCarePhysician: string;
    insurance: {
      medicare: string;
      medicaid: string;
    };
    labResults: LabResult[];
  }
  