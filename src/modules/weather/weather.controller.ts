import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherService } from './weather.service';
import { FormatWeatherInterceptor } from '../../common/interceptors/format-weather.interceptor';

@Controller('weathers')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  async fetchAndSaveWeatherData(
    @Body() createWeatherDto: CreateWeatherDto,
  ): Promise<Record<string, any>> {
    try {
      const weatherData =
        await this.weatherService.saveWeatherData(createWeatherDto);

      return weatherData;
    } catch (error) {
      throw new HttpException(
        'Failed to save weather data',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @UseInterceptors(FormatWeatherInterceptor)
  async getWeatherData(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('part') part?: string,
  ): Promise<Record<string, any>> {
    try {
      const weatherData = await this.weatherService.getWeatherData(
        lat,
        lon,
        part,
      );

      return weatherData;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch weather data',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
