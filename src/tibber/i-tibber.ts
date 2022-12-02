export type TibberHourlyPriceInfo = {
  total: number;
  startsAt: string;
}

export type TibberResponse = {
  data: {
    viewer: {
      home: {
        currentSubscription: {
          priceInfo: {
            today: TibberHourlyPriceInfo[]
            tomorrow?: TibberHourlyPriceInfo[]
          }
        }
      }
    }
  }
}

export default interface ITibber {
  get(): Promise<TibberResponse>;
};