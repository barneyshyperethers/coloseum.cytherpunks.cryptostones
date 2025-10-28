import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { UserFactory } from "../target/types/user_factory";
import { UserProfile } from "../target/types/user_profile";
import { expect } from "chai";

describe("UserFactory and UserProfile Integration", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const userFactoryProgram = anchor.workspace.UserFactory as Program<UserFactory>;
  const userProfileProgram = anchor.workspace.UserProfile as Program<UserProfile>;
  
  const provider = anchor.getProvider();
  const admin = provider.wallet as anchor.Wallet;
  
  // Generate test users
  const user1 = anchor.web3.Keypair.generate();
  const user2 = anchor.web3.Keypair.generate();
  const user3 = anchor.web3.Keypair.generate();
  
  const registrationFee = new anchor.BN(1000000000); // 1 SOL in lamports
  const newRegistrationFee = new anchor.BN(2000000000); // 2 SOL in lamports
  
  let factoryStatePDA: anchor.web3.PublicKey;
  let factoryStateBump: number;
  
  before(async () => {
    // Airdrop SOL to test users
    await provider.connection.requestAirdrop(user1.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(user2.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(user3.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    
    // Wait for airdrops to confirm
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Derive factory state PDA
    [factoryStatePDA, factoryStateBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("factory_state")],
      userFactoryProgram.programId
    );
  });

  it("Initialize UserFactory", async () => {
    const tx = await userFactoryProgram.methods
      .initialize(registrationFee)
      .accounts({
        factoryState: factoryStatePDA,
        admin: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Factory initialization transaction:", tx);

    // Verify factory state
    const factoryState = await userFactoryProgram.account.factoryState.fetch(factoryStatePDA);
    expect(factoryState.admin.toString()).to.equal(admin.publicKey.toString());
    expect(factoryState.registrationFee.toString()).to.equal(registrationFee.toString());
    expect(factoryState.totalFeesCollected.toString()).to.equal("0");
    expect(factoryState.userCount.toString()).to.equal("0");
  });

  it("Register first user", async () => {
    const username = "alice123";
    const bio = "Hello, I'm Alice!";
    
    // Derive PDAs
    const [userProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), user1.publicKey.toBuffer()],
      userProfileProgram.programId
    );
    
    const [usernameMapPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("username"), Buffer.from(username)],
      userFactoryProgram.programId
    );

    const tx = await userFactoryProgram.methods
      .registerUser(username, bio)
      .accounts({
        factoryState: factoryStatePDA,
        userProfile: userProfilePDA,
        usernameMap: usernameMapPDA,
        user: user1.publicKey,
        userProfileProgram: userProfileProgram.programId,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    console.log("User registration transaction:", tx);

    // Verify user profile
    const userProfile = await userProfileProgram.account.userProfile.fetch(userProfilePDA);
    expect(userProfile.owner.toString()).to.equal(user1.publicKey.toString());
    expect(userProfile.username).to.equal(username);
    expect(userProfile.bio).to.equal(bio);
    expect(userProfile.createdAt).to.be.greaterThan(0);

    // Verify username mapping
    const usernameMap = await userFactoryProgram.account.usernameMap.fetch(usernameMapPDA);
    expect(usernameMap.username).to.equal(username);
    expect(usernameMap.userProfile.toString()).to.equal(userProfilePDA.toString());

    // Verify factory state updated
    const factoryState = await userFactoryProgram.account.factoryState.fetch(factoryStatePDA);
    expect(factoryState.totalFeesCollected.toString()).to.equal(registrationFee.toString());
    expect(factoryState.userCount.toString()).to.equal("1");
  });

  it("Register second user", async () => {
    const username = "bob456";
    const bio = "Hi there, Bob here!";
    
    // Derive PDAs
    const [userProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), user2.publicKey.toBuffer()],
      userProfileProgram.programId
    );
    
    const [usernameMapPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("username"), Buffer.from(username)],
      userFactoryProgram.programId
    );

    const tx = await userFactoryProgram.methods
      .registerUser(username, bio)
      .accounts({
        factoryState: factoryStatePDA,
        userProfile: userProfilePDA,
        usernameMap: usernameMapPDA,
        user: user2.publicKey,
        userProfileProgram: userProfileProgram.programId,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user2])
      .rpc();

    console.log("Second user registration transaction:", tx);

    // Verify factory state updated
    const factoryState = await userFactoryProgram.account.factoryState.fetch(factoryStatePDA);
    expect(factoryState.totalFeesCollected.toString()).to.equal(registrationFee.mul(new anchor.BN(2)).toString());
    expect(factoryState.userCount.toString()).to.equal("2");
  });

  it("Update user bio", async () => {
    const newBio = "Updated bio for Alice!";
    
    // Derive user profile PDA
    const [userProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), user1.publicKey.toBuffer()],
      userProfileProgram.programId
    );

    const tx = await userProfileProgram.methods
      .updateBio(newBio)
      .accounts({
        userProfile: userProfilePDA,
        user: user1.publicKey,
      })
      .signers([user1])
      .rpc();

    console.log("Bio update transaction:", tx);

    // Verify bio updated
    const userProfile = await userProfileProgram.account.userProfile.fetch(userProfilePDA);
    expect(userProfile.bio).to.equal(newBio);
  });

  it("Change username", async () => {
    const newUsername = "alice_updated";
    
    // Derive PDAs
    const [userProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), user1.publicKey.toBuffer()],
      userProfileProgram.programId
    );
    
    const [oldUsernameMapPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("username"), Buffer.from("alice123")],
      userFactoryProgram.programId
    );
    
    const [newUsernameMapPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("username"), Buffer.from(newUsername)],
      userFactoryProgram.programId
    );

    const tx = await userFactoryProgram.methods
      .changeUsername(newUsername)
      .accounts({
        userProfile: userProfilePDA,
        oldUsernameMap: oldUsernameMapPDA,
        newUsernameMap: newUsernameMapPDA,
        user: user1.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    console.log("Username change transaction:", tx);

    // Verify username updated
    const userProfile = await userProfileProgram.account.userProfile.fetch(userProfilePDA);
    expect(userProfile.username).to.equal(newUsername);

    // Verify new username mapping
    const newUsernameMap = await userFactoryProgram.account.usernameMap.fetch(newUsernameMapPDA);
    expect(newUsernameMap.username).to.equal(newUsername);
    expect(newUsernameMap.userProfile.toString()).to.equal(userProfilePDA.toString());
  });

  it("Transfer ownership", async () => {
    // Derive user profile PDA
    const [userProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), user2.publicKey.toBuffer()],
      userProfileProgram.programId
    );

    const tx = await userProfileProgram.methods
      .transferOwnership(user3.publicKey)
      .accounts({
        userProfile: userProfilePDA,
        currentOwner: user2.publicKey,
      })
      .signers([user2])
      .rpc();

    console.log("Ownership transfer transaction:", tx);

    // Verify ownership transferred
    const userProfile = await userProfileProgram.account.userProfile.fetch(userProfilePDA);
    expect(userProfile.owner.toString()).to.equal(user3.publicKey.toString());
  });

  it("Set new registration fee (admin only)", async () => {
    const tx = await userFactoryProgram.methods
      .setRegistrationFee(newRegistrationFee)
      .accounts({
        factoryState: factoryStatePDA,
        admin: admin.publicKey,
      })
      .rpc();

    console.log("Fee update transaction:", tx);

    // Verify fee updated
    const factoryState = await userFactoryProgram.account.factoryState.fetch(factoryStatePDA);
    expect(factoryState.registrationFee.toString()).to.equal(newRegistrationFee.toString());
  });

  it("Withdraw fees (admin only)", async () => {
    const withdrawAmount = new anchor.BN(500000000); // 0.5 SOL
    
    const tx = await userFactoryProgram.methods
      .withdrawFees(withdrawAmount)
      .accounts({
        factoryState: factoryStatePDA,
        destination: admin.publicKey,
        admin: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Fee withdrawal transaction:", tx);

    // Verify fees withdrawn
    const factoryState = await userFactoryProgram.account.factoryState.fetch(factoryStatePDA);
    const expectedRemaining = registrationFee.mul(new anchor.BN(2)).sub(withdrawAmount);
    expect(factoryState.totalFeesCollected.toString()).to.equal(expectedRemaining.toString());
  });

  it("Should fail to register with duplicate username", async () => {
    const username = "bob456"; // Already taken
    const bio = "This should fail";
    
    // Derive PDAs
    const [userProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), user3.publicKey.toBuffer()],
      userProfileProgram.programId
    );
    
    const [usernameMapPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("username"), Buffer.from(username)],
      userFactoryProgram.programId
    );

    try {
      await userFactoryProgram.methods
        .registerUser(username, bio)
        .accounts({
          factoryState: factoryStatePDA,
          userProfile: userProfilePDA,
          usernameMap: usernameMapPDA,
          user: user3.publicKey,
          userProfileProgram: userProfileProgram.programId,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user3])
        .rpc();
      
      expect.fail("Should have failed with duplicate username");
    } catch (error) {
      expect(error.message).to.include("UsernameAlreadyTaken");
    }
  });

  it("Should fail to update bio with unauthorized user", async () => {
    const newBio = "Unauthorized bio update";
    
    // Derive user profile PDA (user1's profile)
    const [userProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), user1.publicKey.toBuffer()],
      userProfileProgram.programId
    );

    try {
      await userProfileProgram.methods
        .updateBio(newBio)
        .accounts({
          userProfile: userProfilePDA,
          user: user2.publicKey, // Wrong user
        })
        .signers([user2])
        .rpc();
      
      expect.fail("Should have failed with unauthorized access");
    } catch (error) {
      expect(error.message).to.include("Unauthorized");
    }
  });

  it("Should fail to set registration fee with non-admin", async () => {
    try {
      await userFactoryProgram.methods
        .setRegistrationFee(newRegistrationFee)
        .accounts({
          factoryState: factoryStatePDA,
          admin: user1.publicKey, // Not admin
        })
        .signers([user1])
        .rpc();
      
      expect.fail("Should have failed with unauthorized access");
    } catch (error) {
      expect(error.message).to.include("Unauthorized");
    }
  });
});
