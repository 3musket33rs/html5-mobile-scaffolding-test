
function BookList() {
	this.books = [];
}

BookList.prototype.add = function(listBook) {
	this.books = listBook;
};

BookList.prototype.get = function(index) {
	return this.books[index];
};

//serverUrl = 'http://localhost:8080/html5-mobile-scaffolding-test';
serverUrl = 'http://html5-mobile-scaffolding-test.cloudfoundry.com'	


$('#section-list-books').live('pageinit', function(e) {
	
    // Get domain objects		
	getBooks();
});



function getBooks() {
	$.ajax({
		cache : false,
		type : "GET",
		async : false,
		dataType : "jsonp",
		url : serverUrl + '/book/list',
		success : function(data) {
			if (data) {
				var bookList = new BookList();
				bookList.add(data);
				bookList.renderToHtml();
			}
		},
		error : function(xhr) {
			alert(xhr.responseText);
		}
	});
}

BookList.prototype.renderToHtml = function() {
	var context = this.books;
	for ( var i = 0; i < context.length; i++) {
		var book = context[i];
		addBookOnSection(book);
	}
	$('#list-books').listview('refresh');
	
}


function addBookOnSection (book) {
	var out = '<li><a href="#section-show-book?id='+ book.id + '" data-transition="fade" id="book'; 
	out =  out + book.id + '-in-list">';
	
    out = out + book.title +';';
       
	out = out + '</a></li>';
	
	$("#section-list-books").data('Book_' + book.id, book);
	
	
	$(book).bind("refresh-book" + book.id + "-list", function(bind, newBook) {
		var book = $("#section-list-books").data('Book_' + newBook.id);
		var textDisplay = "";
	    textDisplay = textDisplay + newBook.author +';';
	       textDisplay = textDisplay + newBook.title +';';
	       
		$('#book' + newBook.id + '-in-list').text(textDisplay);
		for(var property in newBook) {
			book[property] = newBook[property];
		}
		
	});
	$("#list-books").append(out);
}


function removeBookOnSection(id) {
	var listID = 'book' + id + '-in-list';
	var link = $("#" + listID);
	link.parents('li').remove();
	var book = $("#section-list-books").data('Book_' + id, book);
	$("#section-list-books").removeData('Book_' + id);
	$(book).unbind();
	$('#list-books').listview('refresh');
	
}

