# sFriend.tech

This project is a clone of friend.tech build using stacks. 

# Video Demo

link: https://youtu.be/INeiKFHWJpc?si=AUcngvN7NmrdHL9j

<img width="1440" alt="Screenshot 2023-12-05 at 4 37 41 PM" src="https://github.com/Aman-zishan/friend.tech/assets/55238388/8cdc883d-c20b-4038-a832-19d6c4495349">

## Getting Started

To get the application running, follow these steps:

1. Clone the repository: `git clone https://github.com/Aman-zishan/friend.tech.git`
2. Navigate into the directory: `cd friend.tech`
3. Install the dependencies: `yarn install`
4. Start the frontend development server: `yarn dev`
5. Open a new terminal session
6. Install the dependencies for the chat server: `cd server && yarn install`
7. Start the chat server: `yarn start`
8. Open the application in your browser: `http://localhost:5173/`


## Setup

Before getting into testing the application you need to spin up the devnet. This applications uses devnet to interact with the smart contract. To spin up the devnet, follow these steps:

In a new terminal session run the command:

1. `clarinet integrate`
2. Once the devnet is up and running, import wallets to different browser accounts
3. For testing we'll be using chrome user 1 as subject 1 and chrome user 2 as holder of this subject
4. Import deployer wallet, go to `settings/Devnet.toml` and copy the mnemonic of the deployer account
5. Similarly import the mnemonic of any other wallet to be the holder


## Testing

To run the contract tests, simply run `yarn test` from the root directory. This will run the tests in the `tests` directory.


## Demo

1. Create a new account in the imported deployer wallet
   
2.  set the protocol fee destination to the newly created account (only deployer can set the protocol fee destination) by calling `set-protocol-fee-destination` function from the deployed keys contract via stacks explorer sandbox

3. Connect the deployer wallet to the application
   
4. The application will check if you have already bought the first key, if not then it will ask you to buy the first key (first key is free and allows the subject to create a profile)
   
5. Now you are redirected to the profile page, where you can trade keys

6. Now connect the holder wallet to the application in another browser 

7. repeat the process of buying the first key




