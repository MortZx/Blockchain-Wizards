/**
 * Votechain script
 *
 * Author: Luke Powlett <l.j.powlett1@newcastle.ac.uk>
 */

/* global getAssetRegistry getFactory emit */

/**
 * Submit vote
 * @param {blockchain.wizards.votechain.Vote} vote The vote to be submitted.
 * @transaction
 */

async function Vote(vote) {
  
    // Don't allow a used ballot to be processed
    if(vote.ballot.used) {
        return new Error(["Ballot Already Used!"]);
    } else if(vote.ballot.owner.hasVoted) {
        return new Error(["User already voted!"]);
    }

    vote.ballot.owner.hasVoted = true;
  
    // Set new owner of vote
    vote.ballot.owner = vote.newOwner;

    // Mark ballot as used
    vote.ballot.used = true;
  
    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('blockchain.wizards.votechain.Ballot');
  
    // Update the asset in the asset registry.
    await assetRegistry.update(vote.ballot);
}
