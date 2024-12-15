import { Repository } from 'typeorm';
import { WeatherService } from './weather.service';
import { Weather } from './entities/weather.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';

const mockWeatherRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

describe('WeatherService', () => {
  let service: WeatherService;
  // eslint-disable-next-line
  let repository: Repository<Weather>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: getRepositoryToken(Weather),
          useValue: mockWeatherRepository,
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    repository = module.get<Repository<Weather>>(getRepositoryToken(Weather));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveWeatherData', () => {
    it('should save weather data successfully', async () => {
      const createWeatherDto: CreateWeatherDto = {
        lat: 50,
        lon: 120,
        part: 'hourly',
      };
      const fetchedWeather = {
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

      jest.spyOn(service, 'fetchWeatherData').mockResolvedValue(fetchedWeather);
      mockWeatherRepository.create.mockReturnValue(fetchedWeather);
      mockWeatherRepository.save.mockResolvedValue(fetchedWeather);

      const result = await service.saveWeatherData(createWeatherDto);

      expect(service.fetchWeatherData).toHaveBeenCalledWith(50, 120, 'hourly');

      expect(mockWeatherRepository.create).toHaveBeenCalledWith(fetchedWeather);
      expect(mockWeatherRepository.save).toHaveBeenCalledWith(fetchedWeather);
      expect(result).toEqual(fetchedWeather);
    });

    it('should throw an exception if an error occurs', async () => {
      const createWeatherDto: CreateWeatherDto = {
        lat: 50,
        lon: 120,
        part: 'hourly',
      };

      jest
        .spyOn(service, 'fetchWeatherData')
        .mockRejectedValue(new Error('API Error'));

      await expect(service.saveWeatherData(createWeatherDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('fetchWeatherData', () => {
    it('should fetch weather data successfully', async () => {
      const mockWeatherData: CreateWeatherDto = { lat: 50, lon: 120 };
      const apiKey = 'test-api-key';

      process.env.WEATHER_API_KEY = apiKey;

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockWeatherData),
      });

      const result = await service.fetchWeatherData(50, 120);
      expect(result).toEqual(mockWeatherData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${mockWeatherData.lat}&lon=${mockWeatherData.lon}&exclude=${mockWeatherData.part ? mockWeatherData.part : undefined}&appid=${apiKey}`,
        ),
      );
    });
  });

  it('should throw error if Api key is missing', async () => {
    delete process.env.WEATHER_API_KEY;

    await expect(service.fetchWeatherData(50, 120)).rejects.toThrow(
      HttpException,
    );
  });

  it('should throw an exception if API response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    await expect(service.fetchWeatherData(50, 120)).rejects.toThrow(
      HttpException,
    );
  });

  describe('getWeatherData', () => {
    it('should return weather data successfully', async () => {
      const mockWeather = {
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

      mockWeatherRepository.findOne.mockResolvedValue(mockWeather);

      const result = await service.getWeatherData(50, 120, null);

      expect(mockWeatherRepository.findOne).toHaveBeenCalledWith({
        where: { lat: 50, lon: 120, part: null },
      });
      expect(result).toEqual(mockWeather);
    });

    it('should throw an exception if weather data is not found', async () => {
      mockWeatherRepository.findOne.mockResolvedValue(null);

      await expect(service.getWeatherData(50, 120)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
