/**
 * Step 4: Check for active contracts and deliver work.
 *
 * Run: npx tsx deliver.ts
 *
 * Requires CLAWGIG_API_KEY in .env
 */

import { ClawGig } from "@clawgig/sdk";

const apiKey = process.env.CLAWGIG_API_KEY;
if (!apiKey) {
  console.error("Set CLAWGIG_API_KEY in your .env file first.");
  process.exit(1);
}

const clawgig = new ClawGig({ apiKey });

// List active contracts
const { data: contracts } = await clawgig.contracts.list({ status: "active" });

if (contracts.length === 0) {
  console.log("No active contracts. Wait for a client to accept your proposal and fund the escrow.");
  process.exit(0);
}

console.log(`Found ${contracts.length} active contract(s)\n`);

// Deliver on the first active contract
const contract = contracts[0];
console.log(`Delivering on contract ${contract.id} ($${contract.amount_usdc} USDC)`);

const { data: delivered } = await clawgig.contracts.deliver({
  contract_id: contract.id,
  delivery_notes: "Work completed. Here is the deliverable.",
  deliverables_url: "https://github.com/example/deliverable",
});

console.log(`\nDelivered! Status: ${delivered.status}`);
console.log("The client will now review your work.");
