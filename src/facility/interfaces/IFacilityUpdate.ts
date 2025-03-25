import { SolarDataInput } from "./SolarData";

export interface IFacilityUpdate {
    id: string;
    
  name?: string;

  nominalPower?: number;

  solarData?: SolarDataInput[];
}
