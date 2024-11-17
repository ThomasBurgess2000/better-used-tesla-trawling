export interface InventoryParams {
  model: string;
  condition: string;
  arrangeby: string;
  order: string;
  market: string;
  language: string;
  super_region: string;
  lng: number;
  lat: number;
  zip: string;
  range: number;
  region: string;
  offset: number;
  count: number;
  outsideOffset: number;
  outsideSearch: boolean;
  isFalconDeliverySelectionEnabled: boolean;
  options: {
    Year?: string[];
  };
  hwVersions?: string[];
}

export interface InventoryResult {
  results: Vehicle[];
  total_matches_found: string;
}

export interface Vehicle {
  InTransit: boolean;
  ADL_OPTS: string[];
  AUTOPILOT: string[];
  ActualVesselArrivalDate: string | null;
  AlternateCurrency: any[];
  BATTERY: string | null;
  CABIN_CONFIG: string[];
  CPORefurbishmentStatus: string;
  CompositorViews: {
    frontView: string;
    sideView: string;
    interiorView: string;
  };
  CountryCode: string;
  CountryOfOrigin: string;
  CurrencyCode: string;
  CurrencyCodes: string;
  DECOR: string | null;
  DRIVE: string[];
  DamageDisclosure: boolean;
  DamageDisclosureGuids: any[];
  DamageDisclosureStatus: string | null;
  DestinationHandlingFee: number;
  Discount: number;
  DisplayWarranty: boolean;
  ExpectedVesselArrivalDate: string | null;
  FactoryCode: string;
  FactoryGatedDate: string;
  FederalIncentives: {
    IsTaxIncentiveEligible: boolean;
    PriceAfterTaxIncentive: number;
    TaxIncentiveAmount: number;
  };
  FinplatDetails: {
    [key: string]: {
      calculated: {
        inputs: {
          cashDownPayment: number;
          interestRate: number;
          monthlyPayment: number;
          termLength: number;
        };
      };
    };
  };
  FirstRegistrationDate: string | null;
  FixedAssets: boolean;
  FlexibleOptionsData: Array<{
    code: string;
    description: string;
    group: string;
    long_name: string;
    name: string;
    price: number;
  }>;
  HEADLINER: string | null;
  HOVStatus: string | null;
  HasDamagePhotos: boolean;
  INTERIOR: string[];
  InspectionDocumentGuid: string | null;
  InventoryPrice: number;
  IsChargingConnectorIncluded: boolean;
  IsDemo: boolean;
  IsFederalCreditEligible: boolean;
  IsLegacy: boolean;
  IsPreProdWithDisclaimer: boolean;
  Language: string;
  Languages: string[];
  LeaseCountries: string[];
  LexiconDefaultOptions: Array<{
    code: string;
    description: string;
    group: string;
    long_name: string;
    name: string;
  }>;
  ListingType: string;
  ListingTypes: string;
  LoanCountries: string[];
  LoanDetails: any[];
  Model: string;
  Odometer: number;
  OdometerType: string;
  OptionCodeData: Array<{
    code: string;
    group: string;
    price?: number;
    value?: string;
    unit_long?: string;
    unit_short?: string;
    description?: string;
    long_name?: string;
    name?: string;
    range_label_source?: string;
    range_source?: string;
    range_source_inventory_new?: string;
    top_speed_label?: string;
    acceleration_value?: string;
    acceleration_unit_long?: string;
    acceleration_unit_short?: string;
  }>;
  OptionCodeList: string;
  OptionCodeListDisplayOnly: string | null;
  OptionCodePricing: Array<{
    code: string;
    group: string;
    price: number;
  }>;
  OrderFee: {
    type: string;
    value: number;
  };
  OriginalDeliveryDate: string;
  OriginalInCustomerGarageDate: string;
  PAINT: string[];
  Price: number;
  PurchasePrice: number;
  ROOF: string | null;
  STEERING_WHEEL: string | null;
  TRIM: string[];
  TaxScheme: string | null;
  ThirdPartyHistoryUrl: string | null;
  TitleStatus: string;
  TitleSubtype: string | null;
  TotalPrice: number;
  TradeInType: string | null;
  TransportFees: {
    exemptVRL: number[];
    fees: Array<{
      amount: number;
      condition: string;
      query: {
        max: number;
        min: number;
      };
      type: string;
      units: string;
    }>;
    metro_fees: any[];
    trt_to_trt_fees: any[];
  };
  TrimCode: string;
  TrimName: string;
  Trt: number;
  VIN: string;
  VehicleHistory: string;
  VehicleSubType: string | null;
  VehicleType: string;
  Vrl: number;
  VrlLocks: any[];
  WHEELS: string[];
  WarrantyBatteryExpDate: string;
  WarrantyBatteryIsExpired: boolean;
  WarrantyBatteryMile: number;
  WarrantyBatteryYear: number;
  WarrantyData: {
    UsedVehicleLimitedWarrantyMile: number;
    UsedVehicleLimitedWarrantyYear: number;
    WarrantyBatteryExpDate: string;
    WarrantyBatteryIsExpired: boolean;
    WarrantyBatteryMile: number;
    WarrantyBatteryYear: number;
    WarrantyDriveUnitExpDate: string;
    WarrantyDriveUnitMile: number;
    WarrantyDriveUnitYear: number;
    WarrantyMile: number;
    WarrantyVehicleExpDate: string;
    WarrantyVehicleIsExpired: boolean;
    WarrantyYear: number;
  };
  WarrantyDriveUnitExpDate: string;
  WarrantyDriveUnitMile: number;
  WarrantyDriveUnitYear: number;
  WarrantyMile: number;
  WarrantyVehicleExpDate: string;
  WarrantyVehicleIsExpired: boolean;
  WarrantyYear: number;
  Year: number;
  UsedVehicleLimitedWarrantyMile: number;
  UsedVehicleLimitedWarrantyYear: number;
  OdometerTypeShort: string;
  DeliveryDateDisplay: boolean;
  TransportationFee: number;
  vrlList: Array<{
    vrl: number;
    lat: number;
    lon: number;
    vrlLocks: any[];
  }>;
  OptionCodeSpecs: {
    C_SPECS: {
      code: string;
      name: string;
      options: Array<{
        code: string;
        name: string;
        long_name: string;
        description: string;
        lexiconGroup: string;
      }>;
    };
    C_DESIGN: {
      code: string;
      name: string;
      options: any[];
    };
    C_CALLOUTS: {
      code: string;
      name: string;
      options: Array<{
        code: string;
        name: string;
        description: string;
        lexiconGroup: string;
        group?: string;
        list?: string[];
        period?: string;
      }>;
    };
    C_OPTS: {
      code: string;
      name: string;
      options: Array<{
        code: string;
        name: string;
        long_name: string;
        description: string;
        lexiconGroup: string;
      }>;
    };
  };
  CompositorViewsCustom: {
    isProductWithCustomViews: boolean;
    externalZoom: {
      order: number;
      search: number;
    };
    externalCrop: {
      order: string;
      search: string;
    };
  };
  IsRangeStandard: boolean;
  geoPoints: Array<[string, number]>;
  HasMarketingOptions: boolean;
}

export const modelMap: Record<string, string> = {
  my: "Model Y",
  mx: "Model X",
  m3: "Model 3",
  ms: "Model S",
};
