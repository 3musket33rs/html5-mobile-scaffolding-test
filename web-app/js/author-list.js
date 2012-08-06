
function AuthorList() {
	this.authors = [];
}

AuthorList.prototype.add = function(listAuthor) {
	this.authors = listAuthor;
};

AuthorList.prototype.get = function(index) {
	return this.authors[index];
};

serverUrl = 'http://localhost:8080/html5-mobile-scaffolding-test';
//serverUrl = 'http://html5-mobile-scaffolding-test.cloudfoundry.com'	


$('#section-list-authors').live('pageinit', function(e) {
	
    // Get domain objects		
	getAuthors();
});



function getAuthors() {
	$.ajax({
		cache : false,
		type : "GET",
		async : false,
		dataType : "jsonp",
		url : serverUrl + '/author/list',
		success : function(data) {
			if (data) {
				var authorList = new AuthorList();
				authorList.add(data);
				authorList.renderToHtml();
			}
		},
		error : function(xhr) {
			alert(xhr.responseText);
		}
	});
}

AuthorList.prototype.renderToHtml = function() {
	var context = this.authors;
	for ( var i = 0; i < context.length; i++) {
		var author = context[i];
		addAuthorOnSection(author);
	}
	$('#list-authors').listview('refresh');
	
}


function addAuthorOnSection (author) {
	var out = '<li><a href="#section-show-author?id='+ author.id + '" data-transition="fade" id="author'; 
	out =  out + author.id + '-in-list">';
	
    out = out + author.bithday +';';
       out = out + author.firstname +';';
       out = out + author.lastname +';';
       
	out = out + '</a></li>';
	
	$("#section-list-authors").data('Author_' + author.id, author);
	
	
	$(author).bind("refresh-author" + author.id + "-list", function(bind, newAuthor) {
		var author = $("#section-list-authors").data('Author_' + newAuthor.id);
		var textDisplay = "";
	    textDisplay = textDisplay + newAuthor.bithday +';';
	       textDisplay = textDisplay + newAuthor.firstname +';';
	       textDisplay = textDisplay + newAuthor.lastname +';';
	       
		$('#author' + newAuthor.id + '-in-list').text(textDisplay);
		for(var property in newAuthor) {
			author[property] = newAuthor[property];
		}
		
	});
	$("#list-authors").append(out);
}


function removeAuthorOnSection(id) {
	var listID = 'author' + id + '-in-list';
	var link = $("#" + listID);
	link.parents('li').remove();
	var author = $("#section-list-authors").data('Author_' + id, author);
	$("#section-list-authors").removeData('Author_' + id);
	$(author).unbind();
	$('#list-authors').listview('refresh');
	
}

