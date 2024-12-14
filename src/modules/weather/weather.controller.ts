import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherService } from './weather.service';
import { FormatWeatherInterceptor } from 'src/common/interceptors/format-weather.interceptor';

@Controller('weathers')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  async fetchAndSaveWeatherData(
    @Body() createWeatherDto: CreateWeatherDto,
  ): Promise<Record<string, any>> {
    const weatherData =
      await this.weatherService.saveWeatherData(createWeatherDto);

    return weatherData;
  }

  @Get()
  @UseInterceptors(FormatWeatherInterceptor)
  async getWeatherData(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('part') part?: string,
  ): Promise<Record<string, any>> {
    const weatherData = await this.weatherService.getWeatherData(
      lat,
      lon,
      part,
    );

    return weatherData;
  }
}
