/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  if (!Array.isArray(candidates)) candidates = [];
  const votes = {};
  const registeredVoters = new Set();

  return {
    registerVoter(voter) {
      if (
        !voter ||
        typeof voter.id !== "string" ||
        typeof voter.name !== "string" ||
        typeof voter.age !== "number" ||
        voter.age < 18 ||
        registeredVoters.has(voter.id)
      ) {
        return false;
      }
      registeredVoters.add(voter.id);
      return true;
    },
    castVote(voterId, candidateId, onSuccess, onError) {
      if (typeof onSuccess !== "function" || typeof onError !== "function") {
        throw new Error("Callbacks must be functions");
      }
      if (!registeredVoters.has(voterId)) {
        return onError("Voter not registered");
      }
      if (!candidates.some((c) => c.id === candidateId)) {
        return onError("Candidate not found");
      }
      if (votes[voterId]) {
        return onError("Voter has already voted");
      }
      votes[voterId] = candidateId;
      return onSuccess({ voterId, candidateId });
    },
    getResults(sortFn) {
      const tally = {};
      for (const candidate of candidates) {
        tally[candidate.id] = 0;
      }
      for (const candidateId of Object.values(votes)) {
        if (tally[candidateId] !== undefined) {
          tally[candidateId]++;
        }
      }
      let results = candidates.map((c) => ({
        id: c.id,
        name: c.name,
        party: c.party,
        votes: tally[c.id] || 0,
      }));
      if (typeof sortFn === "function") {
        results.sort(sortFn);
      } else {
        results.sort((a, b) => b.votes - a.votes);
      }
      return results;
    },
    getWinner() {
      const results = this.getResults();
      if (results.length === 0 || results[0].votes === 0) return null;
      return results[0];
    },
  };
}

export function createVoteValidator(rules) {
  const { minAge = 18, requiredFields = [] } = rules || {};
  return function validateVoter(voter) {
    if (typeof voter !== "object" || voter === null) {
      return { valid: false, reason: "Invalid voter object" };
    }
    for (const field of requiredFields) {
      if (!(field in voter)) {
        return { valid: false, reason: `Missing required field: ${field}` };
      }
    }
    if (typeof voter.age !== "number" || voter.age < minAge) {
      return {
        valid: false,
        reason: `Voter must be at least ${minAge} years old`,
      };
    }
    return { valid: true, reason: "" };
  };
}

export function countVotesInRegions(regionTree) {
  if (typeof regionTree !== "object" || regionTree === null) return 0;
  const { votes = 0, subRegions = [] } = regionTree;
  let totalVotes = votes;
  for (const subRegion of subRegions) {
    totalVotes += countVotesInRegions(subRegion);
  }
  return totalVotes;
}

export function tallyPure(currentTally, candidateId) {
  if (typeof currentTally !== "object" || currentTally === null) {
    currentTally = {};
  }
  return {
    ...currentTally,
    [candidateId]: (currentTally[candidateId] || 0) + 1,
  };
}
