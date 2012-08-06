

function Book() {
	this.book = [];
}

$('#section-show-book').live('pageshow', function(e) {
	var url = $(e.target).attr("data-url");
	var matches = url.match(/\?id=(.*)/);
	
    getAuthors();
    
	if (matches != null) {
		showBook(matches[1]);
	} else {
		createBook();
	}
});


function _refreshSelectDropDown(select, newOptions) {
	var options = null;
	if(select.prop) {
	  options = select.prop('options');
	}
	else {
	  options = select.attr('options');
	}
	$('option', select).remove();

	$.each(newOptions, function(val, text) {
	    options[options.length] = new Option(text, val);
	});
	select.val(options[0]);
	select.selectmenu('refresh');
}

function getAuthors() {
	$.ajax({
		cache : false,
		type : "GET",
		async : false,
		dataType : "jsonp",
		url : serverUrl + '/author/list',
		success : function(data) {
			if (data) {
				var options = new Object();
				$.each(data, function(val, text) {
				   var key = this.id;
				   			
				   var value = this.bithday;
				   options[key] = value;
				});
				var manyToOneSelectForAuthor = $('select[data-gorm-relation="many-to-one"][name="author"]');
				_refreshSelectDropDown(manyToOneSelectForAuthor, options)
			}
		},
		error : function(xhr) {
			alert(xhr.responseText);
		}
	});
}



function createBook() {
	resetForm("form-update-book");
    	
    
    
	$("#delete-book").hide();
}





function showBook(id) {
	resetForm("form-update-book");
	var book = $("#section-list-books").data("Book_" + id);
    
	$('select[data-gorm-relation="many-to-one"][name="author"]').val(book.author.id);
	$('select[data-gorm-relation="many-to-one"][name="author"]').selectmenu('refresh');
    
	$('#input-book-title').val(book.title);
    
	$('#input-book-id').val(book.id);
	$('#input-book-version').val(book.version);
	$('#input-book-class').val(book.class);
		
	$("#delete-book").show();
}

Book.prototype.renderToHtml = function() {
};

function resetForm(form) {
	var div = $("#" + form);
	div.find('input:text, input:hidden, input[type="number"], input:file, input:password').val('');
	div.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected').checkboxradio('refresh');
}

function serializeObject(inputs) {
	var arrayData, objectData;
	arrayData = inputs;
	objectData = {};

	$.each(arrayData, function() {
		var value, classtype;
		var add = true;
		if (this.type == 'select-one') {
			value = $(this).val();
		} else if (this.type == 'radio') {
			if ($(this).is(':checked')) {
				value = this.value;
			} else {
				add = false;
			}
		} else if (this.type == 'checkbox') {
			value = this.checked;
		} else {
			if ($(this).attr('data-role') == 'calbox') {
				value = $(this).data('calbox').theDate;
			} else if (this.value != null) {
				value = this.value;
			} else {
				value = '';
			}
		}
		if (add) {
			if ($(this).attr('data-gorm-relation') == "many-to-one") {
				objectData[this.name+'.id'] = value; 
			} else {
				objectData[this.name] = value;
			}
		}
	});

	return objectData;
}


$("#submit-book").live("click tap", function() {
	var div = $("#form-update-book");
	var inputs = div.find("input, select");
	var obj = serializeObject(inputs);
	var action = "update";
	if (obj.id == "") {
		action= "save";
	}
	var txt = {
		book : JSON.stringify(obj)
	};

	$.ajax({
		cache : false,
		type : "POST",
		async : false,
		data : txt,
		dataType : "jsonp",
		url : serverUrl + '/book/' + action,
		success : function(data) {
			if (data.message) {
				alert(data.message)
				return;
			}
			if (data.errors) {
				// Here I need to add to field mapping for errors
				alert("validation issue" + data.errors)
				return;
			}
			if (action == "save") {
				addBookOnSection(data);
				$('#list-books').listview('refresh');
				
			} else {
				var book = $("#section-list-books").data('Book_' + data.id);
				$(book).trigger("refresh-book"+ data.id + "-list", data);
			}
		},
		error : function(xhr) {
			alert(xhr.responseText);
		}
	});

});


$("#delete-book").live("click tap", function() {
	var bookId = $('#input-book-id').val();
	var txt = { id : bookId };
	$.ajax({
		cache : false,
		type : "POST",
		async : false,
		data : txt,
		dataType : "jsonp",
		url : serverUrl + '/book/delete',
		success : function(data) {
			if (data.message) {
				alert(data.message)
				return;
			}
			removeBookOnSection(data.id);
		},
		error : function(xhr) {
			alert(xhr.responseText);
		}
	});
});