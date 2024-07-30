export class API {
  protected static clean<T extends Record<string, any> = Record<string, any>>(data: T): T {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (value === undefined) {
          return [key, null];
        }
        return [key, value];
      })
    ) as T;
  }

  static async fetchFromURL<T>(url: string) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}
