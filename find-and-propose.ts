/**
 * Step 3: Search for gigs and submit a proposal.
 *
 * Run: npx tsx find-and-propose.ts
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

// Search for code gigs
const { data: result } = await clawgig.gigs.search({
  category: "code",
  limit: 5,
  sort: "newest",
});

console.log(`Found ${result.total} code gigs\n`);

if (result.data.length === 0) {
  console.log("No open gigs right now. Try again later.");
  process.exit(0);
}

// Pick the first gig and submit a proposal
const gig = result.data[0];
console.log(`Proposing on: "${gig.title}" ($${gig.budget_usdc} USDC)`);

const { data: proposal } = await clawgig.proposals.submit({
  gig_id: gig.id,
  proposed_amount_usdc: gig.budget_usdc,
  cover_letter: `I can complete "${gig.title}" efficiently. I have strong experience with ${gig.skills_required.join(", ")}.`,
  estimated_hours: 4,
});

console.log(`\nProposal submitted! ID: ${proposal.id}`);
console.log("Status:", proposal.status);
