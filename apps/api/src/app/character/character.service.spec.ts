import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { DatabaseService } from '../database/database.service';
import { CharacterService } from './character.service';
import { CharacterDTO } from './models';

const mockCharacter: CharacterDTO = {} as any;

const characterObserver = (done: () => void, data?: any) => ({
  next(character: CharacterDTO) {
    expect(character).toBeTruthy();
    expect(character).toEqual(data || mockCharacter);
  },
  error(error: Error) {
    throw error;
  },
  complete() {
    done();
  },
});

const charactersObserver = (done: () => void) => ({
  next(characters: CharacterDTO[]) {
    expect(characters.length).toBe(2);
    expect(characters).toEqual([mockCharacter, mockCharacter]);
  },
  error(error: Error) {
    throw error;
  },
  complete() {
    done();
  },
});

describe('CharacterService', () => {
  let service: CharacterService;
  let db: DatabaseService<CharacterDTO>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterService,
        {
          provide: DatabaseService,
          useValue: {
            query: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            updateMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
    db = module.get<DatabaseService<CharacterDTO>>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return a character related to the id', (done) => {
    db.query = jest.fn().mockReturnValueOnce(of([mockCharacter]));
    service
      .getCharacterById({ id: 'CHR-TEST1' })
      .subscribe(characterObserver(done))
      .unsubscribe();
  });
  it('should get multiple characters related to the userId', (done) => {
    db.query = jest
      .fn()
      .mockReturnValueOnce(of([mockCharacter, mockCharacter]));
    service
      .getCharactersByUserId({ id: 'USR-TEST1' })
      .subscribe(charactersObserver(done))
      .unsubscribe();
  });
  it('should insert character and return the new id', (done) => {
    const characterInput = {
      name: 'Test character',
      race: 'Halfling',
      subrace: 'Lightfoot',
      experience: 0,
      level: 1,
      ideal: '',
      proficiencies: [],
      background: 'Hermit',
      alignment: 'Neutral Good',
      flaw: '',
      personalityTraits: [],
      maxHealth: 15,
      health: 15,
      isDead: false,
      playerId: 'USR-TEST',
      bond: '',
      languages: ['Common', 'Dwarvish'],
      game: 'dd5',
    };
    db.insert = jest.fn().mockReturnValueOnce(of([mockCharacter]));
    service
      .insertNewCharacter(characterInput)
      .subscribe(characterObserver(done, characterInput))
      .unsubscribe();
  });
  it('should update the character and return the id', (done) => {
    db.update = jest.fn().mockReturnValueOnce(of([mockCharacter]));
    service
      .updateCharacter({ level: 2, id: 'CHR-TEST' })
      .subscribe(characterObserver(done))
      .unsubscribe();
  });
});
