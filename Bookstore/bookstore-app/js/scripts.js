/*!
 * Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
 */
// Use this file to add JavaScript to your project
const contractAddress = '0x7E4898673Fd4dFA9dc7d377ae42a703d11C387b4' //Update the address later
const contractABI = [ { anonymous: false, inputs: [ { indexed: false, internalType: 'bytes32', name: '', type: 'bytes32' }, { indexed: false, internalType: 'string', name: '', type: 'string' }, { indexed: false, internalType: 'address', name: '', type: 'address' } ], name: 'bookCreated', type: 'event' }, { anonymous: false, inputs: [ { indexed: false, internalType: 'bytes32', name: '', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: '', type: 'uint256' }, { indexed: false, internalType: 'address', name: '', type: 'address' } ], name: 'chapterBought', type: 'event' }, { anonymous: false, inputs: [ { indexed: false, internalType: 'bytes32', name: '', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: '', type: 'uint256' }, { indexed: false, internalType: 'string', name: '', type: 'string' } ], name: 'chapterCreated', type: 'event' }, { inputs: [ { internalType: 'string', name: 'title', type: 'string' } ], name: 'authorBook', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [ { internalType: 'bytes32', name: 'bookID', type: 'bytes32' }, { internalType: 'string', name: 'title', type: 'string' }, { internalType: 'string', name: 'text', type: 'string' }, { internalType: 'uint256', name: 'cost', type: 'uint256' } ], name: 'authorChapter', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [ { internalType: 'bytes32', name: 'bookID', type: 'bytes32' }, { internalType: 'uint256', name: 'chapterID', type: 'uint256' } ], name: 'buyChapter', outputs: [], stateMutability: 'payable', type: 'function' }, { inputs: [ { internalType: 'bytes32', name: 'bookID', type: 'bytes32' } ], name: 'checkIfAuthor', outputs: [ { internalType: 'bool', name: '', type: 'bool' } ], stateMutability: 'view', type: 'function' }, { inputs: [ { internalType: 'bytes32', name: 'bookID', type: 'bytes32' }, { internalType: 'uint256', name: 'chapterID', type: 'uint256' } ], name: 'checkIfChapterOwned', outputs: [ { internalType: 'bool', name: '', type: 'bool' } ], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'getBalance', outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ], stateMutability: 'view', type: 'function' }, { inputs: [ { internalType: 'bytes32', name: 'bookID', type: 'bytes32' } ], name: 'getBookChapters', outputs: [ { components: [ { internalType: 'uint256', name: 'chapterID', type: 'uint256' }, { internalType: 'string', name: 'title', type: 'string' }, { internalType: 'string', name: 'text', type: 'string' }, { internalType: 'uint256', name: 'cost', type: 'uint256' } ], internalType: 'struct Bookstore.Chapter[]', name: '', type: 'tuple[]' } ], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'getBooksAuthored', outputs: [ { components: [ { internalType: 'bytes32', name: 'bookID', type: 'bytes32' }, { internalType: 'string', name: 'title', type: 'string' }, { components: [ { internalType: 'uint256', name: 'chapterID', type: 'uint256' }, { internalType: 'string', name: 'title', type: 'string' }, { internalType: 'string', name: 'text', type: 'string' }, { internalType: 'uint256', name: 'cost', type: 'uint256' } ], internalType: 'struct Bookstore.Chapter[]', name: 'chapters', type: 'tuple[]' }, { internalType: 'address', name: 'author', type: 'address' } ], internalType: 'struct Bookstore.Books[]', name: '', type: 'tuple[]' } ], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'getListOfBooks', outputs: [ { components: [ { internalType: 'bytes32', name: 'bookID', type: 'bytes32' }, { internalType: 'string', name: 'title', type: 'string' }, { components: [ { internalType: 'uint256', name: 'chapterID', type: 'uint256' }, { internalType: 'string', name: 'title', type: 'string' }, { internalType: 'string', name: 'text', type: 'string' }, { internalType: 'uint256', name: 'cost', type: 'uint256' } ], internalType: 'struct Bookstore.Chapter[]', name: 'chapters', type: 'tuple[]' }, { internalType: 'address', name: 'author', type: 'address' } ], internalType: 'struct Bookstore.Books[]', name: '', type: 'tuple[]' } ], stateMutability: 'view', type: 'function' }, { inputs: [ { internalType: 'bytes32', name: 'bookID', type: 'bytes32' }, { internalType: 'uint256', name: 'chapterID', type: 'uint256' } ], name: 'readChapter', outputs: [ { internalType: 'string', name: '', type: 'string' }, { internalType: 'string', name: '', type: 'string' } ], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'withdrawBalance', outputs: [], stateMutability: 'payable', type: 'function' } ]//
//Metamask
//const web3 = new Web3(window.ethereum);
//const counter = new web3.eth.Contract(counterABI, counterAddress);
//counter.setProvider(window.ethereum);
//Ganache
const web3 = new Web3('http://localhost:7545')
const contract = new web3.eth.Contract(contractABI, contractAddress)

//
const writingRow = document.getElementById('writingBooks')
const recentRow = document.getElementById('recentBooks')

const addNewBook = document.getElementById('authorBook')
const addChapter = document.getElementById('weird')




//Runs on load
window.addEventListener('load', async event => {
	//Updates the recent row
	if (writingRow != null) {
		const value = await getAllBooks()
		var counter = 0
		for (const key in value) {
			var bookName = value[key]['title']
			var author = value[key]['author']
			var bookID = value[key]['bookID'] + ''
			var card =
				'<div class="card text-center"> <img class="card-img-top" src="assets/book.png" style="height:100px; display: block; margin-left: auto;  margin-right: auto; width: 50%;"><div class="card-body"><h5 class="card-title"> ' +
				bookName +
				' </h5><p class = "card-text"> Author: <br>' +
				author +
				' </p><a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="populateReadChapter(\'' +
				bookID +
				'\')"> Read Now </a></div></div>'
			recentRow.innerHTML += card
			counter++
			if (counter > 5) {
				break
			}
		}
		//Updates the Books you're writing row
		const value1 = await getBooksAuthored()
		for (const key in value) {
			var bookName = value[key]['title']
			var author = value[key]['author']
			var bookID = value[key]['bookID'] + ''
			var card =
				'<div class="card text-center" id="baseToReplace"> <img class="card-img-top" src="assets/book.png" style="height:100px; display: block; margin-left: auto;  margin-right: auto; width: 50%;"><div class="card-body"><h5 class="card-title"> ' +
				bookName +
				' </h5><p class = "card-text"> Author: <br>' +
				author +
				' </p> <div class ="col"> <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick = "populateReadChapter(\'' +
				bookID +
				'\')"> Read Now </a> <a href="#" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="populateAddNewChapter(\'' + bookID + '\')"> Add Chapter </a> </div></div></div>'
			var temp = writingRow.innerHTML
			writingRow.innerHTML = card
			var tempCard = document.getElementById('baseToReplace')
			tempCard.id = author + bookID
			writingRow.appendChild(tempCard)
			writingRow.innerHTML = writingRow.innerHTML + temp
		}
	}
})

async function getBooksAuthored() {
	const value = await contract.methods.getBooksAuthored().call()
	return value
}

async function getAllBooks() {
	const value = await contract.methods.getListOfBooks().call()
	return value
}

async function populateAddNewBook(x) {
	modalToPopulate = document.getElementById('exampleModal')
	modalToPopulate.innerHTML =
		'<div class="modal-header"> <h5 class="modal-title" id="exampleModalLabel">Create a new Book </h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> </div>'
	modalToPopulate.innerHTML +=
		'<div class="modal-body"> <form> <div class="form-group"> <label for="bookName">Book Name</label> <input type="text" class="form-control" id="bookName" aria-describedby="" placeholder="The Title of your book."> </div> <button type="button" class="btn btn-primary" onclick="createNewBook(this.parentElement.children[0].children[1].value)">Submit</button> <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>  </form> </div>'
}

async function createNewBook(x) {
	const accounts = await web3.eth.getAccounts()
	await contract.methods
		.authorBook(x)
		.send({ from: accounts[0], gas: '1000000' })
	location.reload()
}

async function populateAddNewChapter(x) {
	modalToPopulate = document.getElementById('exampleModal')
	modalToPopulate.innerHTML =
		'<div class="modal-header"> <h5 class="modal-title" id="exampleModalLabel">Add a new chapter </h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> </div>'
	modalToPopulate.innerHTML +=
		'<div class="modal-body"> <form> <div class="form-group"> <label for="bookName">Book ID: </label> <input type="text" class="form-control" id="bookName" aria-describedby="" value="' + x + '" readonly> <label for="bookName">Chapter Title</label> <input type="text" class="form-control" id="bookName" aria-describedby="" placeholder="The Title of your Chapter."> <label for="bookName">Chapter Text</label> <textarea type="text" class="form-control" id="bookName" aria-describedby="" placeholder="The Title of the Chapter."> </textarea> <label for="bookName">Chapter Cost (in Wei) </label> <input type="number" id="replyNumber" min="0" step="1" data-bind="value:replyNumber" /> </div> <button type="button" class="btn btn-primary" onclick="addChapters(this.parentElement.children[0].children[1].value, this.parentElement.children[0].children[3].value, this.parentElement.children[0].children[5].value, this.parentElement.children[0].children[7].value )">Submit</button> </form> </div>'
}


async function addChapters(x, y, z, a) {
	// bookID, title,text, cost
	const accounts = await web3.eth.getAccounts()
	await contract.methods
		.authorChapter(x, y, z, a)
		.send({ from: accounts[0], gas: '1000000' })
	location.reload()
}

async function populateReadChapter(x) {
	modalToPopulate = document.getElementById('exampleModal')
	modalToPopulate.innerHTML =
		'<div class="modal-header"> <h5 class="modal-title" id="exampleModalLabel">Available Chapters for this Book </h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> </div>'
	modalToPopulate.innerHTML +=
		'<div class="modal-body" id="chapterList"> <div class="col"> Chapter 1: Title <button clas="btn-primary"> Read </button> Cost </div> </div>'
	chapterList = document.getElementById('chapterList')
	chapterList.innerHTML = ''
	const value = await getAllChaptersOfABook(x)
	for (const key in value) {
		chapterNumber = value[key]['chapterID']
		owned = await chapterOwned(x, 0)
		cost = value[key]['cost']
		read = 'Read'
		clickVar = ''
		if (!owned && cost > 0) {
			btnClass = 'btn-danger'
			read = 'Buy'
			clickVar = 'buyAChapter(' + x + ',' + chapterNumber + ')'
		} else {
			btnClass = 'btn-info'
			cost = 'Free / Already Owned'
			clickVar = 'getSpecificChapterText(\'' + x + '\',' + chapterNumber + ')'
		}
		title = value[key]['title']

		chapterList.innerHTML += '<div class="col"> Chapter ' + chapterNumber + ': ' + title + ' <button class="' + btnClass + '" onclick="' + clickVar + '" id="liveAlertBtn"> ' + read + ' </button> Cost: ' + cost + ' </div>'
		chapterList.innerHTML += '<div id="chapter' + chapterNumber + '"> </div>'
	}
}

async function getAllChaptersOfABook(x) {
	const value = await contract.methods.getBookChapters(x).call()
	return value
}

async function getSpecificChapterText(x, y) {
	const accounts = await web3.eth.getAccounts()
	const value = await contract.methods.readChapter(x, y).call({ from: accounts[0] })
	const alertAppend = document.getElementById('chapter'+y);
	alertAppend.innerHTML = '<div class="alert alert-dark alert-dismissible" role="alert"> <h4 class="alert-heading">'+value[0]+'</h4> <hr> <div>'+value[1]+'</div> <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">X</button> </div> ';
}

async function buyAChapter(x, y) {
	const accounts = await web3.eth.getAccounts()
	await contract.methods
		.buyChapter(x, y)
		.send({ from: accounts[0], gas: '1000000' })
	location.reload()
}

async function chapterOwned(x, y) {
	const accounts = await web3.eth.getAccounts()
	const value = await contract.methods
		.checkIfChapterOwned(x, y)
		.call({ from: accounts[0] })
	return value
}
