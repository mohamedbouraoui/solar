import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { FacilityService } from './facility.service';
import { Facility } from './facility.entity';
import { UpdateFacilityInput } from './dtos/UpdateFacilityInput';
import * as csv from 'csv-parser';
import { BadRequestException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateFacilityInput } from './dtos/CreateFacilityInput';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';


@Resolver(() => Facility)
export class FacilityResolver {
  constructor(private readonly facilityService: FacilityService) { }

  @Query(() => [Facility], { name: 'facilitiesByUser' })
  @UseGuards(JwtAuthGuard)
  async getAllFacilities(@Context() context): Promise<Facility[]> {
    return this.facilityService.findAllByUser(context.req.user.id);
  }

  @Query(() => Facility, { name: 'facilityById' })
  @UseGuards(JwtAuthGuard)
  async getFacility(@Args('id') id: string, @Context() context): Promise<Facility|null> {
    return this.facilityService.find(id, context.req.user.id);
  }

  @Mutation(() => Facility)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createFacility(
    @Args('input') createFacilityInput: CreateFacilityInput,
    @Context() context
  ): Promise<Facility> {

    const { name, nominalPower } = createFacilityInput;
    const file = await createFacilityInput.file;

    if (!file) {
      return this.facilityService.create({
        name,
        nominalPower,
        userId: context.req.user.id
      });
    }

    // Validate file type
    const { filename, mimetype, createReadStream } = file;
    const validMimeTypes = ['text/csv', 'application/vnd.ms-excel'];

    if (!validMimeTypes.includes(mimetype) || filename.split('.').pop()?.toLowerCase() !== 'csv') {
      throw new BadRequestException('Invalid file type. Only CSV files are allowed.');
    }

    const stream = createReadStream();
    const results: any[] = [];

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (data) => {
          results.push(data);
        })
        .on("end", async () => {
          if (results.length === 0) {
            reject(new BadRequestException('The CSV file is empty or malformed'));
            return;
          }
          resolve(results);
        })
        .on("error", (error) => {
          reject(new BadRequestException('Error parsing CSV: ' + error.message));
        });
    });

    return this.facilityService.create({
      name,
      nominalPower,
      userId: context.req.user.id,
      solarData: results
    });
  }

  @Mutation(() => Facility)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateFacility(
    @Args('input') updateFacilityInput: UpdateFacilityInput,
    @Context() context
  ): Promise<Facility> {
    const { id, name, nominalPower } = updateFacilityInput;
    const file = await updateFacilityInput.file
    if (!file) {
      return this.facilityService.update({ id, name, nominalPower }, context.req.user.id);
    }
    // Validate file type
    const { filename, mimetype, createReadStream } = file;
    const validMimeTypes = ['text/csv', 'application/vnd.ms-excel'];

    if (!validMimeTypes.includes(mimetype) || filename.split('.').pop()?.toLowerCase() !== 'csv') {
      throw new BadRequestException('Invalid file type. Only CSV files are allowed.');
    }

    const stream = createReadStream();
    const results: any[] = [];

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (row) => {
          if (!row.active_power_kW || !row.energy_kWh || !row.timestamp) {
            reject( new BadRequestException("Invalid CSV data"));
          }
          results.push(row);
        })
        .on("end", async () => {
          if (results.length === 0) {
            reject(new BadRequestException('The CSV file is empty or malformed'));
            return;
          }
          resolve(results);
        })
        .on("error", (error) => {
          reject(new BadRequestException('Error parsing CSV: ' + error.message));
        });
    });
    return this.facilityService.update({ id, name, nominalPower, solarData: results }, context.req.user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteFacility(@Args('id') id: string, @Context() context): Promise<boolean> {
    return this.facilityService.deleteById(id, context.req.user.id);
  }
}