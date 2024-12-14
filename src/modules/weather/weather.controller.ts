import { Body, Controller, Post } from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherService } from './weather.service';

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
}
