import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weather } from './entities/weather.entity';
import { WeatherData } from 'src/types/weather-data';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepository: Repository<Weather>,
  ) {}

  async saveWeatherData(
    createWeatherDto: CreateWeatherDto,
  ): Promise<WeatherData> {
    try {
      const { lat, lon, part } = createWeatherDto;

      const fetchedWeather = await this.fetchWeatherData(lat, lon, part);
      fetchedWeather.createdAt = new Date();

      const weather = this.weatherRepository.create(fetchedWeather);

      return await this.weatherRepository.save(weather);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async fetchWeatherData(
    lat: number,
    lon: number,
    part?: string,
  ): Promise<WeatherData> {
    try {
      const apiKey = process.env.WEATHER_API_KEY;

      if (!apiKey) {
        throw new HttpException(
          'Api key is missing',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${apiKey}`,
      );

      if (!response.ok) {
        throw new HttpException(
          'Failed to fetch weather data',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const weatherData = await response.json();

      return weatherData;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getWeatherData(
    lat: number,
    lon: number,
    part?: string,
  ): Promise<WeatherData> {
    try {
      const fetchedWeather = await this.weatherRepository.findOne({
        where: { lat, lon, part: part || undefined },
      });

      if (!fetchedWeather) {
        throw new HttpException('Weather not found', HttpStatus.NOT_FOUND);
      }

      return fetchedWeather;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
