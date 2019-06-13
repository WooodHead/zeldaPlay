import { Test, TestingModule } from '@nestjs/testing';
import { MyLogger } from './logger.service';

jest.mock('mc-scribe').enableAutomock();

describe('LoggerService', () => {
  let service: MyLogger;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyLogger]
    }).compile();
    service = module.get<MyLogger>(MyLogger);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('dev env', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'dev';
    });
    it('should log error', () => {
      service.error('Error!', 'Stack trace');
    });
    it('should log log', () => {
      service.log('logs here', 'Test');
    });
    it('should log warn', () => {
      service.warn('Warning!');
    });
    it('should log debug messages', () => {
      service.debug('Debug');
      service.debug({ debug: 'DEBUG' });
    });
    it('should log verbose', () => {
      service.verbose('verbose!');
    });
  });
  describe('development env', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'development';
    });
    it('should log error', () => {
      service.error('Error!', 'Stack trace');
    });
    it('should log log', () => {
      service.log('logs here', 'Test');
    });
    it('should log warn', () => {
      service.warn('Warning!');
    });
    it('should log debug messages', () => {
      service.debug('Debug');
      service.debug({ debug: 'DEBUG' });
    });
    it('should log verbose', () => {
      service.verbose('verbose!');
    });
  });
  describe('prod env', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'production';
    });
    it('should log error', () => {
      service.error('Error!', 'Stack trace');
      service.error('ERROR!', '');
    });
    it('should log log', () => {
      service.log('logs here', 'Test');
    });
    it('should log warn', () => {
      service.warn('Warning!');
    });
    it('should log debug messages', () => {
      service.debug('Debug');
    });
    it('should log verbose', () => {
      service.verbose('verbose!');
    });
  });
});
