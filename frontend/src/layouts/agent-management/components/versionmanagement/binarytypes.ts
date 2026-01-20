export interface BinaryVersion {
  id: number;
  version: string;
  osCompatibility: ("Windows" | "Linux")[];
  status: "Current" | "Previous" | "Beta";
  upgradeType: "Mandatory" | "Optional";
  s3Url: string;
  buildDate: string; // Raw date value for sorting
  buildDateDisplay?: string; // Formatted date for display
  releaseDate: string; // Keep for backward compatibility
  // New fields from synced data
  agentpath?: string;
  rustcversion?: string;
  checksum?: string;
  createdAt?: string;
  updatedAt?: string;
}
