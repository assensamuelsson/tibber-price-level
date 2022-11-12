import { Express, Request, Response } from 'express';
import express from 'express';

export default (homeId: string, token: string): Express => {
  const app: Express = express();
  
  app.get('/', async (req: Request, res: Response) => {
    const data = await getTibberData(homeId, token);

    const prices = [
      ...data.data.viewer.home.currentSubscription.priceInfo.today.map(({ total }) => total),
      ...data.data.viewer.home.currentSubscription.priceInfo.tomorrow.map(({ total }) => total)
    ];
    const current = data.data.viewer.home.currentSubscription.priceInfo.current.total;

    prices.sort();
    
    const q20 = quantile(prices, 0.2);
    const q40 = quantile(prices, 0.4);
    const q60 = quantile(prices, 0.6);
    const q80 = quantile(prices, 0.8);

    let priceLevel;
    if (current < q20) {
      priceLevel = 'VERY_CHEAP';
    } else if (current < q40) {
      priceLevel = 'CHEAP';
    } else if (current < q60) {
      priceLevel = 'MEDIUM';
    } else if (current < q80) {
      priceLevel = 'EXPENSIVE';
    } else {
      priceLevel = 'VERY_EXPENSIVE'
    }

    if (current < 0.4) {
      priceLevel = 'VERY_CHEAP';
    } else if (current < 0.6) {
      priceLevel = 'CHEAP';
    }

    res.json({
      priceLevel,
      current,
      q20,
      q40,
      q60,
      q80,
      prices,
    })
  });

  return app;
};

const getGraphQLQuery = (homeId: string): { query: string } => {
  return {
    query:  `
    {
      viewer {
        home (id: "${homeId}") {
          currentSubscription {
            priceInfo {
              current {
                total
              }
              today {
                total
              }
              tomorrow {
                total
              }
            }
          }
        }
      }
    }`
  };
};

const getHeaders = (token: string): { Authorization: string, 'Content-Type': string } => {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

type TibberResponse = {
  data: {
    viewer: {
      home: {
        currentSubscription: {
          priceInfo: {
            current: {
              total: number
            },
            today: [
              {
                total: number,
              },
            ]
            tomorrow: [
              {
                total: number,
              },
            ]
          }
        }
      }
    }
  }
}

const getTibberData = async (homeId: string, token: string): Promise<TibberResponse> => {
  const query = getGraphQLQuery(homeId);
  const headers = getHeaders(token);
  const response = await fetch('https://api.tibber.com/v1-beta/gql', {
    method: 'POST',
    headers,
    body: JSON.stringify(query),
  });

  return await response.json();
}

const quantile = (arr: number[], q: number): number => {
  const sorted = arr.sort();
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
      return sorted[base];
  }
};
