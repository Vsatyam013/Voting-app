import React, { useState } from "react";
import {ethers} from "ethers"
import  Integration  from "../context/integration";

const Welcome = () => {
  const [connected, setConnected] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [voting, setVoting] = useState(false);
  const [name, setName] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [userTokens, setUserTokens] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize blockchain integration
  const integration = new Integration(
    setConnected,
    setCandidates,
    setUserTokens,
    setSelectedAccount,
    setLoading,
    setError
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 relative top-[-50px]">
      {/* Error Message */}
      {error && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      )}

      {/* Connect Button */}
      {!connected && (
        <button
          onClick={integration.connectWallet}
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition mt-[-70px]"
        >
          Connect Wallet
        </button>
      )}

      {/* Display connected account */}
      {connected && selectedAccount && (
        <div className="text-white text-center">
          Connected: {selectedAccount.substring(0, 6)}...{selectedAccount.substring(selectedAccount.length - 4)}
        </div>
      )}

      {/* Mint Buttons (Shown After Connecting) */}
      {connected && (
        <div className="space-y-4">
          <div className="flex space-x-4">
            <button
              onClick={() => integration.claimTokens(100 * 10**18)}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition"
            >
              Claim 100 Tokens
            </button>
            <button
              onClick={() => integration.claimTokens(1 * 10**18)}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition"
            >
              Claim 1 Token
            </button>
          </div>

          {/* Register as Candidate Button */}
          <button
            onClick={() => setRegistering(!registering)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition w-full"
          >
            Register as Candidate
          </button>

          {/* Registration Form */}
          {registering && (
            <div className="flex flex-col items-center space-y-4 w-full">
              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full bg-black text-white"
              />
              <button
                onClick={() => integration.registerCandidate(name)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition w-full"
              >
                Register
              </button>
            </div>
          )}

          {/* Vote Button */}
          <button
            onClick={() => setVoting(!voting)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition w-full"
          >
            Vote
          </button>

          {/* Candidate List with Vote Button */}
          {voting && (
            <div className="w-full space-y-2 mt-4">
              {candidates.map((candidate, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-800 text-white px-4 py-2 rounded-lg"
                >
                  <span>{candidate.name}</span>
                  <button
                    onClick={() => integration.castVote(candidate.address)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Vote
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Display User Tokens */}
          <div className="text-white">
            Your Tokens: {ethers.formatUnits(userTokens, 18)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;