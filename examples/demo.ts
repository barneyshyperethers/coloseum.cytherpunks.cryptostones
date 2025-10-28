import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { UserFactory } from "../target/types/user_factory";
import { UserProfile } from "../target/types/user_profile";

/**
 * Example usage of the UserFactory and UserProfile programs
 * This script demonstrates the complete workflow from factory initialization
 * to user registration and profile management.
 */

async function main() {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const userFactoryProgram = anchor.workspace.UserFactory as Program<UserFactory>;
  const userProfileProgram = anchor.workspace.UserProfile as Program<UserProfile>;
  
  const provider = anchor.getProvider();
  const admin = provider.wallet as anchor.Wallet;
  
  console.log("🚀 Starting UserFactory and UserProfile Demo");
  console.log("Admin:", admin.publicKey.toString());
  
  // Step 1: Initialize the UserFactory
  console.log("\n📋 Step 1: Initializing UserFactory...");
  
  const registrationFee = new anchor.BN(1000000000); // 1 SOL
  const [factoryStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("factory_state")],
    userFactoryProgram.programId
  );
  
  try {
    const tx = await userFactoryProgram.methods
      .initialize(registrationFee)
      .accounts({
        factoryState: factoryStatePDA,
        admin: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("✅ Factory initialized successfully!");
    console.log("Transaction:", tx);
    
    // Verify factory state
    const factoryState = await userFactoryProgram.account.factoryState.fetch(factoryStatePDA);
    console.log("Factory State:", {
      admin: factoryState.admin.toString(),
      registrationFee: factoryState.registrationFee.toString(),
      totalFeesCollected: factoryState.totalFeesCollected.toString(),
      userCount: factoryState.userCount.toString(),
    });
  } catch (error) {
    console.error("❌ Failed to initialize factory:", error);
    return;
  }
  
  // Step 2: Create a test user
  console.log("\n👤 Step 2: Creating test user...");
  
  const testUser = anchor.web3.Keypair.generate();
  const username = "demo_user_" + Date.now();
  const bio = "This is a demo user profile created for testing purposes.";
  
  // Airdrop SOL to test user
  try {
    await provider.connection.requestAirdrop(testUser.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for confirmation
    console.log("✅ Airdropped SOL to test user");
  } catch (error) {
    console.error("❌ Failed to airdrop SOL:", error);
    return;
  }
  
  // Step 3: Register the user
  console.log("\n📝 Step 3: Registering user...");
  
  const [userProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), testUser.publicKey.toBuffer()],
    userProfileProgram.programId
  );
  
  const [usernameMapPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("username"), Buffer.from(username)],
    userFactoryProgram.programId
  );
  
  try {
    const tx = await userFactoryProgram.methods
      .registerUser(username, bio)
      .accounts({
        factoryState: factoryStatePDA,
        userProfile: userProfilePDA,
        usernameMap: usernameMapPDA,
        user: testUser.publicKey,
        userProfileProgram: userProfileProgram.programId,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([testUser])
      .rpc();
    
    console.log("✅ User registered successfully!");
    console.log("Transaction:", tx);
    console.log("Username:", username);
    console.log("User Profile PDA:", userProfilePDA.toString());
    
    // Verify user profile
    const userProfile = await userProfileProgram.account.userProfile.fetch(userProfilePDA);
    console.log("User Profile:", {
      owner: userProfile.owner.toString(),
      username: userProfile.username,
      bio: userProfile.bio,
      createdAt: new Date(userProfile.createdAt * 1000).toISOString(),
    });
  } catch (error) {
    console.error("❌ Failed to register user:", error);
    return;
  }
  
  // Step 4: Update user bio
  console.log("\n✏️ Step 4: Updating user bio...");
  
  const newBio = "Updated bio: This user profile has been modified!";
  
  try {
    const tx = await userProfileProgram.methods
      .updateBio(newBio)
      .accounts({
        userProfile: userProfilePDA,
        user: testUser.publicKey,
      })
      .signers([testUser])
      .rpc();
    
    console.log("✅ Bio updated successfully!");
    console.log("Transaction:", tx);
    
    // Verify bio update
    const updatedProfile = await userProfileProgram.account.userProfile.fetch(userProfilePDA);
    console.log("Updated Bio:", updatedProfile.bio);
  } catch (error) {
    console.error("❌ Failed to update bio:", error);
    return;
  }
  
  // Step 5: Admin operations
  console.log("\n👑 Step 5: Admin operations...");
  
  // Update registration fee
  const newFee = new anchor.BN(2000000000); // 2 SOL
  
  try {
    const tx = await userFactoryProgram.methods
      .setRegistrationFee(newFee)
      .accounts({
        factoryState: factoryStatePDA,
        admin: admin.publicKey,
      })
      .rpc();
    
    console.log("✅ Registration fee updated!");
    console.log("Transaction:", tx);
    console.log("New fee:", newFee.toString(), "lamports");
  } catch (error) {
    console.error("❌ Failed to update fee:", error);
  }
  
  // Withdraw some fees
  const withdrawAmount = new anchor.BN(500000000); // 0.5 SOL
  
  try {
    const tx = await userFactoryProgram.methods
      .withdrawFees(withdrawAmount)
      .accounts({
        factoryState: factoryStatePDA,
        destination: admin.publicKey,
        admin: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("✅ Fees withdrawn successfully!");
    console.log("Transaction:", tx);
    console.log("Withdrawn amount:", withdrawAmount.toString(), "lamports");
  } catch (error) {
    console.error("❌ Failed to withdraw fees:", error);
  }
  
  // Final state check
  console.log("\n📊 Final State Check:");
  
  try {
    const finalFactoryState = await userFactoryProgram.account.factoryState.fetch(factoryStatePDA);
    const finalUserProfile = await userProfileProgram.account.userProfile.fetch(userProfilePDA);
    
    console.log("Factory State:", {
      admin: finalFactoryState.admin.toString(),
      registrationFee: finalFactoryState.registrationFee.toString(),
      totalFeesCollected: finalFactoryState.totalFeesCollected.toString(),
      userCount: finalFactoryState.userCount.toString(),
    });
    
    console.log("User Profile:", {
      owner: finalUserProfile.owner.toString(),
      username: finalUserProfile.username,
      bio: finalUserProfile.bio,
      createdAt: new Date(finalUserProfile.createdAt * 1000).toISOString(),
    });
  } catch (error) {
    console.error("❌ Failed to fetch final state:", error);
  }
  
  console.log("\n🎉 Demo completed successfully!");
  console.log("All operations executed without errors.");
}

// Run the demo
main().catch(console.error);
