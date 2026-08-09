import type { TPassport, TReport, TSourcedString } from "@/lib/schemas/passport";
import { computeScores } from "@/lib/scoring/score";

const f = (value: string | null, confidence: number | null = null, source: string | null = null): TSourcedString => ({
  value,
  confidence,
  source,
});

export type ExploreAsset = {
  id: string;
  name: string;
  ticker: string;
  category: string;
  networks: string[];
  description: string;
  website: string;
  hasDemo: boolean;
};

export const EXPLORE_CATEGORIES = [
  "Tokenized Treasuries",
  "Stablecoins",
  "Private Credit",
  "Tokenized Funds",
  "Commodities",
  "Real Estate",
  "Tokenized Equities",
] as const;

/**
 * Curated starter metadata for Explore. This is descriptive catalog
 * information, not live analysis — cards are labeled accordingly in the UI.
 */
export const EXPLORE_ASSETS: ExploreAsset[] = [
  {
    id: "ousg",
    name: "Ondo Short-Term US Government Bond Fund",
    ticker: "OUSG",
    category: "Tokenized Treasuries",
    networks: ["Ethereum", "Polygon", "Solana"],
    description: "Tokenized exposure to short-duration U.S. Treasuries, primarily via institutional money-market funds.",
    website: "https://ondo.finance",
    hasDemo: true,
  },
  {
    id: "buidl",
    name: "BlackRock USD Institutional Digital Liquidity Fund",
    ticker: "BUIDL",
    category: "Tokenized Funds",
    networks: ["Ethereum", "Solana", "Arbitrum", "Avalanche", "Polygon", "Optimism"],
    description: "Institutional tokenized money-market fund issued through Securitize, holding cash and U.S. Treasuries.",
    website: "https://securitize.io",
    hasDemo: true,
  },
  {
    id: "usdy",
    name: "Ondo US Dollar Yield Token",
    ticker: "USDY",
    category: "Tokenized Treasuries",
    networks: ["Ethereum", "Solana", "Mantle", "Sui", "Aptos"],
    description: "Yield-bearing token backed by short-term U.S. Treasuries and bank demand deposits, for non-U.S. persons.",
    website: "https://ondo.finance",
    hasDemo: true,
  },
  {
    id: "usdc",
    name: "USD Coin",
    ticker: "USDC",
    category: "Stablecoins",
    networks: ["Ethereum", "Solana", "Base", "Arbitrum", "Avalanche", "Polygon"],
    description: "Fiat-backed stablecoin issued by Circle, redeemable 1:1 for U.S. dollars.",
    website: "https://www.circle.com",
    hasDemo: false,
  },
  {
    id: "paxg",
    name: "Pax Gold",
    ticker: "PAXG",
    category: "Commodities",
    networks: ["Ethereum"],
    description: "Token backed by allocated physical gold held in London vaults, issued by Paxos.",
    website: "https://paxos.com/paxgold",
    hasDemo: false,
  },
  {
    id: "tbill",
    name: "OpenEden TBILL Vault",
    ticker: "TBILL",
    category: "Tokenized Treasuries",
    networks: ["Ethereum", "Arbitrum"],
    description: "Tokenized vault providing direct exposure to short-dated U.S. Treasury bills.",
    website: "https://openeden.com",
    hasDemo: false,
  },
  {
    id: "maple",
    name: "Maple Finance Cash Management",
    ticker: "SYRUP",
    category: "Private Credit",
    networks: ["Ethereum", "Solana", "Base"],
    description: "Onchain credit marketplace offering managed lending pools and cash-management products.",
    website: "https://maple.finance",
    hasDemo: false,
  },
  {
    id: "realt",
    name: "RealT Tokenized Real Estate",
    ticker: "REALT",
    category: "Real Estate",
    networks: ["Ethereum", "Gnosis"],
    description: "Fractionalized ownership tokens over individual U.S. rental properties.",
    website: "https://realt.co",
    hasDemo: false,
  },
  {
    id: "bcap",
    name: "Blockchain Capital Fund Token",
    ticker: "BCAP",
    category: "Tokenized Equities",
    networks: ["Ethereum"],
    description: "One of the earliest tokenized venture fund interests, issued via Securitize.",
    website: "https://blockchain.capital",
    hasDemo: false,
  },
];

/* ------------------------------------------------------------------ */
/* Demo passports — curated illustrative research, clearly marked Demo */
/* ------------------------------------------------------------------ */

const ondo = "https://ondo.finance";
const securitize = "https://securitize.io";

const OUSG_PASSPORT: TPassport = {
  identity: {
    name: "Ondo Short-Term US Government Bond Fund",
    ticker: "OUSG",
    oneLiner: "Tokenized U.S. Treasury exposure for qualified purchasers",
    category: "Tokenized Treasuries",
    primaryChain: "Ethereum",
    website: ondo,
  },
  summary:
    "OUSG provides tokenized exposure to short-duration U.S. government securities through a structured onchain product issued by Ondo. The bulk of the portfolio has historically been allocated to institutional short-term treasury funds such as BlackRock's BUIDL, alongside cash for liquidity management. The asset benefits from identifiable underlying exposure, recognized service providers and instant mint/redeem rails against stablecoins. Investors should still weigh investor-eligibility restrictions, smart-contract dependencies, and the fact that secondary-market liquidity is limited compared to primary redemption.",
  whatYouAreBuying:
    "Economically, holding OUSG is similar to holding shares of a short-term U.S. government money-market strategy, wrapped in a token. Your return comes from the interest earned by short-duration Treasuries and treasury-backed funds held by the issuer's fund structure — not from token speculation. You are trusting the fund structure to actually hold those assets, the issuer to operate mint and redemption honestly, and the smart contracts and eligibility gating to work as described.",
  asset: {
    underlyingAsset: f("Short-duration U.S. Treasuries, primarily via institutional treasury funds (e.g. BUIDL), plus cash", 0.85, ondo),
    assetClass: f("Government securities / money market", 0.95, ondo),
    issuer: f("Ondo (Ondo I LP fund structure)", 0.85, ondo),
    productStructure: f("Tokenized interest in a fund investing in short-term U.S. government securities", 0.8, ondo),
    currency: f("USD", 0.95, ondo),
    reportedAum: f(null, null, null),
    yieldMechanism: f("Accrues via net asset value appreciation of the fund's holdings", 0.8, ondo),
  },
  token: {
    symbol: f("OUSG", 0.98, ondo),
    blockchain: f("Ethereum (also available on additional networks)", 0.9, ondo),
    contract: f("0x1B19C19393e2d034D8Ff31ff34c81252FcBbee92", 0.7, null),
    standard: f("ERC-20 with transfer restrictions", 0.85, null),
    transferability: f("Restricted to allowlisted, eligible investor addresses", 0.85, ondo),
    mintBurn: f("Minted on subscription, burned on redemption; instant mint/redeem against USDC available", 0.8, ondo),
    supply: f(null, null, null),
  },
  yield: {
    source: f("Interest on short-duration U.S. government securities held by the fund", 0.85, ondo),
    reportedApy: f(null, null, null),
    distribution: f("Price-accruing: yield reflected in rising token NAV rather than periodic payouts", 0.8, ondo),
    sustainability:
      "Yield tracks prevailing short-term U.S. rates minus fees. It is backed by real interest income rather than token incentives, so it moves with Federal Reserve policy rather than crypto-market conditions.",
  },
  redemption: {
    available: f("Yes — primary redemption with the issuer, including instant redemption to USDC within limits", 0.85, ondo),
    minimum: f(null, null, null),
    settlementTime: f("Instant for USDC rails within limits; longer for traditional settlement", 0.6, null),
    currency: f("USDC / USD", 0.85, ondo),
    restrictions: f("Limited to qualified purchasers who have completed onboarding and KYC", 0.85, ondo),
    primaryVsSecondary:
      "Liquidity is primarily via redemption with the issuer. Onchain secondary markets for OUSG are thin by design because transfers are restricted to eligible addresses.",
  },
  custody: {
    assetCustodian: f(null, null, null),
    tokenCustodyDependencies: f("Self-custody of an allowlisted address, or a qualifying custodian supported by the issuer", 0.7, null),
    serviceProviders: f("Fund administration and brokerage providers engaged by the issuer; underlying fund managers include BlackRock (via BUIDL)", 0.7, ondo),
    offchainDependencies: f("Traditional fund accounting, transfer-agent records and banking rails", 0.75, null),
  },
  legal: {
    jurisdiction: f("United States (Delaware fund structures)", 0.7, null),
    structure: f("Fund interests represented by tokens; parallel onchain/offchain record-keeping", 0.7, null),
    eligibility: f("Qualified purchasers only (U.S. securities-law standard above accredited investor)", 0.85, ondo),
    kyc: f("Full KYC/AML onboarding required before minting or receiving tokens", 0.9, ondo),
    transferRestrictions: f("Transfers restricted to allowlisted addresses", 0.85, ondo),
    regulatoryNotes: f("Offered under U.S. private-placement exemptions; not a registered public fund", 0.6, null),
  },
  liquidity: {
    markets: f("Primary mint/redeem with issuer; limited restricted secondary transfers", 0.8, ondo),
    dexCexAvailability: f("Not freely tradable on public DEXs/CEXs due to transfer restrictions", 0.8, null),
    reportedLiquidity: f(null, null, null),
    primaryRedemption: f("Instant redemption to USDC within program limits; standard redemption otherwise", 0.8, ondo),
    concentration: f("Liquidity depends on the issuer's redemption capacity rather than market depth", 0.75, null),
    limitations:
      "If instant-redemption liquidity is exhausted, holders rely on standard fund redemption timelines. There is no meaningful public order book to exit into.",
  },
  multichain: {
    chains: [
      { chain: "Ethereum", interoperability: "Native" },
      { chain: "Polygon", interoperability: "Unknown" },
      { chain: "Solana", interoperability: "Unknown" },
    ],
    notes: "Availability beyond Ethereum has expanded over time; verify current supported networks and their mint/redeem paths with the issuer.",
  },
  risks: [
    { category: "Asset Risk", level: "LOW", explanation: "Short-duration U.S. government securities carry minimal credit and duration risk, though not zero interest-rate risk." },
    { category: "Liquidity Risk", level: "MODERATE", explanation: "Exit depends on issuer redemption rails; there is no deep public secondary market." },
    { category: "Issuer Risk", level: "MODERATE", explanation: "Holders depend on the issuer's operations, fund accounting and continued solvency of the program structure." },
    { category: "Custody Risk", level: "MODERATE", explanation: "Underlying securities sit with traditional custodians; specific custodian disclosure should be verified in current fund documents." },
    { category: "Smart Contract Risk", level: "MODERATE", explanation: "Token contracts include allowlist and mint/burn logic controlled by the issuer; a defect or key compromise would affect holders." },
    { category: "Redemption Risk", level: "MODERATE", explanation: "Instant redemption is subject to program limits; larger exits may face standard settlement timelines." },
    { category: "Regulatory Risk", level: "MODERATE", explanation: "Offered under private-placement exemptions; regulatory changes to tokenized securities could affect the product." },
    { category: "Oracle Risk", level: "LOW", explanation: "NAV is administratively determined rather than dependent on onchain price oracles." },
  ],
  redFlags: [
    "Specific asset custodian is not clearly identified in easily accessible public material — verify in current fund documentation.",
    "Instant redemption capacity has program limits that are not publicly quantified.",
    "Transfer restrictions mean tokens cannot be freely sold if redemption is unavailable.",
  ],
  questionsToAsk: [
    "Which entity legally owns the securities backing OUSG, and what claim do token holders have if it becomes insolvent?",
    "What are the current limits on instant USDC redemption, and what happens when they are exhausted?",
    "Which custodian holds the underlying fund assets today, and is that disclosure updated regularly?",
    "How is the token's NAV calculated and audited, and how often?",
    "What exactly happens to allowlisted status and holdings if Ondo winds down the product?",
  ],
  factors: {
    transparency: { score: 88, evidence: 0.85, note: "Structure, eligibility and mechanics are well documented publicly." },
    assetBacking: { score: 90, evidence: 0.8, note: "Identifiable exposure to U.S. government securities via established funds." },
    liquidity: { score: 68, evidence: 0.8, note: "Issuer-dependent liquidity; no meaningful public secondary market." },
    redemption: { score: 84, evidence: 0.8, note: "Instant USDC rails within limits plus standard fund redemption." },
    custody: { score: 78, evidence: 0.6, note: "Established providers, but custodian specifics require document-level verification." },
    contractRisk: { score: 80, evidence: 0.7, note: "Mature ERC-20 pattern with issuer-controlled allowlist and mint authority." },
    counterpartyRisk: { score: 78, evidence: 0.75, note: "Concentrated reliance on issuer operations and underlying fund managers." },
    multichain: { score: 66, evidence: 0.6, note: "Multi-network availability exists but varies; verify current chain support." },
  },
  sources: [
    { url: ondo, title: "Ondo Finance — official site", kind: "website" },
    { url: "https://docs.ondo.finance", title: "Ondo documentation", kind: "doc" },
  ],
};

const BUIDL_PASSPORT: TPassport = {
  identity: {
    name: "BlackRock USD Institutional Digital Liquidity Fund",
    ticker: "BUIDL",
    oneLiner: "Institutional tokenized money-market fund issued via Securitize",
    category: "Tokenized Funds",
    primaryChain: "Ethereum",
    website: securitize,
  },
  summary:
    "BUIDL is a tokenized money-market-style fund from BlackRock, issued and administered through Securitize. It invests in cash, U.S. Treasury bills and repurchase agreements, targeting a stable $1 token value with yield paid as monthly token dividends. It is one of the most institutionally credentialed products in tokenized treasuries, with named, established service providers. Access is limited to qualified institutional-grade investors onboarded through Securitize, and tokens transfer only between whitelisted addresses.",
  whatYouAreBuying:
    "A BUIDL token represents a share of a BlackRock-managed fund holding cash, T-bills and repo — essentially institutional money-market exposure recorded on a blockchain. Yield accrues daily and is distributed monthly as additional tokens. You are buying the fund's credit and operational quality: BlackRock's management, a traditional custodian holding the securities, and Securitize's transfer-agent and tokenization infrastructure.",
  asset: {
    underlyingAsset: f("Cash, U.S. Treasury bills, and repurchase agreements", 0.9, securitize),
    assetClass: f("Money market / government securities", 0.95, securitize),
    issuer: f("BlackRock USD Institutional Digital Liquidity Fund Ltd. (BVI), managed by BlackRock", 0.85, securitize),
    productStructure: f("Tokenized fund shares; Securitize acts as transfer agent and tokenization platform", 0.85, securitize),
    currency: f("USD", 0.95, null),
    reportedAum: f(null, null, null),
    yieldMechanism: f("Daily accrued dividends distributed monthly as new tokens; token targets stable $1 value", 0.85, securitize),
  },
  token: {
    symbol: f("BUIDL", 0.98, securitize),
    blockchain: f("Ethereum, with extensions to multiple additional networks", 0.85, securitize),
    contract: f(null, null, null),
    standard: f("Permissioned ERC-20 (whitelist-gated transfers)", 0.85, null),
    transferability: f("Only between pre-approved, whitelisted investor addresses", 0.9, securitize),
    mintBurn: f("Minted on subscription and burned on redemption via Securitize", 0.85, securitize),
    supply: f(null, null, null),
  },
  yield: {
    source: f("Interest income from T-bills, repo and cash equivalents", 0.9, securitize),
    reportedApy: f(null, null, null),
    distribution: f("Monthly dividend paid in additional BUIDL tokens", 0.85, securitize),
    sustainability:
      "Yield is conventional money-market income tied to short-term U.S. rates. It does not rely on token emissions or crypto-native incentives.",
  },
  redemption: {
    available: f("Yes — redemption through Securitize; USDC exit liquidity has been made available via program partners", 0.8, securitize),
    minimum: f("High institutional minimums apply to subscriptions (verify current terms)", 0.6, null),
    settlementTime: f(null, null, null),
    currency: f("USD (fund redemption); USDC via liquidity facility", 0.75, null),
    restrictions: f("Qualified investors onboarded via Securitize; whitelist-only transfers", 0.9, securitize),
    primaryVsSecondary:
      "Liquidity is primary-market by design: subscribe and redeem through the transfer agent, plus a stablecoin exit facility. There is no public secondary order book.",
  },
  custody: {
    assetCustodian: f("Bank of New York Mellon (custodian and administrator for the fund's assets)", 0.8, null),
    tokenCustodyDependencies: f("Whitelisted self-custody or approved institutional custodians", 0.75, null),
    serviceProviders: f("BlackRock (manager), Securitize (transfer agent), BNY Mellon (custody/administration)", 0.8, null),
    offchainDependencies: f("Traditional fund accounting, custody and banking infrastructure", 0.85, null),
  },
  legal: {
    jurisdiction: f("British Virgin Islands fund; offered under U.S. private-placement exemptions", 0.75, null),
    structure: f("BVI limited company issuing tokenized shares; Securitize maintains the official register", 0.75, null),
    eligibility: f("Qualified purchasers / institutional investors via Securitize onboarding", 0.85, securitize),
    kyc: f("Full institutional KYC/AML required", 0.9, securitize),
    transferRestrictions: f("Whitelist-only; transfers outside approved addresses are blocked at the contract level", 0.85, null),
    regulatoryNotes: f("Private offering; not registered under the Investment Company Act for public distribution", 0.6, null),
  },
  liquidity: {
    markets: f("Primary subscription/redemption via Securitize; USDC exit facility", 0.8, securitize),
    dexCexAvailability: f("Not available on public DEXs or CEXs", 0.85, null),
    reportedLiquidity: f(null, null, null),
    primaryRedemption: f("Available; supported by a stablecoin liquidity facility for near-instant exits", 0.7, null),
    concentration: f("Dependent on fund operations and the capacity of the exit facility", 0.7, null),
    limitations:
      "Holders cannot sell into a public market. Exits depend on fund redemption processing and the stablecoin facility's capacity.",
  },
  multichain: {
    chains: [
      { chain: "Ethereum", interoperability: "Native" },
      { chain: "Solana", interoperability: "Native" },
      { chain: "Arbitrum", interoperability: "Native" },
      { chain: "Avalanche", interoperability: "Native" },
      { chain: "Polygon", interoperability: "Native" },
      { chain: "Optimism", interoperability: "Native" },
    ],
    notes: "The fund has issued natively across multiple networks via Securitize rather than bridging a single deployment.",
  },
  risks: [
    { category: "Asset Risk", level: "LOW", explanation: "Cash, T-bills and repo represent the lowest-risk end of USD fixed income." },
    { category: "Liquidity Risk", level: "MODERATE", explanation: "No public market; exits flow through the transfer agent and a capacity-limited stablecoin facility." },
    { category: "Issuer Risk", level: "LOW", explanation: "Managed by the world's largest asset manager with named, established service providers." },
    { category: "Custody Risk", level: "LOW", explanation: "Assets custodied with a major traditional custodian (BNY Mellon)." },
    { category: "Smart Contract Risk", level: "MODERATE", explanation: "Permissioned contracts controlled by the transfer agent; holders rely on Securitize's key management." },
    { category: "Redemption Risk", level: "MODERATE", explanation: "Institutional processing timelines; stablecoin exits depend on facility capacity." },
    { category: "Regulatory Risk", level: "MODERATE", explanation: "Private placement structure; tokenized-securities regulation continues to evolve." },
    { category: "Oracle Risk", level: "LOW", explanation: "Stable $1 accounting value maintained administratively; no oracle dependency for NAV." },
  ],
  redFlags: [
    "High institutional minimums and whitelist gating make this inaccessible to most individual investors.",
    "Exit liquidity outside fund redemption depends on a third-party stablecoin facility whose capacity is not publicly quantified.",
  ],
  questionsToAsk: [
    "What is the current capacity of the USDC exit facility, and who operates it?",
    "How quickly can a standard (non-facility) redemption settle in stressed markets?",
    "What happens to whitelisted tokens if Securitize's platform suffers an outage or is compromised?",
    "Do token holders rank identically to traditional shareholders of the fund in an insolvency?",
    "Which network deployments hold meaningful supply today, and are terms identical across them?",
  ],
  factors: {
    transparency: { score: 90, evidence: 0.85, note: "Institutional documentation with named service providers." },
    assetBacking: { score: 95, evidence: 0.85, note: "Cash, T-bills and repo held with a major custodian." },
    liquidity: { score: 70, evidence: 0.75, note: "Primary-market only, mitigated by a stablecoin exit facility." },
    redemption: { score: 82, evidence: 0.7, note: "Established institutional redemption plus near-instant facility exits." },
    custody: { score: 92, evidence: 0.8, note: "BNY Mellon custody and administration." },
    contractRisk: { score: 80, evidence: 0.7, note: "Permissioned contracts; transfer-agent key management is the main dependency." },
    counterpartyRisk: { score: 85, evidence: 0.8, note: "Top-tier counterparties, though the stack is operationally centralized." },
    multichain: { score: 78, evidence: 0.75, note: "Native issuance across many networks." },
  },
  sources: [
    { url: securitize, title: "Securitize — official site", kind: "website" },
    { url: "https://www.blackrock.com", title: "BlackRock", kind: "website" },
  ],
};

const USDY_PASSPORT: TPassport = {
  identity: {
    name: "Ondo US Dollar Yield Token",
    ticker: "USDY",
    oneLiner: "Yield-bearing dollar token for non-U.S. persons, backed by Treasuries and bank deposits",
    category: "Tokenized Treasuries",
    primaryChain: "Ethereum",
    website: ondo,
  },
  summary:
    "USDY is a yield-bearing token backed by short-term U.S. Treasuries and bank demand deposits, structured as a note issued by a bankruptcy-remote Ondo entity. Unlike permissioned institutional funds, USDY is designed to be more freely transferable after an initial lockup, but it is offered only to non-U.S. persons. Yield accrues through a rising token price. Holders take exposure to the note structure, the collateral mix, banking counterparties, and the issuer's operational integrity.",
  whatYouAreBuying:
    "USDY is closer to a tokenized secured note than a fund share: you hold a debt-like claim on an Ondo entity, collateralized by short-term Treasuries and bank deposits, with first-loss protection from an overcollateralization buffer. Your return comes from interest on that collateral, reflected in a token price that rises over time. You rely on the collateral actually being there, the security interest being enforceable, and banking counterparties staying solvent.",
  asset: {
    underlyingAsset: f("Short-term U.S. Treasuries and bank demand deposits", 0.85, ondo),
    assetClass: f("Government securities and cash deposits", 0.9, ondo),
    issuer: f("Ondo USDY LLC (bankruptcy-remote issuer)", 0.8, ondo),
    productStructure: f("Tokenized note secured by the collateral pool, with overcollateralization buffer", 0.75, ondo),
    currency: f("USD", 0.95, null),
    reportedAum: f(null, null, null),
    yieldMechanism: f("Variable APY set by the issuer, accruing via rising token price", 0.8, ondo),
  },
  token: {
    symbol: f("USDY", 0.98, ondo),
    blockchain: f("Ethereum, plus Solana, Mantle, Sui, Aptos and other networks", 0.8, ondo),
    contract: f(null, null, null),
    standard: f("ERC-20 (accumulating price) with rUSDY rebasing variant", 0.75, null),
    transferability: f("Transferable to non-U.S. persons after a 40-plus-day initial restriction from mint", 0.75, ondo),
    mintBurn: f("Minted on subscription with USDC/USD; redeemed through the issuer", 0.8, ondo),
    supply: f(null, null, null),
  },
  yield: {
    source: f("Interest on Treasuries and bank deposits in the collateral pool", 0.85, ondo),
    reportedApy: f(null, null, null),
    distribution: f("Price-accruing; rUSDY variant rebases to maintain $1 with growing balance", 0.75, ondo),
    sustainability:
      "Yield derives from real collateral interest minus fees and is announced monthly by the issuer. It tracks short-term USD rates rather than crypto incentives.",
  },
  redemption: {
    available: f("Yes — redemption with the issuer for eligible non-U.S. holders", 0.8, ondo),
    minimum: f(null, null, null),
    settlementTime: f(null, null, null),
    currency: f("USDC / USD", 0.8, ondo),
    restrictions: f("Not offered to U.S. persons; KYC required for primary mint/redeem; initial transfer lockup applies", 0.85, ondo),
    primaryVsSecondary:
      "Both paths exist: primary redemption with the issuer, and secondary transfers/DEX liquidity on several chains once tokens are unrestricted.",
  },
  custody: {
    assetCustodian: f("Regulated custodians and banks hold the collateral (verify current providers in disclosures)", 0.6, null),
    tokenCustodyDependencies: f("Standard self-custody; no allowlist after the initial restriction period", 0.75, null),
    serviceProviders: f("Collateral agent structure with a security interest for token holders", 0.6, ondo),
    offchainDependencies: f("Banking relationships for demand deposits; fund-style accounting and verification", 0.7, null),
  },
  legal: {
    jurisdiction: f("United States issuer; offered offshore under Regulation S", 0.7, null),
    structure: f("Bankruptcy-remote LLC issuing secured notes represented by tokens", 0.7, ondo),
    eligibility: f("Non-U.S. persons only", 0.85, ondo),
    kyc: f("KYC required for primary subscription and redemption; secondary transfers are more open", 0.75, ondo),
    transferRestrictions: f("40-plus-day restriction after mint; ongoing prohibition on transfers to U.S. persons", 0.75, ondo),
    regulatoryNotes: f("Regulation S offering; not registered with the SEC", 0.65, null),
  },
  liquidity: {
    markets: f("Issuer mint/redeem plus DEX liquidity on multiple networks", 0.75, null),
    dexCexAvailability: f("Available on major DEXs on several chains; depth varies by network", 0.7, null),
    reportedLiquidity: f(null, null, null),
    primaryRedemption: f("Available through the issuer for eligible holders", 0.8, ondo),
    concentration: f("Secondary liquidity is spread across chains and can be thin on newer deployments", 0.6, null),
    limitations:
      "DEX depth is meaningful but far smaller than the token's supply; large exits realistically depend on primary redemption.",
  },
  multichain: {
    chains: [
      { chain: "Ethereum", interoperability: "Native" },
      { chain: "Solana", interoperability: "Native" },
      { chain: "Mantle", interoperability: "Bridged" },
      { chain: "Sui", interoperability: "Native" },
      { chain: "Aptos", interoperability: "Native" },
    ],
    notes: "USDY has expanded across many networks with a mix of native issuance and bridge-based deployments; verify the path for the chain you use.",
  },
  risks: [
    { category: "Asset Risk", level: "LOW", explanation: "Short-term Treasuries dominate; bank deposits add modest bank-credit exposure." },
    { category: "Liquidity Risk", level: "MODERATE", explanation: "DEX liquidity exists but is limited relative to supply; big exits need primary redemption." },
    { category: "Issuer Risk", level: "MODERATE", explanation: "Note-structure claims depend on the issuer entity, its collateral agent and enforcement of the security interest." },
    { category: "Custody Risk", level: "MODERATE", explanation: "Collateral is spread across custodians and banks whose identities should be verified in current disclosures." },
    { category: "Counterparty Risk", level: "MODERATE", explanation: "Bank demand deposits introduce bank-failure exposure beyond pure Treasury risk." },
    { category: "Smart Contract Risk", level: "MODERATE", explanation: "Multiple deployments and a rebasing variant increase contract surface area." },
    { category: "Bridge Risk", level: "MODERATE", explanation: "Some network deployments rely on bridging infrastructure rather than native issuance." },
    { category: "Regulatory Risk", level: "MODERATE", explanation: "Regulation S offshore structure; treatment of yield-bearing dollar tokens continues to evolve." },
  ],
  redFlags: [
    "Collateral custodian and banking-partner identities require document-level verification rather than being prominent on the website.",
    "A portion of backing sits in bank demand deposits, which carry more credit risk than Treasuries.",
    "Some chain deployments are bridge-dependent.",
    "Not available to U.S. persons — geographic eligibility limits both access and potential exit demand.",
  ],
  questionsToAsk: [
    "How is the overcollateralization buffer sized today, and how often is it verified by a third party?",
    "Which banks hold the demand deposits, and what happens to holders if one fails?",
    "How enforceable is the token holders' security interest in practice, and who acts as collateral agent?",
    "What share of circulating USDY sits on bridge-dependent networks?",
    "What is the current announced APY, and how has it tracked short-term Treasury rates?",
  ],
  factors: {
    transparency: { score: 82, evidence: 0.75, note: "Good structural documentation; some collateral details live in offering documents." },
    assetBacking: { score: 85, evidence: 0.75, note: "Treasuries plus bank deposits with an overcollateralization buffer." },
    liquidity: { score: 74, evidence: 0.7, note: "Real DEX availability across chains, but thin relative to supply." },
    redemption: { score: 78, evidence: 0.7, note: "Primary redemption exists; timelines and minimums need verification." },
    custody: { score: 70, evidence: 0.55, note: "Custodian/bank identities not prominently disclosed in marketing material." },
    contractRisk: { score: 72, evidence: 0.6, note: "Wide multichain surface plus rebasing variant." },
    counterpartyRisk: { score: 72, evidence: 0.65, note: "Bank deposit exposure and issuer-entity dependence." },
    multichain: { score: 80, evidence: 0.7, note: "Broad availability, mixing native and bridged deployments." },
  },
  sources: [
    { url: ondo, title: "Ondo Finance — official site", kind: "website" },
    { url: "https://docs.ondo.finance", title: "Ondo documentation", kind: "doc" },
  ],
};

const DEMO_PASSPORTS: Record<string, TPassport> = {
  ousg: OUSG_PASSPORT,
  buidl: BUIDL_PASSPORT,
  usdy: USDY_PASSPORT,
};

export function getDemoReport(idOrQuery: string): TReport | null {
  const q = idOrQuery.trim().toLowerCase();
  const id = ["ousg", "buidl", "usdy"].find((k) => k === q) ?? null;
  if (!id) return null;
  const passport = DEMO_PASSPORTS[id];
  return {
    id: `demo_${id}`,
    createdAt: Date.now(),
    demo: true,
    query: passport.identity.ticker ?? passport.identity.name,
    passport,
    scores: computeScores(passport.factors),
    market: null,
  };
}
