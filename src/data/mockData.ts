export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
  volume_24h: number;
  image: string;
}

export const mockCryptoData: CryptoCoin[] = [
  {
    id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin',
    current_price: 108740.19, price_change_percentage_24h: -0.15,
    market_cap: 2150000000000, market_cap_rank: 1, volume_24h: 1030000000,
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
  },
  {
    id: 'ripple', symbol: 'XRP', name: 'XRP',
    current_price: 2.27416, price_change_percentage_24h: -0.05,
    market_cap: 129000000000, market_cap_rank: 2, volume_24h: 4420470000,
    image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png'
  },
  {
    id: 'ethereum', symbol: 'ETH', name: 'Ethereum',
    current_price: 2547.7, price_change_percentage_24h: -0.39,
    market_cap: 306000000000, market_cap_rank: 3, volume_24h: 1020000000,
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
  },
  {
    id: 'litecoin', symbol: 'LTC', name: 'Litecoin',
    current_price: 87.56, price_change_percentage_24h: -0.46,
    market_cap: 6580000000, market_cap_rank: 4, volume_24h: 1510730000,
    image: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png'
  },
  {
    id: 'cardano', symbol: 'ADA', name: 'Cardano',
    current_price: 0.58486, price_change_percentage_24h: -0.12,
    market_cap: 20400000000, market_cap_rank: 5, volume_24h: 1681150000,
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png'
  },
  {
    id: 'tron', symbol: 'TRX', name: 'TRON',
    current_price: 0.285657, price_change_percentage_24h: 0.00,
    market_cap: 24500000000, market_cap_rank: 6, volume_24h: 581320000,
    image: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png'
  },
  {
    id: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic',
    current_price: 16.6581, price_change_percentage_24h: 0.26,
    market_cap: 2450000000, market_cap_rank: 7, volume_24h: 1620000,
    image: 'https://assets.coingecko.com/coins/images/453/small/ethereum-classic-logo.png'
  },
  {
    id: 'eos', symbol: 'EOS', name: 'EOS',
    current_price: 0.7231, price_change_percentage_24h: -1.35,
    market_cap: 767000000, market_cap_rank: 8, volume_24h: 40650000,
    image: 'https://assets.coingecko.com/coins/images/738/small/eos-eos-logo.png'
  },
  {
    id: 'chainlink', symbol: 'LINK', name: 'Chainlink',
    current_price: 13.4586, price_change_percentage_24h: 0.16,
    market_cap: 8150000000, market_cap_rank: 9, volume_24h: 1239300000,
    image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png'
  },
  {
    id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash',
    current_price: 497.03, price_change_percentage_24h: 0.40,
    market_cap: 9820000000, market_cap_rank: 10, volume_24h: 1406950000,
    image: 'https://assets.coingecko.com/coins/images/780/small/bitcoin-cash-circle.png'
  },
  {
    id: 'iota', symbol: 'IOTA', name: 'IOTA',
    current_price: 0.1587, price_change_percentage_24h: 0.00,
    market_cap: 558000000, market_cap_rank: 11, volume_24h: 165180000,
    image: 'https://assets.coingecko.com/coins/images/692/small/IOTA_Swirl.png'
  },
  {
    id: 'tellor', symbol: 'TRB', name: 'Tellor',
    current_price: 36.831, price_change_percentage_24h: 0.34,
    market_cap: 98700000, market_cap_rank: 12, volume_24h: 87030000,
    image: 'https://assets.coingecko.com/coins/images/9644/small/Blk_icon_current.png'
  },
  {
    id: 'zcash', symbol: 'ZEC', name: 'Zcash',
    current_price: 39.22, price_change_percentage_24h: 1.81,
    market_cap: 623000000, market_cap_rank: 13, volume_24h: 74490000,
    image: 'https://assets.coingecko.com/coins/images/486/small/circle-zcash-color.png'
  },
  {
    id: 'monero', symbol: 'XMR', name: 'Monero',
    current_price: 319.55, price_change_percentage_24h: 0.96,
    market_cap: 5920000000, market_cap_rank: 14, volume_24h: 945030000,
    image: 'https://assets.coingecko.com/coins/images/69/small/monero_logo.png'
  },
  {
    id: 'bitcoin-sv', symbol: 'BSV', name: 'Bitcoin SV',
    current_price: 24.35, price_change_percentage_24h: 0.48,
    market_cap: 481000000, market_cap_rank: 15, volume_24h: 316620000,
    image: 'https://assets.coingecko.com/coins/images/6799/small/BSV.png'
  },
  {
    id: 'huobi-token', symbol: 'HT', name: 'Huobi Token',
    current_price: 1.7964, price_change_percentage_24h: 1.74,
    market_cap: 278000000, market_cap_rank: 16, volume_24h: 1349890000,
    image: 'https://assets.coingecko.com/coins/images/2822/small/huobi-token-logo.png'
  }
];
