const Bookstore = artifacts.require('../contracts/Bookstore.sol')
const truffleAssert = require('truffle-assertions');

//
// Mocha is the testing framework (it, describe, beforeEach)
// Chai is the assertion library used
// truffle-assertion is used to check the reverts by the contract
//
// describe() are:
// - commonly known as test suites, which contains test cases
// - merely groups, and you can have groups within groups
//
// it() is a test case
//
// beforeEach() is a hooks that runs before each it() or describe().
//
// Async and Await are extensions of promises
// An async function can contain an await expression that pauses the execution of
// the async function and waits for the passed Promise's resolution, and then
// resumes the async function's execution and returns the resolved value.
// Remember, the await keyword is only valid inside async functions.
//
// Good links to understand Async Await and event proposal -
// - https://hackernoon.com/understanding-async-await-in-javascript-1d81bb079b2c
// - https://www.youtube.com/watch?v=XzXIMZMN9k4
//

contract('Bookstore', function (accounts) {
  let counter
  const success = '0x01'

  beforeEach('Setup contract for each test', async function () {
    bookstore = await Bookstore.new()
  })

  
    //Test to see if the contract works
  describe('General Usecase', function() {
    it('Accounts[0] authors a book', async function () {
      //Accounts[0] authors a book
      let result = await bookstore.authorBook("1", {from: accounts[0], gas: 1000000})
      assert.equal(result.receipt.status, success)
    });

    it('Accounts[0] authors a chapter for book 1.', async function(){
        //Accounts[0] authors a book
        await bookstore.authorBook("1", {from: accounts[0], gas: 1000000})
        //Accounts[0] authors a chapter
        let bookID = await bookstore.getListOfBooks({from: accounts[0]})
        let result = await bookstore.authorChapter(bookID[0][0], "Chapter Uno", "Chapter Text", 1000000, { from: accounts[0]})
        assert.equal(result.receipt.status, success)  
    });

    it('Accounts[1] buys chapter 1 of book 1 and reads it', async function(){
        //Accounts[0] authors a book
        await bookstore.authorBook("1", {from: accounts[0], gas: 1000000})
        //Accounts[0] authors a chapter
        let bookID = await bookstore.getListOfBooks({from: accounts[1]})
        await bookstore.authorChapter(bookID[0][0], "Chapter Uno", "Chapter Text", 1000000, { from: accounts[0]})
        //
        await bookstore.buyChapter(bookID[0][0], 0, {from: accounts[1], value: 1000000})
        let result = await bookstore.readChapter(bookID[0][0], 0, {from: accounts[1]});
        assert.equal(result[1], "Chapter Text");
    });

    it('Accounts[0] retrieves their balance', async function(){
        let result = await bookstore.withdrawBalance({ from: accounts[0]})
        assert.equal(result.receipt.status, success)
    })
    ///
    // it('Accounts[0] authors a chapter for book 1.', async function () {
    //   //Does not allow account 1 to register account 2
    //   await truffleAssert.reverts(
    //     ballot.register(accounts[2], { from: accounts[1]}),
    //     truffleAssert.ErrorType.REVERT,
    //     onlyChairpersonError
    //   )
    // });

    // it('Failure on registration of voters in invalid phase.', async function () {
    //   // We change the ballot's state to 2 and 3 and verify that registration is not permitted.
    //   // vote phase is 2
    //   // done phase is 3
    //   var phase = [2, 3];
    //   for (i of phase) {
    //     await ballot.changeState(i)
    //     await truffleAssert.reverts(
    //       ballot.register(accounts[1], { from: accounts[0]}),
    //       truffleAssert.ErrorType.REVERT,
    //       validPhaseError,
    //       validPhaseError
    //     )
    //   }
    // });
  });
})
