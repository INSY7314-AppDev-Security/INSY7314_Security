// This is our temporary "database" for Part 1
// We store users in a simple array in memory

const users = [];

// Function to find a user by email
function findUserByEmail(email) {
  return users.find(user => user.email === email);
}

// Function to add a new user
function addUser(user) {
  users.push(user);
  return user;
}

// Function to get all users 
function getAllUsers() {
  return users;
}

module.exports = {
  users,
  findUserByEmail,
  addUser,
  getAllUsers
};

//Plain English Breakdown for clarity
/*
users = [] is like an empty list where we will keep every registered person.
findUserByEmail looks through the list to see if an email already exists.
addUser puts a new person into the list.
module.exports makes these tools available to other files.
*/