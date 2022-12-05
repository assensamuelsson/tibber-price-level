export interface TibberPriceLevelDTO {
  level: string;
  current?: number;
  q20?: number;
  q40?: number;
  q60?: number;
  q80?: number;
};

export default interface IGetTibberPriceLevel {

  get(now: Date): Promise<TibberPriceLevelDTO>;

};
