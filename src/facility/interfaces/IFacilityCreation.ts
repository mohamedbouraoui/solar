import { SolarDataInput } from "./SolarData";

export interface IFacilityCreation {

  name: string;

  nominalPower: number;

  userId: string;

  solarData?: SolarDataInput[];
}
