import { ethers } from "ethers";

export type DemoBatch = {
  id: string; // bytes32
  name: string;
  brand: string;
  batch: string;
  expiry: string;
  type: string;
  status: "verified" | "pending" | "fake";
  manufacturer: string;
  custody: {
    step: string;
    entity: string;
    proof: string;
    time: string;
    status: "verified" | "pending" | "fake";
  }[];
};

export const generateBatchId = (drugName: string, batchNumber: string) => {
  return ethers.keccak256(ethers.toUtf8Bytes(drugName + batchNumber));
};

const getPastTime = (minutesAgo: number) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toISOString();
};

export const demoMedicines: DemoBatch[] = [
  // 4 Verified
  {
    id: generateBatchId("Amoxicillin", "AMX2024-01A"),
    name: "Amoxicillin 500mg",
    brand: "PharmaCorp",
    batch: "AMX2024-01A",
    expiry: "2026-12-01",
    type: "Antibiotic",
    status: "verified",
    manufacturer: "0x123...abc",
    custody: [
      { step: "Manufacturer", entity: "PharmaCorp Ind.", proof: "0xproof_1", time: getPastTime(2880), status: "verified" },
      { step: "Distributor", entity: "Global Meds Dist", proof: "0xproof_2", time: getPastTime(1440), status: "verified" },
      { step: "Wholesaler", entity: "CityHealth Supply", proof: "0xproof_3", time: getPastTime(360), status: "verified" },
      { step: "Pharmacy", entity: "LocalCare Rx", proof: "0xproof_4", time: getPastTime(30), status: "verified" },
    ]
  },
  {
    id: generateBatchId("Paracetamol", "PAR2024-05B"),
    name: "Paracetamol 650mg",
    brand: "HealthCorp",
    batch: "PAR2024-05B",
    expiry: "2027-01-15",
    type: "Analgesic",
    status: "verified",
    manufacturer: "0x456...def",
    custody: [
      { step: "Manufacturer", entity: "HealthCorp Labs", proof: "0xproof_10", time: getPastTime(5000), status: "verified" },
      { step: "Distributor", entity: "National Supply Co.", proof: "0xproof_11", time: getPastTime(3000), status: "verified" },
      { step: "Wholesaler", entity: "Regional Med Hub", proof: "0xproof_12", time: getPastTime(1000), status: "verified" },
      { step: "Pharmacy", entity: "City Pharmacy", proof: "0xproof_13", time: getPastTime(120), status: "verified" },
    ]
  },
  {
    id: generateBatchId("Aspirin", "ASP2024-11C"),
    name: "Aspirin 81mg",
    brand: "Bayer",
    batch: "ASP2024-11C",
    expiry: "2026-08-20",
    type: "Analgesic",
    status: "verified",
    manufacturer: "0x789...ghi",
    custody: [
      { step: "Manufacturer", entity: "Bayer Mfg", proof: "0xproof_20", time: getPastTime(8000), status: "verified" },
      { step: "Distributor", entity: "Elite Distributors", proof: "0xproof_21", time: getPastTime(4000), status: "verified" },
      { step: "Wholesaler", entity: "Town Wholesale", proof: "0xproof_22", time: getPastTime(2000), status: "verified" },
      { step: "Pharmacy", entity: "Downtown Drugs", proof: "0xproof_23", time: getPastTime(500), status: "verified" },
    ]
  },
  {
    id: generateBatchId("Ibuprofen", "IBU2024-09D"),
    name: "Ibuprofen 400mg",
    brand: "Advil",
    batch: "IBU2024-09D",
    expiry: "2025-10-10",
    type: "NSAID",
    status: "verified",
    manufacturer: "0xabc...jkl",
    custody: [
      { step: "Manufacturer", entity: "Pfizer", proof: "0xproof_30", time: getPastTime(10000), status: "verified" },
      { step: "Distributor", entity: "MedLogistics", proof: "0xproof_31", time: getPastTime(5000), status: "verified" },
      { step: "Wholesaler", entity: "SafeCare Supplies", proof: "0xproof_32", time: getPastTime(1500), status: "verified" },
      { step: "Pharmacy", entity: "Community Rx", proof: "0xproof_33", time: getPastTime(200), status: "verified" },
    ]
  },
  // 1 Pending
  {
    id: generateBatchId("Lisinopril", "LIS2024-02E"),
    name: "Lisinopril 10mg",
    brand: "Zestril",
    batch: "LIS2024-02E",
    expiry: "2026-05-05",
    type: "ACE Inhibitor",
    status: "pending",
    manufacturer: "0xdef...mno",
    custody: [
      { step: "Manufacturer", entity: "AstraZeneca", proof: "0xproof_40", time: getPastTime(5000), status: "verified" },
      { step: "Distributor", entity: "Global Meds Dist", proof: "0xproof_41", time: getPastTime(100), status: "verified" },
    ]
  },
  // 1 Fake
  {
    id: generateBatchId("Atorvastatin", "ATO2024-99X"),
    name: "Atorvastatin 20mg",
    brand: "Lipitor",
    batch: "ATO2024-99X",
    expiry: "2026-11-20",
    type: "Statin",
    status: "fake",
    manufacturer: "0x000...bad",
    custody: [
      { step: "Manufacturer", entity: "Unknown Factory", proof: "0xproof_invalid", time: getPastTime(600), status: "fake" },
      { step: "Distributor", entity: "Shady Deliveries", proof: "0xproof_invalid_2", time: getPastTime(300), status: "fake" },
      { step: "Wholesaler", entity: "Counterfeit Hub", proof: "0xproof_invalid_3", time: getPastTime(150), status: "fake" },
      { step: "Pharmacy", entity: "Unlicensed Rx", proof: "0xproof_invalid_4", time: getPastTime(10), status: "fake" },
    ]
  }
];

export const DEMO_MODE = true;
