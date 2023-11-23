// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0;

contract Bookstore{
    //Structures
    struct ownedItem {
        bytes32 [] bookAuthorship; //Stores the book ids of authored books
        mapping (bytes32 => uint[]) unlockedChapters; //Unlocked Chapters for Book A
        bool isAdmin;
        uint balance; //Balance in wei, convert to ether
    }

    struct Chapter{
        uint chapterID; //unique to book
        string title; //
        string text; //Temporary, replace later as it is public to everyone
        uint cost;
    }

    struct Books{
        bytes32 bookID;
        string title;   //Temporary, remove strings, bookID is enough
        Chapter [] chapters;
        address author;
    }

    //State Variables
    mapping (address => ownedItem) accountOwnership;
    address payable owner;
    mapping (bytes32 => Books) mapOfBooks;
    bytes32 [] listOfBookIDs;

    //Events
    event bookCreated(bytes32, string, address); //ID, Title, Author
    event chapterCreated(bytes32, uint, string); //BookID, ChapterID, Title
    event chapterBought(bytes32, uint, address); //BookID, ChapterID, address of buyer
    //Modifiers
    modifier isOwner(){
        require(msg.sender == owner);
        _;
    }

    modifier isAdmin(){
        require( accountOwnership[msg.sender].isAdmin == true);
        _;
    }
    // Functions
    //Checks if the msg.sender is the author of an inputted book ID
    function checkIfAuthor(bytes32 bookID) public view  returns(bool){
        for (uint i = 0; i < accountOwnership[msg.sender].bookAuthorship.length; i++){
            if(accountOwnership[msg.sender].bookAuthorship[i] == bookID){
                return true;
            }
        }
        return false;
    }
    
    //Checks if the msg.sender owns a requested chapter
    function checkIfChapterOwned(bytes32 bookID, uint chapterID) public view returns(bool){
        //accountOwnership[msg.sender].unlockedChapters[bookID];   //gives me the array of unlocked chapters
        for(uint i = 0; i < accountOwnership[msg.sender].unlockedChapters[bookID].length; i++){
            if(accountOwnership[msg.sender].unlockedChapters[bookID][i] == chapterID){
                return true;
            }
        }
        return false;
    }
    
    //An author adds a Book
    function authorBook(string memory title) public {
        bytes32 result = keccak256(abi.encode(msg.sender, title));
        //Require that the book doesn't already exist (unique to writer, multiple writers can have the same titles for their books)
        require(checkIfAuthor(result) ==  false);
        //
        Books storage newBook = mapOfBooks[result];
        newBook.bookID = result;
        newBook.title = title;
    //    mapOfBooks[result] = newBook;
        accountOwnership[msg.sender].bookAuthorship.push(result);
        listOfBookIDs.push(result);
        mapOfBooks[result].author = msg.sender;
        emit bookCreated(newBook.bookID, title, msg.sender);
    }

    //An author adds a chapter to a specified book
    function authorChapter(bytes32 bookID, string memory title, string memory text, uint cost) public{
        require(checkIfAuthor(bookID) == true);
        Chapter memory newChapter;
        newChapter.title = title;
        newChapter.text =  text;
        newChapter.cost = cost;
        newChapter.chapterID = mapOfBooks[bookID].chapters.length;
        mapOfBooks[bookID].chapters.push(newChapter);
        accountOwnership[msg.sender].unlockedChapters[bookID].push(newChapter.chapterID);
        emit chapterCreated(bookID, newChapter.chapterID, title);
    }

    //A reader buys a chapter to a book
    function buyChapter(bytes32 bookID, uint chapterID) public payable{
        //Checks if the chapter actually exists
        Chapter memory chapter = mapOfBooks[bookID].chapters[chapterID];
        require(msg.value >= chapter.cost, "Not enough moolah");
        //Make sure the chapter isn't already owned
        require(checkIfChapterOwned(bookID, chapterID) == false, "You already own the chapter!");
        //
        accountOwnership[mapOfBooks[bookID].author].balance += chapter.cost;
        accountOwnership[msg.sender].unlockedChapters[bookID].push(chapterID);
        emit chapterBought(bookID, chapterID, msg.sender);
    }
    
    //An author decides to withdraw their balance.
    function withdrawBalance() public payable {
        uint bal = accountOwnership[msg.sender].balance;
        accountOwnership[msg.sender].balance = 0;
        payable(msg.sender).transfer(bal);
    }

    //Getter functions
    function getBookChapters(bytes32 bookID) public view returns(Chapter[] memory){
        return mapOfBooks[bookID].chapters;
    }


    function readChapter(bytes32 bookID, uint chapterID) public view returns(string memory, string memory) {
        require(checkIfChapterOwned(bookID, chapterID));
        Chapter memory chapter = mapOfBooks[bookID].chapters[chapterID];
        return(chapter.title, chapter.text);
    }

    function getBooksAuthored() public view returns (Books [] memory){
        bytes32 [] memory arrayOfOwnedBooks = accountOwnership[msg.sender].bookAuthorship;
        Books [] memory bookArray = new Books[](arrayOfOwnedBooks.length);
        for(uint i = 0; i < arrayOfOwnedBooks.length; i++){
            bookArray[i] = (mapOfBooks[arrayOfOwnedBooks[i]]);
        }
        return bookArray;
    }
    
    function getBalance () public view returns(uint){
        return accountOwnership[msg.sender].balance;
    }
    //Get all of the books ever written
    function getListOfBooks() public view returns (Books[] memory){
        Books[] memory bookArray = new Books[](listOfBookIDs.length);
        for(uint i = 0; i < listOfBookIDs.length; i++){
            bookArray[i] = mapOfBooks[listOfBookIDs[i]];
        }
        return bookArray;
    }    
}