"use server";

import { InventoryParams, InventoryResult } from "../types";

export async function getInventory(
  params: InventoryParams
): Promise<InventoryResult> {
  const allResults: any[] = [];
  let offset = params.offset || 0;
  let outsideOffset = params.outsideOffset || 0;
  let totalMatches = 0;
  let initialTotalMatches = 0;
  let hasMore = true;

  while (hasMore) {
    const query = {
      query: {
        model: params.model,
        condition: params.condition,
        options: {
          ...(params.options?.Year?.length ? { Year: params.options.Year } : {}),
        },
        arrangeby: params.arrangeby,
        order: params.order,
        market: params.market,
        language: params.language,
        super_region: params.super_region,
        lng: params.lng,
        lat: params.lat,
        zip: params.zip,
        range: params.range,
        region: params.region,
      },
      offset: offset,
      count: 50,
      outsideOffset: outsideOffset,
      outsideSearch: params.outsideSearch,
      isFalconDeliverySelectionEnabled: params.isFalconDeliverySelectionEnabled,
      version: null,
    };

    const queryParam = encodeURIComponent(JSON.stringify(query));
    const url = `https://www.tesla.com/inventory/api/v4/inventory-results?query=${queryParam}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch inventory: ${response.statusText}`);
      }

      const data: InventoryResult = await response.json();
      console.log(
        "Returned",
        data.total_matches_found,
        "results for ",
        url,
        ". Showing ",
        data.results?.length ?? 0
      );

      if (data.results && Array.isArray(data.results)) {
        allResults.push(...data.results);
      }

      if (totalMatches === 0) {
        initialTotalMatches = parseInt(data.total_matches_found);
      }
      totalMatches = parseInt(data.total_matches_found);

      // Check if we have fetched all results
      if (allResults.length >= totalMatches || !data.results || data.results.length === 0) {
        hasMore = false;
      } else {
        if (params.outsideSearch) {
          outsideOffset += 50;
        } else {
          offset += 50; // Increment offset to fetch next batch
        }
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw error;
    }
  }

  return {
    ...params,
    results: allResults,
    total_matches_found: initialTotalMatches.toString(),
  };
}
