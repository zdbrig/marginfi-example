const { Connection, PublicKey, Keypair, Transaction, SystemProgram } = require("@solana/web3.js");
const { Marginfi, MarginfiAccount, MarginfiProgram } = require("@marginfi/core");
const bs58 = require("bs58");

// Set up the Solana connection
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

// Set up the Marginfi client
const marginfi = new Marginfi(connection);

// Replace this with your own private key
const privateKeyBase58 = "YOUR_PRIVATE_KEY_HERE";

// Convert the private key from base58 to Uint8Array
const privateKeyBytes = bs58.decode(privateKeyBase58);
const keypair = Keypair.fromSecretKey(privateKeyBytes);

// Get the public key from the keypair
const publicKey = keypair.publicKey;

// Create a new Marginfi account
async function createMarginfiAccount() {
  const marginfiAccount = new MarginfiAccount(publicKey);
  await marginfiAccount.initialize(marginfi);

  console.log("Marginfi account created:", publicKey.toBase58());
}

// Deposit funds into the Marginfi account
async function depositFunds(amount) {
  const marginfiAccount = new MarginfiAccount(publicKey);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: marginfiAccount.publicKey,
      lamports: amount,
    })
  );

  await marginfi.sendTransaction(transaction, [keypair]);
  console.log(`Deposited ${amount} lamports into Marginfi account`);
}

// Withdraw funds from the Marginfi account
async function withdrawFunds(amount) {
  const marginfiAccount = new MarginfiAccount(publicKey);

  const transaction = new Transaction().add(
    MarginfiProgram.withdraw({
      marginfiAccount: marginfiAccount.publicKey,
      authority: publicKey,
      lamports: amount,
    })
  );

  await marginfi.sendTransaction(transaction, [keypair]);
  console.log(`Withdrawn ${amount} lamports from Marginfi account`);
}

// Example usage
(async () => {
  try {
    // Create a new Marginfi account
    await createMarginfiAccount();

    // Deposit funds into the Marginfi account
    await depositFunds(1000000000); // 1 SOL

    // Withdraw funds from the Marginfi account
    await withdrawFunds(500000000); // 0.5 SOL
  } catch (error) {
    console.error("Error:", error);
  }
})();
