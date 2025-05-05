//SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract VoteSphere {
    // Poll counter
    uint256 private _pollIdCounter;
    
    struct Poll {
        uint256 id;
        string title;
        string description;
        string imageUrl;
        uint256 startTime;
        uint256 endTime;
        address organizer;
        bool isActive;
        mapping(uint256 => Candidate) candidates;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) voterChoice;
        uint256 candidateCount;
        uint256 totalVotes;
    }
    
    struct Candidate {
        uint256 id;
        string name;
        string description;
        string imageUrl;
        uint256 voteCount;
        bool exists;
    }
    
    // Poll storage
    mapping(uint256 => Poll) private _polls;
    
    // Events
    event PollCreated(uint256 indexed pollId, address indexed organizer);
    event CandidateAdded(uint256 indexed pollId, uint256 indexed candidateId, string name);
    event VoteCast(uint256 indexed pollId, uint256 indexed candidateId, address voter);
    
    // Create a new poll
    function createPoll(
        string memory title,
        string memory description,
        string memory imageUrl,
        uint256 startTime,
        uint256 endTime
    ) public returns (uint256) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(imageUrl).length > 0, "Image URL cannot be empty");
        require(endTime > startTime, "End time must be after start time");
        require(startTime > block.timestamp, "Start time must be in the future");
        
        _pollIdCounter++;
        uint256 pollId = _pollIdCounter;
        
        Poll storage newPoll = _polls[pollId];
        newPoll.id = pollId;
        newPoll.title = title;
        newPoll.description = description;
        newPoll.imageUrl = imageUrl;
        newPoll.startTime = startTime;
        newPoll.endTime = endTime;
        newPoll.organizer = msg.sender;
        newPoll.isActive = true;
        
        emit PollCreated(pollId, msg.sender);
        return pollId;
    }
    
    // Add a candidate to a poll
    function addCandidate(
        uint256 pollId,
        string memory name,
        string memory description,
        string memory imageUrl
    ) public returns (uint256) {
        Poll storage poll = _polls[pollId];
        
        require(poll.id == pollId, "Poll does not exist");
        require(poll.startTime > block.timestamp, "Poll has already started");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(imageUrl).length > 0, "Image URL cannot be empty");
        
        poll.candidateCount++;
        uint256 candidateId = poll.candidateCount;
        
        Candidate storage newCandidate = poll.candidates[candidateId];
        newCandidate.id = candidateId;
        newCandidate.name = name;
        newCandidate.description = description;
        newCandidate.imageUrl = imageUrl;
        newCandidate.exists = true;
        
        emit CandidateAdded(pollId, candidateId, name);
        return candidateId;
    }
    
    // Cast a vote
    function vote(uint256 pollId, uint256 candidateId) public {
        Poll storage poll = _polls[pollId];
        
        require(poll.id == pollId, "Poll does not exist");
        require(poll.isActive, "Poll is not active");
        require(block.timestamp >= poll.startTime, "Poll has not started yet");
        require(block.timestamp <= poll.endTime, "Poll has ended");
        require(!poll.hasVoted[msg.sender], "Already voted in this poll");
        require(poll.candidates[candidateId].exists, "Candidate does not exist");
        
        poll.hasVoted[msg.sender] = true;
        poll.voterChoice[msg.sender] = candidateId;
        poll.candidates[candidateId].voteCount++;
        poll.totalVotes++;
        
        emit VoteCast(pollId, candidateId, msg.sender);
    }
    
    // Get poll details
    function getPollDetails(uint256 pollId) public view returns (
        uint256 id,
        string memory title,
        string memory description,
        string memory imageUrl,
        uint256 startTime,
        uint256 endTime,
        address organizer,
        bool isActive,
        uint256 candidateCount,
        uint256 totalVotes
    ) {
        Poll storage poll = _polls[pollId];
        require(poll.id == pollId, "Poll does not exist");
        
        return (
            poll.id,
            poll.title,
            poll.description,
            poll.imageUrl,
            poll.startTime,
            poll.endTime,
            poll.organizer,
            poll.isActive,
            poll.candidateCount,
            poll.totalVotes
        );
    }
    
    // Get candidate details
    function getCandidateDetails(uint256 pollId, uint256 candidateId) public view returns (
        uint256 id,
        string memory name,
        string memory description,
        string memory imageUrl,
        uint256 voteCount
    ) {
        Poll storage poll = _polls[pollId];
        require(poll.id == pollId, "Poll does not exist");
        require(poll.candidates[candidateId].exists, "Candidate does not exist");
        
        Candidate storage candidate = poll.candidates[candidateId];
        return (
            candidate.id,
            candidate.name,
            candidate.description,
            candidate.imageUrl,
            candidate.voteCount
        );
    }
    
    // Check if a user has voted in a poll
    function hasVoted(uint256 pollId, address voter) public view returns (bool) {
        Poll storage poll = _polls[pollId];
        require(poll.id == pollId, "Poll does not exist");
        
        return poll.hasVoted[voter];
    }
    
    // End a poll early (only organizer)
    function endPoll(uint256 pollId) public {
        Poll storage poll = _polls[pollId];
        
        require(poll.id == pollId, "Poll does not exist");
        require(poll.organizer == msg.sender, "Only organizer can end poll");
        require(poll.isActive, "Poll is already inactive");
        
        poll.isActive = false;
    }
    
    // Get polls created by a specific address
    function getPollsByOrganizer(address organizer) public view returns (uint256[] memory) {
        uint256 count = 0;
        
        // First, count how many polls were created by this organizer
        for (uint256 i = 1; i <= _pollIdCounter; i++) {
            if (_polls[i].organizer == organizer && _polls[i].id > 0) {
                count++;
            }
        }
        
        // Create an array of the right size
        uint256[] memory pollIds = new uint256[](count);
        
        // Fill the array with poll IDs
        uint256 index = 0;
        for (uint256 i = 1; i <= _pollIdCounter; i++) {
            if (_polls[i].organizer == organizer && _polls[i].id > 0) {
                pollIds[index] = i;
                index++;
            }
        }
        
        return pollIds;
    }
    
    // Get polls where a specific address has voted
    function getPollsVotedByAddress(address voter) public view returns (uint256[] memory) {
        uint256 count = 0;
        
        // First, count how many polls this address has voted in
        for (uint256 i = 1; i <= _pollIdCounter; i++) {
            if (_polls[i].id > 0 && _polls[i].hasVoted[voter]) {
                count++;
            }
        }
        
        // Create an array of the right size
        uint256[] memory pollIds = new uint256[](count);
        
        // Fill the array with poll IDs
        uint256 index = 0;
        for (uint256 i = 1; i <= _pollIdCounter; i++) {
            if (_polls[i].id > 0 && _polls[i].hasVoted[voter]) {
                pollIds[index] = i;
                index++;
            }
        }
        
        return pollIds;
    }
    
    // Get multiple polls by their IDs
    function getPollsByIds(uint256[] memory pollIds) public view returns (
        uint256[] memory ids,
        string[] memory titles,
        string[] memory descriptions,
        string[] memory imageUrls,
        uint256[] memory startTimes,
        uint256[] memory endTimes,
        address[] memory organizers,
        bool[] memory isActives,
        uint256[] memory candidateCounts,
        uint256[] memory totalVotes
    ) {
        uint256 length = pollIds.length;
        
        ids = new uint256[](length);
        titles = new string[](length);
        descriptions = new string[](length);
        imageUrls = new string[](length);
        startTimes = new uint256[](length);
        endTimes = new uint256[](length);
        organizers = new address[](length);
        isActives = new bool[](length);
        candidateCounts = new uint256[](length);
        totalVotes = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            uint256 pollId = pollIds[i];
            Poll storage poll = _polls[pollId];
            
            // Skip non-existent polls
            if (poll.id == 0) continue;
            
            ids[i] = poll.id;
            titles[i] = poll.title;
            descriptions[i] = poll.description;
            imageUrls[i] = poll.imageUrl;
            startTimes[i] = poll.startTime;
            endTimes[i] = poll.endTime;
            organizers[i] = poll.organizer;
            isActives[i] = poll.isActive;
            candidateCounts[i] = poll.candidateCount;
            totalVotes[i] = poll.totalVotes;
        }
        
        return (ids, titles, descriptions, imageUrls, startTimes, endTimes, organizers, isActives, candidateCounts, totalVotes);
    }
    
    // Get all polls with complete information
    function getAllPolls() public view returns (
        uint256[] memory ids,
        string[] memory titles,
        string[] memory descriptions,
        string[] memory imageUrls,
        uint256[] memory startTimes,
        uint256[] memory endTimes,
        address[] memory organizers,
        bool[] memory isActives,
        uint256[] memory candidateCounts,
        uint256[] memory totalVotes
    ) {
        uint256[] memory pollIds = new uint256[](_pollIdCounter);
        uint256 validCount = 0;
        
        // Get all valid poll IDs
        for (uint256 i = 1; i <= _pollIdCounter; i++) {
            if (_polls[i].id > 0) {
                pollIds[validCount] = i;
                validCount++;
            }
        }
        
        // Resize array to actual count and get poll details
        assembly {
            mstore(pollIds, validCount)
        }
        
        return getPollsByIds(pollIds);
    }
    
    // Get all candidates for a specific poll
    function getAllCandidates(uint256 pollId) public view returns (
        uint256[] memory ids,
        string[] memory names,
        string[] memory descriptions,
        string[] memory imageUrls,
        uint256[] memory voteCounts
    ) {
        Poll storage poll = _polls[pollId];
        require(poll.id == pollId, "Poll does not exist");
        
        uint256 count = poll.candidateCount;
        
        ids = new uint256[](count);
        names = new string[](count);
        descriptions = new string[](count);
        imageUrls = new string[](count);
        voteCounts = new uint256[](count);
        
        for (uint256 i = 1; i <= count; i++) {
            Candidate storage candidate = poll.candidates[i];
            if (candidate.exists) {
                ids[i-1] = candidate.id;
                names[i-1] = candidate.name;
                descriptions[i-1] = candidate.description;
                imageUrls[i-1] = candidate.imageUrl;
                voteCounts[i-1] = candidate.voteCount;
            }
        }
        
        return (ids, names, descriptions, imageUrls, voteCounts);
    }
}