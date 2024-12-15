import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockWeatherService = {
  saveWeatherData: jest.fn(),
  getWeatherData: jest.fn(),
};

describe('WeatherController', () => {
  // eslint-disable-next-line
  let weatherController: WeatherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [{ provide: WeatherService, useValue: mockWeatherService }],
    }).compile();

    weatherController = module.get<WeatherController>(WeatherController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAndSaveWeatherData', () => {
    it('should call WeatherService.saveWeatherData and return the result', async () => {
      const createWeatherDto: CreateWeatherDto = {
        lat: 50,
        lon: 120,
      };

      const mockWeatherData = {
        lat: 50,
        lon: 120,
        timezone: 'Asia/Shanghai',
        timezone_offset: 28800,
        current: { dt: 1734227497, sunrise: 1734220323 },
        minutely: [{ dt: 1734227520, precipitation: 0 }],
        hourly: [{ dt: 1734224400, temp: 250.01 }],
        daily: [{ dt: 1734231600, sunrise: 1734220323 }],
        createdAt: new Date(),
      };

      mockWeatherService.saveWeatherData.mockResolvedValue(mockWeatherData);

      const result =
        await weatherController.fetchAndSaveWeatherData(createWeatherDto);

      expect(mockWeatherService.saveWeatherData).toHaveBeenCalledWith(
        createWeatherDto,
      );
      expect(result).toEqual(mockWeatherData);
    });

    it('should throw an error if WeatherService.saveWeatherData fails', async () => {
      const createWeatherDto: CreateWeatherDto = { lat: 50, lon: 120 };

      mockWeatherService.saveWeatherData.mockRejectedValue(
        new HttpException(
          'Failed to save weather data',
          HttpStatus.BAD_REQUEST,
        ),
      );

      try {
        await weatherController.fetchAndSaveWeatherData(createWeatherDto);
      } catch (error) {
        expect(error.response).toBe('Failed to save weather data');
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('getWeatherData', () => {
    it('should call WeatherService.getWeatherData and return the result', async () => {
      const lat = 50;
      const lon = 120;

      const mockWeatherData = {
        lat: 50,
        lon: 120,
        timezone: 'Asia/Shanghai',
        timezone_offset: 28800,
        current: { dt: 1734227497, sunrise: 1734220323 },
        minutely: [{ dt: 1734227520, precipitation: 0 }],
        hourly: [{ dt: 1734224400, temp: 250.01 }],
        daily: [{ dt: 1734231600, sunrise: 1734220323 }],
        createdAt: new Date(),
      };

      mockWeatherService.getWeatherData.mockResolvedValue(mockWeatherData);

      const result = await weatherController.getWeatherData(lat, lon, null);

      expect(mockWeatherService.getWeatherData).toHaveBeenCalledWith(
        lat,
        lon,
        null,
      );
      expect(result).toEqual(mockWeatherData);
    });

    it('should throw an error if WeatherService.getWeatherData fails', async () => {
      const lat = 50;
      const lon = 120;

      mockWeatherService.getWeatherData.mockRejectedValue(
        new HttpException(
          'Failed to fetch weather data',
          HttpStatus.BAD_REQUEST,
        ),
      );

      try {
        await weatherController.getWeatherData(lat, lon, null);
      } catch (error) {
        expect(error.response).toBe('Failed to fetch weather data');
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an error if weather data is not found', async () => {
      const lat = 50;
      const lon = 120;

      mockWeatherService.getWeatherData.mockResolvedValue(null);

      try {
        await weatherController.getWeatherData(lat, lon, null);
      } catch (error) {
        expect(error.response).toBe('Weather not found');
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
