import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facility, FacilityDocument } from './facility.entity'; 
import { IFacilityCreation } from './interfaces/IFacilityCreation';
import { IFacilityUpdate } from './interfaces/IFacilityUpdate';

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel(Facility.name) private facilityModel: Model<FacilityDocument>,
  ) {}

  async create(input: IFacilityCreation): Promise<Facility> {
    const createdFacility = new this.facilityModel(input);
    return createdFacility.save();
  }

  async findAllByUser(userId:string): Promise<Facility[]> {
    return this.facilityModel.find({ userId }).exec();
  }

  async find(id: string, userId:string): Promise<Facility|null> {
    const facility = await this.facilityModel.findOne({ _id:id, userId }).exec();
    if (!facility) {
      return null;
    }
    return facility;
  }


  async update( input: IFacilityUpdate, userId:string): Promise<Facility> {
    const { id, ...updates } = input;
    const updatedFacility = await this.facilityModel.findOneAndUpdate(
      { _id:id, userId },
      updates,
      { new: true, runValidators: true }
    ).exec();
    if (!updatedFacility) {
      throw new NotFoundException(`Facility with name "${updates.name}" not found`);
    }
    return updatedFacility;
  }

  async deleteById(id: string, userId:string): Promise<boolean> {
    const result = await this.facilityModel.deleteOne({ _id:id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Facility not found`);
    }
    return true;
  }

}

