import { ethers } from "ethers";

export async function getEnsNames(signer: any, addresses: any) {
  const ensContractAddress = "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C";
  const ensAbi = `[{"inputs":[{"internalType":"contract ENS","name":"_ens","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address[]","name":"addresses","type":"address[]"}],"name":"getNames","outputs":[{"internalType":"string[]","name":"r","type":"string[]"}],"stateMutability":"view","type":"function"}]`;
  const reverseRecords = new ethers.Contract(
    ensContractAddress,
    ensAbi,
    signer
  );
  const ensNames = await reverseRecords.getNames(addresses);
  return ensNames
}

export function shortenAddress(address: string) {
  return address.slice(0, 5) + "..." + address.slice(-4);
}
