/**
 * DEMONSTRATION DATA ONLY.
 *
 * These figures are synthetically generated for development and portfolio
 * purposes. They are NOT live or historical Nepal Stock Exchange quotes.
 * The company names and symbols reference real NEPSE-listed companies so the
 * interface feels realistic, but every price, volume and turnover value here
 * is fabricated.
 */

export const SECTORS = [
  "Commercial Banks",
  "Development Banks",
  "Finance",
  "Hotels & Tourism",
  "Hydropower",
  "Investment",
  "Manufacturing",
  "Microfinance",
  "Life Insurance",
  "Non-Life Insurance",
  "Others",
] as const;

export type Sector = (typeof SECTORS)[number];

export interface CompanySeed {
  symbol: string;
  name: string;
  sector: Sector;
  basePrice: number;
  /** listed shares, used to derive market capitalisation */
  listedShares: number;
}

export const COMPANY_SEEDS: CompanySeed[] = [
  { symbol: "NABIL", name: "Nabil Bank Limited", sector: "Commercial Banks", basePrice: 512, listedShares: 24_00_00_000 },
  { symbol: "NICA", name: "NIC Asia Bank Limited", sector: "Commercial Banks", basePrice: 758, listedShares: 15_30_00_000 },
  { symbol: "SCB", name: "Standard Chartered Bank Nepal", sector: "Commercial Banks", basePrice: 604, listedShares: 11_20_00_000 },
  { symbol: "NIMB", name: "Nepal Investment Mega Bank", sector: "Commercial Banks", basePrice: 208, listedShares: 34_60_00_000 },
  { symbol: "GBIME", name: "Global IME Bank Limited", sector: "Commercial Banks", basePrice: 214, listedShares: 36_20_00_000 },
  { symbol: "KBL", name: "Kumari Bank Limited", sector: "Commercial Banks", basePrice: 176, listedShares: 26_40_00_000 },
  { symbol: "PRVU", name: "Prabhu Bank Limited", sector: "Commercial Banks", basePrice: 189, listedShares: 25_10_00_000 },
  { symbol: "SANIMA", name: "Sanima Bank Limited", sector: "Commercial Banks", basePrice: 302, listedShares: 14_80_00_000 },
  { symbol: "EBL", name: "Everest Bank Limited", sector: "Commercial Banks", basePrice: 618, listedShares: 9_80_00_000 },
  { symbol: "HBL", name: "Himalayan Bank Limited", sector: "Commercial Banks", basePrice: 224, listedShares: 21_40_00_000 },

  { symbol: "MDB", name: "Muktinath Bikas Bank", sector: "Development Banks", basePrice: 398, listedShares: 6_20_00_000 },
  { symbol: "GBBL", name: "Garima Bikas Bank", sector: "Development Banks", basePrice: 341, listedShares: 4_10_00_000 },
  { symbol: "SHINE", name: "Shine Resunga Development Bank", sector: "Development Banks", basePrice: 372, listedShares: 3_20_00_000 },
  { symbol: "JBBL", name: "Jyoti Bikas Bank", sector: "Development Banks", basePrice: 244, listedShares: 3_80_00_000 },

  { symbol: "GUFL", name: "Gurkhas Finance Limited", sector: "Finance", basePrice: 452, listedShares: 1_10_00_000 },
  { symbol: "MFIL", name: "Manjushree Finance Limited", sector: "Finance", basePrice: 512, listedShares: 90_00_000 },
  { symbol: "GFCL", name: "Goodwill Finance Limited", sector: "Finance", basePrice: 604, listedShares: 78_00_000 },
  { symbol: "CFCL", name: "Central Finance Limited", sector: "Finance", basePrice: 386, listedShares: 82_00_000 },

  { symbol: "SHL", name: "Soaltee Hotel Limited", sector: "Hotels & Tourism", basePrice: 412, listedShares: 5_40_00_000 },
  { symbol: "OHL", name: "Oriental Hotels Limited", sector: "Hotels & Tourism", basePrice: 628, listedShares: 1_90_00_000 },
  { symbol: "TRH", name: "Taragaon Regency Hotels", sector: "Hotels & Tourism", basePrice: 866, listedShares: 1_60_00_000 },
  { symbol: "CGH", name: "Chandragiri Hills Limited", sector: "Hotels & Tourism", basePrice: 968, listedShares: 2_20_00_000 },

  { symbol: "UPPER", name: "Upper Tamakoshi Hydropower", sector: "Hydropower", basePrice: 348, listedShares: 12_80_00_000 },
  { symbol: "CHCL", name: "Chilime Hydropower Company", sector: "Hydropower", basePrice: 526, listedShares: 6_10_00_000 },
  { symbol: "API", name: "Api Power Company Limited", sector: "Hydropower", basePrice: 268, listedShares: 4_40_00_000 },
  { symbol: "NHPC", name: "National Hydro Power Company", sector: "Hydropower", basePrice: 182, listedShares: 3_60_00_000 },
  { symbol: "BPCL", name: "Butwal Power Company", sector: "Hydropower", basePrice: 486, listedShares: 5_20_00_000 },
  { symbol: "SHPC", name: "Sanima Mai Hydropower", sector: "Hydropower", basePrice: 512, listedShares: 2_80_00_000 },
  { symbol: "RADHI", name: "Radhi Bidyut Company", sector: "Hydropower", basePrice: 396, listedShares: 1_40_00_000 },

  { symbol: "NRN", name: "NRN Infrastructure and Development", sector: "Investment", basePrice: 232, listedShares: 2_60_00_000 },
  { symbol: "HIDCL", name: "Hydroelectricity Investment & Dev.", sector: "Investment", basePrice: 268, listedShares: 12_00_00_000 },
  { symbol: "NIFRA", name: "Nepal Infrastructure Bank", sector: "Investment", basePrice: 224, listedShares: 20_00_00_000 },
  { symbol: "CHDC", name: "CEDB Hydropower Development", sector: "Investment", basePrice: 318, listedShares: 1_80_00_000 },

  { symbol: "UNL", name: "Unilever Nepal Limited", sector: "Manufacturing", basePrice: 42_800, listedShares: 9_20_000 },
  { symbol: "SHIVM", name: "Shivam Cements Limited", sector: "Manufacturing", basePrice: 562, listedShares: 8_40_00_000 },
  { symbol: "GCIL", name: "Ghorahi Cement Industry", sector: "Manufacturing", basePrice: 786, listedShares: 4_60_00_000 },
  { symbol: "HDL", name: "Himalayan Distillery Limited", sector: "Manufacturing", basePrice: 1_248, listedShares: 2_10_00_000 },

  { symbol: "CBBL", name: "Chhimek Laghubitta Bittiya Sanstha", sector: "Microfinance", basePrice: 892, listedShares: 1_60_00_000 },
  { symbol: "NUBL", name: "Nirdhan Utthan Laghubitta", sector: "Microfinance", basePrice: 848, listedShares: 1_50_00_000 },
  { symbol: "SKBBL", name: "Sana Kisan Bikas Laghubitta", sector: "Microfinance", basePrice: 962, listedShares: 1_30_00_000 },
  { symbol: "DDBL", name: "Deprosc Laghubitta Bittiya Sanstha", sector: "Microfinance", basePrice: 784, listedShares: 1_10_00_000 },

  { symbol: "NLIC", name: "Nepal Life Insurance Company", sector: "Life Insurance", basePrice: 1_042, listedShares: 4_80_00_000 },
  { symbol: "LICN", name: "Life Insurance Corporation Nepal", sector: "Life Insurance", basePrice: 1_386, listedShares: 2_20_00_000 },
  { symbol: "ALICL", name: "Asian Life Insurance Company", sector: "Life Insurance", basePrice: 728, listedShares: 2_60_00_000 },
  { symbol: "SLICL", name: "Sun Nepal Life Insurance", sector: "Life Insurance", basePrice: 684, listedShares: 1_90_00_000 },

  { symbol: "NICL", name: "Nepal Insurance Company", sector: "Non-Life Insurance", basePrice: 812, listedShares: 1_70_00_000 },
  { symbol: "SICL", name: "Shikhar Insurance Company", sector: "Non-Life Insurance", basePrice: 1_124, listedShares: 2_10_00_000 },
  { symbol: "HGI", name: "Himalayan Everest Insurance", sector: "Non-Life Insurance", basePrice: 686, listedShares: 1_60_00_000 },
  { symbol: "NLG", name: "NLG Insurance Company", sector: "Non-Life Insurance", basePrice: 942, listedShares: 1_40_00_000 },

  { symbol: "NTC", name: "Nepal Doorsanchar Company", sector: "Others", basePrice: 924, listedShares: 15_00_00_000 },
  { symbol: "NRIC", name: "Nepal Reinsurance Company", sector: "Others", basePrice: 748, listedShares: 9_60_00_000 },
];
