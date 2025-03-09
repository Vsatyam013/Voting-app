import { ethers } from "ethers";
import { VotingABI, VoteTokenABI, votingContractAddress, voteTokenAddress } from "../utils/constants.js";

export class Integration {
  constructor(setConnected, setCandidates, setUserTokens, setSelectedAccount, setLoading, setError) {
    this.setConnected = setConnected;
    this.setCandidates = setCandidates;
    this.setUserTokens = setUserTokens;
    this.setSelectedAccount = setSelectedAccount;
    this.setLoading = setLoading;
    this.setError = setError;
    this.provider = null;
    this.signer = null;
    this.votingContract = null;
    this.voteTokenContract = null;
    this.selectedAccount = null;

    // 🔹 Bind methods to the instance
    this.connectWallet = this.connectWallet.bind(this);
    this.loadCandidates = this.loadCandidates.bind(this);
    this.loadUserTokens = this.loadUserTokens.bind(this);
    this.claimTokens = this.claimTokens.bind(this);
    this.registerCandidate = this.registerCandidate.bind(this);
    this.castVote = this.castVote.bind(this);
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
  }

  async connectWallet() {
    this.setLoading(true);
    this.setError(null);
  
    if (!window.ethereum) {
      this.setError("MetaMask extension not found. Please install MetaMask.");
      this.setLoading(false);
      return;
    }
  
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  
      if (accounts.length === 0) {
        this.setError("No accounts found in MetaMask.");
        this.setLoading(false);
        return;
      }
  
      this.selectedAccount = accounts[0];
  
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner(this.selectedAccount);
  
      console.log("Initializing contracts...");
      console.log("Signer:", this.signer);
  
      // Initialize contracts
      this.votingContract = new ethers.Contract(votingContractAddress, VotingABI, this.signer);
      this.voteTokenContract = new ethers.Contract(voteTokenAddress, VoteTokenABI, this.signer);
  
      console.log("VoteToken Contract:", this.voteTokenContract);
      console.log("Voting Contract:", this.votingContract);
  
      this.setConnected(true);
      this.setSelectedAccount(this.selectedAccount);
  
      await this.loadCandidates();
      await this.loadUserTokens();
  
      window.ethereum.on("accountsChanged", this.handleAccountsChanged);
      window.ethereum.on("chainChanged", () => window.location.reload());
  
    } catch (error) {
      console.error("Error connecting wallet:", error);
      this.setError("Failed to connect wallet. Please try again.");
    } finally {
      this.setLoading(false);
    }
  }
  

  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      this.setConnected(false);
      this.setSelectedAccount(null);
    } else if (accounts[0] !== this.selectedAccount) {
      this.selectedAccount = accounts[0];
      this.signer = this.provider.getSigner(this.selectedAccount);
      this.votingContract = this.votingContract.connect(this.signer);
      this.voteTokenContract = this.voteTokenContract.connect(this.signer);
      this.setSelectedAccount(this.selectedAccount);
      this.loadUserTokens();
    }
  }

  async loadCandidates() {
    try {
      this.setLoading(true);
      const candidates = await this.votingContract.getAllCandidates();
      this.setCandidates(candidates);
    } catch (error) {
      console.error("Error loading candidates:", error);
      this.setError("Failed to load candidates. Please try again.");
    } finally {
      this.setLoading(false);
    }
  }

  async loadUserTokens() {
    try {
      this.setLoading(true);
      const balance = await this.voteTokenContract.balanceOf(this.selectedAccount);
      this.setUserTokens(balance);
    } catch (error) {
      console.error("Error loading user tokens:", error);
      this.setError("Failed to load your token balance. Please try again.");
    } finally {
      this.setLoading(false);
    }
  }

  async claimTokens(amount) {
    try {
      this.setLoading(true);
      console.log("Attempting to claim tokens:", amount.toString());
      console.log("VoteToken Contract Instance:", this.voteTokenContract);

      if (!this.voteTokenContract) {
        throw new Error("VoteToken contract is not initialized.");
      }

      await this.voteTokenContract.claimTokens(amount);
      await this.loadUserTokens();
    } catch (error) {
      console.error("Error claiming tokens:", error);
      this.setError(error.message || "Failed to claim tokens. Please try again.");
    } finally {
      this.setLoading(false);
    }
}

  async registerCandidate(name) {
    try {
      this.setLoading(true);
      await this.votingContract.registerAsCandidate(name);
      await this.loadCandidates();
      await this.loadUserTokens();
    } catch (error) {
      console.error("Error registering candidate:", error);
      this.setError("Failed to register as candidate. Please try again.");
    } finally {
      this.setLoading(false);
    }
  }

  async castVote(candidateAddress) {
    try {
      this.setLoading(true);
      await this.votingContract.vote(candidateAddress);
      await this.loadCandidates();
      await this.loadUserTokens();
    } catch (error) {
      console.error("Error casting vote:", error);
      this.setError("Failed to cast vote. Please try again.");
    } finally {
      this.setLoading(false);
    }
  }
}

export default Integration;
