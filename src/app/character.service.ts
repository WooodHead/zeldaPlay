import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { catchError, map, tap } from 'rxjs/operators';

import { Character } from './Character/character';
import { CHARACTERS } from './mock-character';

@Injectable()
export class CharacterService {

  private characterUrl = '/api/characters';

  constructor(private httpClient: HttpClient) { }

  getCharacters(): Observable<Character[]> {
    return this.httpClient.get<Character[]>(this.characterUrl)
    .pipe(
      tap(ch => {
        const outcome = ch ? 'Got charcaters' : 'Found a problem';
        console.log(outcome);
      }),
      catchError(this.handleError('fetchCharacters', CHARACTERS))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error('ERROR:', error);

      return of(result as T);
    };
  }
}