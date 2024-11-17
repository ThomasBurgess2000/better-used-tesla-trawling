"use client";

import { useEffect, useState } from "react";
import { Vehicle, modelMap } from "@/app/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  console.log(vin, factoryNumber);
  return [
    "Unknown HW Version",
    `VIN: ${factoryCode}${factoryNumber}, Left Factory: ${prettyDate}`,
  ];
};

export default function ComparePage() {
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);

  // Load selected vehicles from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("selectedVehicles");
    if (stored) {
      setSelectedVehicles(JSON.parse(stored));
    }
  }, []);

  // If no vehicles are selected, show a message
  if (selectedVehicles.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Compare Vehicles</h1>
        <p>No vehicles selected for comparison.</p>
        <Link href="/inventory" className="text-blue-500 underline">
          Go back to Inventory
        </Link>
      </div>
    );
  }

  // Function to handle removing a vehicle from comparison
  const removeVehicle = (vin: string) => {
    const updated = selectedVehicles.filter((v) => v.VIN !== vin);
    setSelectedVehicles(updated);
    localStorage.setItem("selectedVehicles", JSON.stringify(updated));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Compare Vehicles</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Field</th>
              {selectedVehicles.map((vehicle) => (
                <th key={vehicle.VIN} className="border px-4 py-2">
                  {vehicle.Year} {modelMap[vehicle.Model]}
                  <br />
                  <span className="text-sm text-gray-600">{vehicle.VIN}</span>
                  <br />
                  <button
                    onClick={() => removeVehicle(vehicle.VIN)}
                    className="mt-2 text-red-500 text-sm underline"
                  >
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Year */}
            <tr>
              <td className="border px-4 py-2 font-semibold">Year</td>
              {selectedVehicles.map((vehicle) => (
                <td key={vehicle.VIN} className="border px-4 py-2 text-center">
                  {vehicle.Year}
                </td>
              ))}
            </tr>
            {/* Price */}
            <tr>
              <td className="border px-4 py-2 font-semibold">Price</td>
              {selectedVehicles.map((vehicle) => (
                <td key={vehicle.VIN} className="border px-4 py-2 text-center">
                  ${vehicle.Price?.toLocaleString() || "N/A"}
                </td>
              ))}
            </tr>
            {/* Color */}
            <tr>
              <td className="border px-4 py-2 font-semibold">Color</td>
              {selectedVehicles.map((vehicle) => (
                <td key={vehicle.VIN} className="border px-4 py-2 text-center items-center justify-center space-x-2">
                  <span
                    className="inline-block w-4 h-4 rounded-full"
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
                  <span>{vehicle.PAINT?.join(", ") || "N/A"}</span>
                </td>
              ))}
            </tr>
            {/* Interior Color */}
            <tr>
              <td className="border px-4 py-2 font-semibold">Interior Color</td>
              {selectedVehicles.map((vehicle) => (
                <td key={vehicle.VIN} className="border px-4 py-2 text-center">
                  {vehicle.INTERIOR?.join(", ") || "N/A"}
                </td>
              ))}
            </tr>
            {/* Mileage */}
            <tr>
              <td className="border px-4 py-2 font-semibold">Mileage</td>
              {selectedVehicles.map((vehicle) => (
                <td key={vehicle.VIN} className="border px-4 py-2 text-center">
                  {vehicle.Odometer?.toLocaleString()} miles
                </td>
              ))}
            </tr>
            {/* Hardware Version */}
            <tr>
              <td className="border px-4 py-2 font-semibold">Hardware Version</td>
              {selectedVehicles.map((vehicle) => (
                <td key={vehicle.VIN} className="border px-4 py-2 text-center">
                  {getHardwareVersion(vehicle.FactoryGatedDate, vehicle.VIN)[0]}
                </td>
              ))}
            </tr>
            {/* Range */}
            <tr>
              <td className="border px-4 py-2 font-semibold">Range</td>
              {selectedVehicles.map((vehicle) => (
                <td key={vehicle.VIN} className="border px-4 py-2 text-center">
                  {vehicle.OptionCodeSpecs?.C_SPECS?.options?.find(
                    (opt) => opt.code === "SPECS_RANGE"
                  )?.name || "N/A"}
                </td>
              ))}
            </tr>
            {/* Acceleration Speed */}
            <tr>
              <td className="border px-4 py-2 font-semibold">Acceleration (0-60 mph)</td>
              {selectedVehicles.map((vehicle) => (
                <td key={vehicle.VIN} className="border px-4 py-2 text-center">
                  {vehicle.OptionCodeSpecs?.C_SPECS?.options?.find(
                    (opt) => opt.code === "SPECS_ACCELERATION"
                  )?.name || "N/A"}
                </td>
              ))}
            </tr>
            {/* FSD Included */}
            <tr>
              <td className="border px-4 py-2 font-semibold">FSD Included</td>
              {selectedVehicles.map((vehicle) => (
                <td key={vehicle.VIN} className="border px-4 py-2 text-center">
                  {vehicle.OptionCodeSpecs?.C_OPTS?.options?.find(
                    (opt) => opt.code === "$APF2"
                  )
                    ? "Yes"
                    : "No"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <Link href="/inventory">
          <Button variant="secondary">Back to Inventory</Button>
        </Link>
      </div>
    </div>
  );
}
