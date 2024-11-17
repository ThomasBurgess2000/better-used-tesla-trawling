"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { getInventory } from "./actions";
import {
  InventoryParams,
  InventoryResult,
  modelMap,
  Vehicle,
} from "@/app/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Car, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zipCoordinates } from "./zip_coordinates";
import { Switch } from "@/components/ui/switch";

// Helper function to determine HW version
const getHardwareVersion = (factoryDateStr: string, vin: string): string[] => {
  const factoryDate = new Date(factoryDateStr);
  const prettyDate = factoryDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const cutoffDate = new Date("2023-06-01");
  const factoryCode = vin.substring(10, 11);
  const factoryNumber = parseInt(vin.substring(11, 14));
  let factoryCheck = "HW3";
  let vinCheck = "HW3";
  if (factoryCode === "A") {
    if (factoryNumber >= 131) {
      vinCheck = "HW4";
    }
  } else if (factoryCode === "F") {
    if (factoryNumber >= 798) {
      vinCheck = "HW4";
    }
  }
  if (factoryDate > cutoffDate) {
    factoryCheck = "HW4";
  }
  if (vinCheck === factoryCheck) {
    return [
      `${vinCheck}`,
      `VIN: ${factoryCode}${factoryNumber}, Left Factory: ${prettyDate}`,
    ];
  }
  return [
    "Unknown HW Version",
    `VIN: ${factoryCode}${factoryNumber}, Left Factory: ${prettyDate}`,
  ];
};

export default function InventoryPage() {
  const [results, setResults] = useState<InventoryResult | null>(null);
  const [filteredResults, setFilteredResults] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [includeTransport, setIncludeTransport] = useState(false);
  const [includeTaxes, setIncludeTaxes] = useState(false);
  const { register, handleSubmit, control } = useForm<InventoryParams>({
    defaultValues: {
      model: "my",
      condition: "used",
      arrangeby: "Price",
      order: "asc",
      market: "US",
      language: "en",
      super_region: "north america",
      lng: -118.008961,
      lat: 33.902045,
      zip: "90638",
      range: 0,
      region: "CA",
      offset: 0,
      count: 50,
      outsideOffset: 0,
      outsideSearch: false,
      isFalconDeliverySelectionEnabled: false,
      options: {
        Year: [],
      },
      hwVersions: [],
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  // Load selected vehicles from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("selectedVehicles");
    if (stored) {
      setSelectedVehicles(JSON.parse(stored));
    }
  }, []);

  // Persist selected vehicles to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedVehicles", JSON.stringify(selectedVehicles));
  }, [selectedVehicles]);

  const onSubmit = async (data: InventoryParams) => {
    setIsLoading(true);
    try {
      const zip = data.zip.trim();
      const coordinates = zipCoordinates[zip];

      if (!coordinates) {
        toast({
          title: "Invalid ZIP Code",
          description:
            "The entered ZIP code is not recognized. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const completeData: InventoryParams = {
        ...data,
        market: data.market || "US",
        language: data.language || "en",
        super_region: data.super_region || "north america",
        lng: coordinates.lng,
        lat: coordinates.lat,
        region: data.region || "CA",
        offset: data.offset || 0,
        outsideOffset: data.outsideOffset || 0,
      };
      const result: InventoryResult = await getInventory(completeData);
      console.log(
        "Retrieved ",
        result.results.length,
        "of",
        result.total_matches_found,
        "results"
      );
      setResults(result);
      setFilteredResults(
        filterResultsByHWVersion(result.results, data.hwVersions || [])
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch inventory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    const exists = selectedVehicles.find((v) => v.VIN === vehicle.VIN);
    if (exists) {
      setSelectedVehicles(
        selectedVehicles.filter((v) => v.VIN !== vehicle.VIN)
      );
    } else {
      setSelectedVehicles([...selectedVehicles, vehicle]);
    }
  };

  const isVehicleSelected = (vehicle: Vehicle) => {
    return selectedVehicles.some((v) => v.VIN === vehicle.VIN);
  };

  const handleCompare = () => {
    router.push("/compare");
  };

  const filterResultsByHWVersion = (
    results: Vehicle[],
    hwVersions: string[]
  ) => {
    if (!hwVersions?.length) return results;
    return results.filter((vehicle) => {
      const [hwVersion] = getHardwareVersion(
        vehicle.FactoryGatedDate,
        vehicle.VIN
      );
      return hwVersions.includes(hwVersion);
    });
  };

  // Helper function to calculate total price
  const calculateTotalPrice = (basePrice: number, transportFee: number) => {
    let total = basePrice;
    if (includeTransport) {
      total += transportFee;
    }
    if (includeTaxes) {
      total += basePrice * 0.1; // 10% tax on base price
    }
    return total;
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/">
        <h1 className="text-3xl font-bold mb-6">Better Used Tesla Trawling</h1>
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-1/3 xl:w-1/4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sticky top-4"
          >
            {/* Form fields remain the same, but change grid layout to single column */}
            <div className="space-y-4">
              {/* Model Select */}
              <div>
                <Label htmlFor="model">Model</Label>
                <Controller
                  control={control}
                  name="model"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="my">Model Y</SelectItem>
                        <SelectItem value="m3">Model 3</SelectItem>
                        <SelectItem value="ms">Model S</SelectItem>
                        <SelectItem value="mx">Model X</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Arrange By Select */}
              <div>
                <Label htmlFor="arrangeby">Arrange By</Label>
                <Controller
                  control={control}
                  name="arrangeby"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Arrangement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Price">Price</SelectItem>
                        <SelectItem value="Year">Year</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Order Select */}
              <div>
                <Label htmlFor="order">Order</Label>
                <Controller
                  control={control}
                  name="order"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* ZIP Code Input */}
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  type="text"
                  {...register("zip")}
                  placeholder="Enter ZIP Code"
                />
              </div>

              {/* Year Selection */}
              <div>
                <Label>Model Years</Label>
                <div>
                  <Controller
                    control={control}
                    name="options.Year"
                    render={({ field }) => (
                      <>
                        <Select
                          onValueChange={(year) => {
                            if (!field.value?.includes(year)) {
                              field.onChange([...(field.value || []), year]);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 8 }, (_, i) =>
                              (2018 + i).toString()
                            ).map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value?.map((year) => (
                            <div
                              key={year}
                              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                            >
                              {year}
                              <button
                                type="button"
                                onClick={() => {
                                  field.onChange(
                                    field.value?.filter((y) => y !== year) || []
                                  );
                                }}
                                className="hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>

              {/* Hardware Version Selection */}
              <div>
                <Label>Hardware Version</Label>
                <div>
                  <Controller
                    control={control}
                    name="hwVersions"
                    render={({ field }) => (
                      <>
                        <Select
                          onValueChange={(version) => {
                            if (!field.value?.includes(version)) {
                              field.onChange([...(field.value || []), version]);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Hardware Version" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HW3">HW3</SelectItem>
                            <SelectItem value="HW4">HW4</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value?.map((version) => (
                            <div
                              key={version}
                              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                            >
                              {version}
                              <button
                                type="button"
                                onClick={() => {
                                  field.onChange(
                                    field.value?.filter((v) => v !== version) ||
                                      []
                                  );
                                }}
                                className="hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>

              {/* Outside Search Switch */}
              <div className="flex items-center space-x-2">
                <Controller
                  control={control}
                  name="outsideSearch"
                  render={({ field }) => (
                    <Switch
                      id="outside-search"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="outside-search">
                  Full United States Inventory
                </Label>
              </div>

              {/* Submit Button and Results Count - moved to bottom of sidebar */}
              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Search Used Inventory"
                  )}
                </Button>
                {results && (
                  <div className="text-sm text-muted-foreground text-center">
                    Showing {filteredResults.length} vehicles
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Main Content */}
        <div className="lg:w-2/3 xl:w-3/4">
          <div className="flex flex-col space-y-4 mb-4">
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-transport"
                  checked={includeTransport}
                  onCheckedChange={setIncludeTransport}
                />
                <Label htmlFor="include-transport">
                  Include Transport Fee in Price
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-taxes"
                  checked={includeTaxes}
                  onCheckedChange={setIncludeTaxes}
                />
                <Label htmlFor="include-taxes">
                  Include Estimated Taxes and Fees in Price
                </Label>
              </div>
            </div>
            {selectedVehicles.length > 0 && (
              <Button
                onClick={handleCompare}
                variant="secondary"
                className="w-full md:w-1/6"
              >
                Compare ({selectedVehicles.length})
              </Button>
            )}
          </div>

          {/* Results Section */}
          <div className="md:border md:rounded-lg md:p-6">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : results ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredResults.map((vehicle: Vehicle) => (
                  <Card key={vehicle.VIN}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>
                          {vehicle.Year} {modelMap[vehicle.Model]}{" "}
                          <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: vehicle.PAINT?.includes("WHITE")
                                ? "white"
                                : vehicle.PAINT?.includes("BLACK")
                                ? "black"
                                : vehicle.PAINT?.includes("BLUE")
                                ? "blue"
                                : vehicle.PAINT?.includes("RED")
                                ? "red"
                                : vehicle.PAINT?.includes("GREY")
                                ? "grey"
                                : "transparent",
                              border: vehicle.PAINT?.includes("WHITE")
                                ? "1px solid #ccc"
                                : "none",
                            }}
                          ></span>
                        </CardTitle>
                        <input
                          type="checkbox"
                          checked={isVehicleSelected(vehicle)}
                          onChange={() => handleSelectVehicle(vehicle)}
                          className="h-4 w-4"
                        />
                      </div>
                      <CardDescription>
                        {vehicle.TrimName || vehicle.TRIM?.join(", ")}
                      </CardDescription>
                    </CardHeader>
                    <div className="flex justify-between">
                      <CardContent>
                        <p className="font-bold text-2xl">
                          $
                          {calculateTotalPrice(
                            vehicle.Price,
                            vehicle.TransportationFee || 0
                          ).toLocaleString()}
                          {!includeTransport && (
                            <span className="font-normal text-xl">
                              {" "}
                              + ${vehicle.TransportationFee?.toLocaleString()}{" "}
                              transport
                            </span>
                          )}
                        </p>
                        <p>{vehicle.Odometer?.toLocaleString()} miles</p>
                        <p>
                          {
                            getHardwareVersion(
                              vehicle.FactoryGatedDate,
                              vehicle.VIN
                            )[0]
                          }
                        </p>
                      </CardContent>
                      <CardContent className="text-right">
                        <p className="font-bold text-2xl">
                          {vehicle.OptionCodeSpecs?.C_SPECS?.options?.find(
                            (opt) => opt.code === "SPECS_RANGE"
                          )?.name || "N/A"}
                        </p>
                        <p>
                          {vehicle.OptionCodeSpecs?.C_SPECS?.options?.find(
                            (opt) => opt.code === "SPECS_ACCELERATION"
                          )?.name || "N/A"}
                        </p>
                        <p className="font-bold">
                          {vehicle.OptionCodeSpecs?.C_OPTS?.options?.find(
                            (opt) => opt.code === "$APF2"
                          )
                            ? "FSD Incl."
                            : ""}
                        </p>
                      </CardContent>
                    </div>
                    <CardFooter>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Car className="mr-2 h-4 w-4" /> View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>
                              {vehicle.Year} {modelMap[vehicle.Model]} Details
                            </DialogTitle>
                            <DialogDescription>
                              VIN: {vehicle.VIN}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="interior" className="text-right">
                                Interior
                              </Label>
                              <div className="col-span-3">
                                {vehicle.INTERIOR?.join(", ") || "N/A"}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="hardware-version"
                                className="text-right"
                              >
                                Hardware Version
                              </Label>
                              <div className="col-span-1">
                                {
                                  getHardwareVersion(
                                    vehicle.FactoryGatedDate,
                                    vehicle.VIN
                                  )[0]
                                }
                              </div>
                              <div className="col-span-2 italic">
                                (
                                {
                                  getHardwareVersion(
                                    vehicle.FactoryGatedDate,
                                    vehicle.VIN
                                  )[1]
                                }
                                )
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="fsd-status" className="text-right">
                                FSD Status
                              </Label>
                              <div className="col-span-3">
                                {vehicle.OptionCodeSpecs?.C_OPTS?.options?.find(
                                  (opt) => opt.code === "$APF2"
                                )
                                  ? "Included"
                                  : "Not Included"}
                              </div>
                            </div>
                            <div className="border-t pt-4">
                              <details className="text-sm">
                                <summary className="cursor-pointer font-medium">
                                  Show Raw Vehicle Data
                                </summary>
                                <pre className="mt-2 max-h-96 overflow-auto rounded bg-slate-100 p-4 text-xs break-all whitespace-pre-wrap">
                                  {JSON.stringify(vehicle, null, 2)}
                                </pre>
                              </details>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center min-h-[200px]">
                Search for vehicles to see results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
