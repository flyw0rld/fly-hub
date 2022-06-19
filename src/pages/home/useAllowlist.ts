import { useContext, useMemo } from "react"
import { Web3Context } from "../../context/web3-context"
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "@ethersproject/keccak256";

const allowlist = [
  "0xf51e650531Bc21dFf3fFd0DBea33a22E53dD462b",
  "0xc9B6FbF094B276b9f1BD982D8967Ac93c8ab33cC",
  "0x6096F0Ddb43c6710b9506b1EeC9DEec522655B04",
  "0xFAD42299A14C4A85c5b210aCd587A074eF2Aab65",
  "0xf282512102Bf5eD468E9811d595a5705bE15ae91",
  "0xDEEc740891B52bE7188B3e2B317Cc85992664D2b",
  "0x2e3215F0ceF178B44b2960c0D9Cd6c047a3AD1A6",
  "0xcBcEC7257749a452AcEE7AAA511ee5F2387D267C",
]

const useAllowlist = () => {
  const { account } = useContext(Web3Context)
  if (!account) return {isAllowlist: false, proof: []}

  const lowercaseAllowlist = allowlist.map((address) => address.toLowerCase())
  const leafNodes = allowlist.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const accountSafe = account.toLocaleLowerCase()
  const isAllowlist = lowercaseAllowlist.includes(accountSafe)
  const leaf = keccak256(accountSafe);
  const proof = merkleTree.getProof(leaf).map(p => `0x${p.data.toString("hex")}`);
  
  return {isAllowlist, proof}
}

export default useAllowlist