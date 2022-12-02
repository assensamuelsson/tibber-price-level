import ITibber, { TibberResponse } from './i-tibber';

export default class Tibber implements ITibber {

  token: string;
  homeId: string;
  tibberApiUrl: string;

  constructor(token: string, homeId: string) {
    this.token = token;
    this.homeId = homeId;
    this.tibberApiUrl = 'https://api.tibber.com/v1-beta/gql';
  }

  get(): Promise<TibberResponse> {
    const query = this._getGraphQLQuery();
    const headers = this._getHeaders();
  
    return fetch(this.tibberApiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(query),
    }).then((response) => response.json());
  }

  _getGraphQLQuery = (): { query: string } => {
    return {
      query:  `
      {
        viewer {
          home (id: "${this.homeId}") {
            currentSubscription {
              priceInfo {
                today {
                  total
                  startsAt
                }
                tomorrow {
                  total
                  startsAt
                }
              }
            }
          }
        }
      }`
    };
  };

  _getHeaders = (): { Authorization: string, 'Content-Type': string } => {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  };
};
