export interface TibberPriceLevelDTO {
  level: string;
};

export default interface IGetTibberPriceLevel {

  get(now: Date): Promise<TibberPriceLevelDTO>;

};
