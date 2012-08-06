

function Author() {
	this.author = [];
}

$('#section-show-author').live('pageshow', function(e) {
	var url = $(e.target).attr("data-url");
	var matches = url.match(/\?id=(.*)/);
	
	if (matches != null) {
		showAuthor(matches[1]);
	} else {
		createAuthor();
	}
});



function createAuthor() {
	resetForm("form-update-author");
    	
    
    
	$("#delete-author").hide();
}





function showAuthor(id) {
	resetForm("form-update-author");
	var author = $("#section-list-authors").data("Author_" + id);
    
	$('#input-author-bithday').val(author.bithday);
    
	$('#input-author-firstname').val(author.firstname);
    
	$('#input-author-lastname').val(author.lastname);
    
	$('#input-author-id').val(author.id);
	$('#input-author-version').val(author.version);
	$('#input-author-class').val(author.class);
		
	$("#delete-author").show();
}

Author.prototype.renderToHtml = function() {
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


$("#submit-author").live("click tap", function() {
	var div = $("#form-update-author");
	var inputs = div.find("input, select");
	var obj = serializeObject(inputs);
	var action = "update";
	if (obj.id == "") {
		action= "save";
	}
	var txt = {
		author : JSON.stringify(obj)
	};

	$.ajax({
		cache : false,
		type : "POST",
		async : false,
		data : txt,
		dataType : "jsonp",
		url : serverUrl + '/author/' + action,
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
				addAuthorOnSection(data);
				$('#list-authors').listview('refresh');
				
			} else {
				var author = $("#section-list-authors").data('Author_' + data.id);
				$(author).trigger("refresh-author"+ data.id + "-list", data);
			}
		},
		error : function(xhr) {
			alert(xhr.responseText);
		}
	});

});


$("#delete-author").live("click tap", function() {
	var authorId = $('#input-author-id').val();
	var txt = { id : authorId };
	$.ajax({
		cache : false,
		type : "POST",
		async : false,
		data : txt,
		dataType : "jsonp",
		url : serverUrl + '/author/delete',
		success : function(data) {
			if (data.message) {
				alert(data.message)
				return;
			}
			removeAuthorOnSection(data.id);
		},
		error : function(xhr) {
			alert(xhr.responseText);
		}
	});
});