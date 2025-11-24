import { client } from "@gradio/client";

export interface PlantAnalysisResult {
  healthStatus: string;
  recommendation: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  fetchStatus: string;
}

// Use this to let the ML model fetch data from ThingSpeak itself
export const analyzeLiveData = async (): Promise<PlantAnalysisResult> => {
  try {
    const app = await client("vipul918/Npkvaluepredictor");

    // Call analyze_live_data - no inputs needed, ML model fetches from ThingSpeak
    const result = await app.predict("/analyze_live_data", []);

    // Result format from documentation:
    // [0] Fetch Status
    // [1] Health Status
    // [2] Recommendation
    // [3] Nitrogen (N)
    // [4] Phosphorus (P)
    // [5] Potassium (K)
    // [6] Soil Moisture
    // [7] Temperature
    // [8] Humidity

    const data = (result as any).data;

    return {
      fetchStatus: data[0] as string,
      healthStatus: data[1] as string,
      recommendation: data[2] as string,
      nitrogen: Number(data[3]),
      phosphorus: Number(data[4]),
      potassium: Number(data[5]),
      soilMoisture: Number(data[6]),
      temperature: Number(data[7]),
      humidity: Number(data[8])
    };
  } catch (error) {
    console.error("Error calling plant analysis API:", error);
    // Return default/fallback values in case of error
    return {
      fetchStatus: "Error",
      healthStatus: "Unknown",
      recommendation: "Unable to analyze plant health at this time.",
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      soilMoisture: 0,
      temperature: 0,
      humidity: 0
    };
  }
};

// Keep the old function for manual testing if needed
export const analyzePlantHealth = async (
  soilMoisture: number,
  temperature: number,
  humidity: number,
  lightIntensity: number
): Promise<PlantAnalysisResult> => {
  try {
    const app = await client("vipul918/Npkvaluepredictor");

    const result = await app.predict("/analyze_plant", [
      soilMoisture,
      temperature,
      humidity,
      lightIntensity
    ]);

    const data = (result as any).data;

    return {
      fetchStatus: "Success",
      healthStatus: data[0] as string,
      recommendation: data[1] as string,
      nitrogen: Number(data[2]),
      phosphorus: Number(data[3]),
      potassium: Number(data[4]),
      soilMoisture,
      temperature,
      humidity
    };
  } catch (error) {
    console.error("Error calling plant analysis API:", error);
    return {
      fetchStatus: "Error",
      healthStatus: "Unknown",
      recommendation: "Unable to analyze plant health at this time.",
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      soilMoisture: 0,
      temperature: 0,
      humidity: 0
    };
  }
};
