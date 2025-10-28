import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VendorFactory } from "../target/types/vendor_factory";
import { VendorProfile } from "../target/types/vendor_profile";
import { expect } from "chai";

describe("vendor-system", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const vendorFactoryProgram = anchor.workspace.VendorFactory as Program<VendorFactory>;
  const vendorProfileProgram = anchor.workspace.VendorProfile as Program<VendorProfile>;
  
  const provider = anchor.getProvider();
  const admin = provider.wallet as anchor.Wallet;
  
  // Test accounts
  const vendor1 = anchor.web3.Keypair.generate();
  const vendor2 = anchor.web3.Keypair.generate();
  
  // PDAs
  const [factoryStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("factory-state")],
    vendorFactoryProgram.programId
  );
  
  const [factoryVaultPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("factory-vault")],
    vendorFactoryProgram.programId
  );

  it("Initialize factory", async () => {
    const registrationFee = new anchor.BN(1000000000); // 1 SOL in lamports
    
    const tx = await vendorFactoryProgram.methods
      .initialize(admin.publicKey, registrationFee)
      .accounts({
        factoryState: factoryStatePDA,
        payer: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("Factory initialization transaction:", tx);
    
    // Verify factory state
    const factoryState = await vendorFactoryProgram.account.factoryState.fetch(factoryStatePDA);
    expect(factoryState.admin.toString()).to.equal(admin.publicKey.toString());
    expect(factoryState.registrationFee.toString()).to.equal(registrationFee.toString());
    expect(factoryState.paused).to.be.false;
    expect(factoryState.totalCollectedFees.toString()).to.equal("0");
  });

  it("Register vendor successfully", async () => {
    const vendorName = "TestVendor1";
    const description = "A test vendor for demonstration";
    
    const [vendorProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vendor-profile"), Buffer.from(vendorName)],
      vendorProfileProgram.programId
    );
    
    const tx = await vendorFactoryProgram.methods
      .registerVendor(vendorName, description)
      .accounts({
        factoryState: factoryStatePDA,
        vendorProfile: vendorProfilePDA,
        factoryVault: factoryVaultPDA,
        payer: vendor1.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([vendor1])
      .rpc();
    
    console.log("Vendor registration transaction:", tx);
    
    // Verify vendor profile was created
    const vendorProfile = await vendorProfileProgram.account.vendorProfile.fetch(vendorProfilePDA);
    expect(vendorProfile.owner.toString()).to.equal(vendor1.publicKey.toString());
    expect(vendorProfile.vendorName).to.equal(vendorName);
    expect(vendorProfile.description).to.equal(description);
    
    // Verify factory state updated
    const factoryState = await vendorFactoryProgram.account.factoryState.fetch(factoryStatePDA);
    expect(factoryState.vendorNames).to.include(vendorName);
    expect(factoryState.totalCollectedFees.toString()).to.equal("1000000000");
  });

  it("Fail to register vendor with duplicate name", async () => {
    const vendorName = "TestVendor1"; // Same name as previous test
    const description = "Another vendor with same name";
    
    const [vendorProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vendor-profile"), Buffer.from(vendorName)],
      vendorProfileProgram.programId
    );
    
    try {
      await vendorFactoryProgram.methods
        .registerVendor(vendorName, description)
        .accounts({
          factoryState: factoryStatePDA,
          vendorProfile: vendorProfilePDA,
          factoryVault: factoryVaultPDA,
          payer: vendor2.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([vendor2])
        .rpc();
      
      expect.fail("Should have failed due to duplicate vendor name");
    } catch (error) {
      expect(error.message).to.include("VendorNameTaken");
    }
  });

  it("Update vendor description", async () => {
    const vendorName = "TestVendor1";
    const newDescription = "Updated description for the vendor";
    
    const [vendorProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vendor-profile"), Buffer.from(vendorName)],
      vendorProfileProgram.programId
    );
    
    const tx = await vendorProfileProgram.methods
      .updateDescription(newDescription)
      .accounts({
        vendorProfile: vendorProfilePDA,
        owner: vendor1.publicKey,
      })
      .signers([vendor1])
      .rpc();
    
    console.log("Description update transaction:", tx);
    
    // Verify description was updated
    const vendorProfile = await vendorProfileProgram.account.vendorProfile.fetch(vendorProfilePDA);
    expect(vendorProfile.description).to.equal(newDescription);
  });

  it("Add product to vendor profile", async () => {
    const vendorName = "TestVendor1";
    const productId = "PROD001";
    const price = new anchor.BN(500000000); // 0.5 SOL
    const productDescription = "A test product";
    
    const [vendorProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vendor-profile"), Buffer.from(vendorName)],
      vendorProfileProgram.programId
    );
    
    const tx = await vendorProfileProgram.methods
      .addProduct(productId, price, productDescription)
      .accounts({
        vendorProfile: vendorProfilePDA,
        owner: vendor1.publicKey,
      })
      .signers([vendor1])
      .rpc();
    
    console.log("Add product transaction:", tx);
    
    // Verify product was added
    const vendorProfile = await vendorProfileProgram.account.vendorProfile.fetch(vendorProfilePDA);
    expect(vendorProfile.products).to.have.length(1);
    expect(vendorProfile.products[0].productId).to.equal(productId);
    expect(vendorProfile.products[0].price.toString()).to.equal(price.toString());
    expect(vendorProfile.products[0].description).to.equal(productDescription);
  });

  it("Transfer ownership", async () => {
    const vendorName = "TestVendor1";
    const newOwner = vendor2.publicKey;
    
    const [vendorProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vendor-profile"), Buffer.from(vendorName)],
      vendorProfileProgram.programId
    );
    
    const tx = await vendorProfileProgram.methods
      .transferOwnership(newOwner)
      .accounts({
        vendorProfile: vendorProfilePDA,
        owner: vendor1.publicKey,
      })
      .signers([vendor1])
      .rpc();
    
    console.log("Ownership transfer transaction:", tx);
    
    // Verify ownership was transferred
    const vendorProfile = await vendorProfileProgram.account.vendorProfile.fetch(vendorProfilePDA);
    expect(vendorProfile.owner.toString()).to.equal(newOwner.toString());
  });

  it("Admin updates registration fee", async () => {
    const newFee = new anchor.BN(2000000000); // 2 SOL
    
    const tx = await vendorFactoryProgram.methods
      .updateFee(newFee)
      .accounts({
        factoryState: factoryStatePDA,
        admin: admin.publicKey,
      })
      .rpc();
    
    console.log("Fee update transaction:", tx);
    
    // Verify fee was updated
    const factoryState = await vendorFactoryProgram.account.factoryState.fetch(factoryStatePDA);
    expect(factoryState.registrationFee.toString()).to.equal(newFee.toString());
  });

  it("Admin withdraws fees", async () => {
    const destination = admin.publicKey;
    
    const tx = await vendorFactoryProgram.methods
      .withdrawFees(destination)
      .accounts({
        factoryState: factoryStatePDA,
        factoryVault: factoryVaultPDA,
        destination: destination,
        admin: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("Fee withdrawal transaction:", tx);
    
    // Verify fees were withdrawn
    const factoryState = await vendorFactoryProgram.account.factoryState.fetch(factoryStatePDA);
    expect(factoryState.totalCollectedFees.toString()).to.equal("0");
  });

  it("Admin pauses registration", async () => {
    const tx = await vendorFactoryProgram.methods
      .pauseRegistration(true)
      .accounts({
        factoryState: factoryStatePDA,
        admin: admin.publicKey,
      })
      .rpc();
    
    console.log("Pause registration transaction:", tx);
    
    // Verify registration is paused
    const factoryState = await vendorFactoryProgram.account.factoryState.fetch(factoryStatePDA);
    expect(factoryState.paused).to.be.true;
  });

  it("Fail to register vendor when paused", async () => {
    const vendorName = "TestVendor2";
    const description = "Should fail due to pause";
    
    const [vendorProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vendor-profile"), Buffer.from(vendorName)],
      vendorProfileProgram.programId
    );
    
    try {
      await vendorFactoryProgram.methods
        .registerVendor(vendorName, description)
        .accounts({
          factoryState: factoryStatePDA,
          vendorProfile: vendorProfilePDA,
          factoryVault: factoryVaultPDA,
          payer: vendor2.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([vendor2])
        .rpc();
      
      expect.fail("Should have failed due to paused registration");
    } catch (error) {
      expect(error.message).to.include("RegistrationPaused");
    }
  });
});
