import {API} from "@/core/services/api/base";
import {People, PeopleResponse} from "@/core/schemas/swapi";

export class SWAPI extends API {
  private static readonly API_URL = 'https://swapi.dev/api';

  public static async fetchPeople(page: number = 1): Promise<PeopleResponse> {
    return this.fetchFromAPI(`/people/?page=${page}`);
  }

  public static async fetchPerson(id: string | number): Promise<People> {
    return this.fetchFromAPI(`/people/${id}`);
  }

  public static async searchPeople(query: string): Promise<PeopleResponse> {
    return this.fetchFromAPI(`/people/?search=${query}`);
  }

  public static async searchFilms(films: string): Promise<PeopleResponse> {
    return this.fetchFromAPI(`/films/?search=${films}`);
  }

  private static async fetchFromAPI<T>(endpoint: string) {
    try {
      const response = await fetch(`${this.API_URL}${endpoint}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}
