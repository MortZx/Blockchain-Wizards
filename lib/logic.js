/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.blockwiz.voting.SubmitVote} SubmitVote
 * @transaction
 */
function SubmitVote(vote) 
{
    // get User ID
    var user = vote.user
    
    // get Candidate for whom User is voting for
    var candidate = vote.candidate

    // check if User already voted
    if (user.hasVoted)
    {
        throw new Error('User has already voted.');
    }
    

    // if User hasn't already voted, update the number of votes accordingly
    candidate.totalVotes += 1;

    // get candidate asset, FullyQualifiedIdentifier: org.blockwiz.voting.Candidate
    return getAssetRegistry('org.blockwiz.voting.Candidate').then(function(CandidateRegistry)
    {
        // get User participant, FullyQualifiedIdentifier: org.blockwiz.voting.User
        getParticipantRegistry('org.blockwiz.voting.User').then(function(getParticipantRegistry)
        {
            // edit User info
            user.hasVoted = true;

            // update User info
            return participantRegistry.update(user);
        }).catch(funcion(error) 
        ,{      // !!! The ',' shows up as an error if it is not there but does this make sens? !!!!
            // add error handling function here
        });
    // update Candidate registry
    return CandidateRegistry.update(candidate);
    });
}