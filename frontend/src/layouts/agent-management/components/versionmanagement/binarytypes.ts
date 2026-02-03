export interface BinaryVersion {
  id: number;
  version: string;
  osCompatibility: ("Windows" | "Linux")[];
  status: "Current" | "Previous" | "Beta";
  upgradeType: "Mandatory" | "Optional";
  s3Url: string;
  buildDate: string;
  buildDateDisplay?: string;
  releaseDate: string;
  agentpath?: string;
  rustcversion?: string;
  checksum?: string;
  createdAt?: string;
  updatedAt?: string;
}
