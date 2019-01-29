var authorization = '';
var userName = '';
if ($.cookie("authorization")) authorization = $.cookie("authorization");
if ($.cookie("userName")) userName = $.cookie("userName");
if (userName.length > 1) {
	$("#btnLogin").hide();
	$("#btnLogout").show();
	$("#nameOfUser").html(userName);
}

function logout() {
	$.removeCookie("authorization");
	$.removeCookie("userName");
	authorization = '';
	userName = '';
	showHome();
	$("#btnLogout").hide();
	$("#btnLogin").show();
}

function login(user, token) {
	$.cookie("authorization", token, {expire: 1});
	$.cookie("userName", user, {expire: 1});
	authorization = token;
	userName = user;
	$("#btnLogin").hide();
	$("#btnLogout").show();
	$("#nameOfUser").html(userName);
	showHome();
}

function showLogin() {
	$("#ctn").children().hide();
	$("#login").show();
}

function loginAction() {
	console.log({email: $("#email").val(), password: $("#password").val()});
	$.ajax({
		url: "https://ibucur.zego.ro/api/users/login",
		method: "POST",

		data: {email: $("#email").val(), password: $("#password").val()},
		dataType: "json",
		success: function(data) {
			login(data.user.fullName, data.token);
		},
		error: function(err) {
			$('#loginErrorMsg').html(JSON.parse(err.responseText).message);
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}

function showAuthors() {
	$("#ctn").children().hide();
	if (userName.length > 1) {
		$("#authorsListContainer").show();
	}
	else {
		$("#authors")
			.html('<div style="text-align: center;"><div class="loader"></div></div>')
			.show();
	}

	var authorCard = $("#authorCard").html();
	$.ajax({
		url: "https://ibucur.zego.ro/api/authors",
		dataType: "json",
		success: function(data) {

			if (userName.length > 1) {
				var content = '<table class="table table-striped table-sm" style="background: #cccccc;"><thead><tr><th>Id</th><th>Full Name</th><th>Wikidata Uri</th><th>Action</th></tr></thead><tbody>';
				$.each( data, function( i, item ) {
					content += '<tr><td>'+item.id+'</td><td>'+item.name+'</td><td>'+item.wikidataUri+'</td><td><a href="#" class="btn btn-primary" onclick="$(\'#authorEditModal\').modal(\'show\'); $(\'#frmAuthorId\').val(\''+item.id+'\');$(\'#frmAuthorName\').val(\''+item.name+'\');$(\'#frmAuthorWikidataUri\').val(\''+item.wikidataUri+'\');">Edit</a></td></tr>';
				});
				content += '</tbody></table>';

				var local = $("#authorsList").html();
				local = local.replace('{{contentList}}', content);
				$('#authorsListContainer').html(local);
			}
			else {
				var ctn = '<h2>Authors Page</h2>';
				$.each( data, function( i, item ) {
					var local = authorCard;
					local = local.replace('{{authorId}}', item.id);
					local = local.replace('{{name}}', item.name);
					local = local.replace('{{wikidataUri}}', item.wikidataUri);
					ctn += local;
				});
				$('#authors').html(ctn);
			}
		},
		error: function(err) {
			if (userName.length > 1) {
				$('#authorsListContainer').html('<h2>Authors Management</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
				console.log("ERROR: " + JSON.stringify(err));

			}
			else {
				$('#authors').html('<h2>Authors Page</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
				console.log("ERROR: " + JSON.stringify(err));
			}
		}
	});
}

function saveAuthor() {
	console.log('saving');
	if (parseInt($('#frmAuthorId').val()) > 0) {
		var url = 'https://ibucur.zego.ro/api/authors/'+parseInt($('#frmAuthorId').val());
		var data = {id:parseInt($('#frmAuthorId').val()), name: $('#frmAuthorName').val(), wikidataUri: $('#frmAuthorWikidataUri').val()};
		var method = 'PUT';
	}
	else {
		var url = 'https://ibucur.zego.ro/api/authors';
		var data = {name: $('#frmAuthorName').val(), wikidataUri: $('#frmAuthorWikidataUri').val()};
		var method = 'POST';
	}
	console.log(url);
	console.log(data);
	console.log(method);
	$.ajax({
		url: url,
		headers: { 'Authorization': authorization},
		method: method,
		data: data,
		dataType: "json",
		success: function(data) {
			alert('Author has been saved');
			$('#authorEditModal').modal('hide');
			showAuthors();
		},
		error: function(err) {
			alert('ERROR: '+JSON.parse(err.responseText).message);
			console.log("ERROR: " + JSON.stringify(err));
		}
	});

}

function showHome() {
	$("#ctn").children().hide();
	$("#home").show();
}

function showGenres() {

	if (userName.length > 1) {
		showGenresAdmin();
		return;
	}

	$("#ctn").children().hide();
	$("#genres")
		.html('<div style="text-align: center;"><div class="loader"></div></div>')
		.show();

	var card = $("#genreCard").html();
	$.ajax({
		url: "https://ibucur.zego.ro/api/genres",
		dataType: "json",
		success: function(data) {

			//console.log("DATA: " + JSON.stringify(data));
			var ctn = '<h2>Books Genres Page</h2>';
			$.each( data, function( i, item ) {
				var local = card;
				local = local.replace('{{name}}', item.name);
				local = local.replace('{{wikidataUri}}', item.wikidataUri);
				ctn += local;
			});
			$('#genres').html(ctn);
		},
		error: function(err) {
			$('#genres').html('<h2>Books Genres Page</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}

function showGenresAdmin() {
	$("#ctn").children().hide();
	$("#genresListContainer").show();
	$.ajax({
		url: "https://ibucur.zego.ro/api/genres",
		dataType: "json",
		success: function(data) {

			var content = '<table class="table table-striped table-sm" style="background: #cccccc;"><thead><tr><th>Id</th><th>Genre Name</th><th>Wikidata Uri</th><th>Action</th></tr></thead><tbody>';
			$.each( data, function( i, item ) {
				content += '<tr><td>'+item.id+'</td><td>'+item.name+'</td><td>'+item.wikidataUri+'</td><td><a href="#" class="btn btn-primary" onclick="$(\'#genreEditModal\').modal(\'show\'); $(\'#frmGenreId\').val(\''+item.id+'\');$(\'#frmGenreName\').val(\''+item.name+'\');$(\'#frmGenreWikidataUri\').val(\''+item.wikidataUri+'\');">Edit</a></td></tr>';
			});
			content += '</tbody></table>';

			var local = $("#genresList").html();
			local = local.replace('{{contentList}}', content);
			$('#genresListContainer').html(local);

		},
		error: function(err) {
			$('#genresListContainer').html('<h2>Genres Management</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}
function saveGenre() {
	//console.log('saving');
	if (parseInt($('#frmGenreId').val()) > 0) {
		var url = 'https://ibucur.zego.ro/api/genres/'+parseInt($('#frmGenreId').val());
		var data = {id:parseInt($('#frmGenreId').val()), name: $('#frmGenreName').val(), wikidataUri: $('#frmGenreWikidataUri').val()};
		var method = 'PUT';
	}
	else {
		var url = 'https://ibucur.zego.ro/api/genres';
		var data = {name: $('#frmGenreName').val(), wikidataUri: $('#frmGenreWikidataUri').val()};
		var method = 'POST';
	}
	console.log(url);
	console.log(data);
	console.log(method);
	$.ajax({
		url: url,
		headers: { 'Authorization': authorization},
		method: method,
		data: data,
		dataType: "json",
		success: function(data) {
			alert('Genre has been saved');
			$('#genreEditModal').modal('hide');
			showGenresAdmin();
		},
		error: function(err) {
			alert('ERROR: '+JSON.parse(err.responseText).message);
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}

function showLanguages() {
	if (userName.length > 1) {
		showLanguagesAdmin();
		return;
	}

	$("#ctn").children().hide();
	$("#languages")
		.html('<div style="text-align: center;"><div class="loader"></div></div>')
		.show();

	var card = $("#languageCard").html();
	$.ajax({
		url: "https://ibucur.zego.ro/api/languages",
		dataType: "json",
		success: function(data) {

			//console.log("DATA: " + JSON.stringify(data));
			var ctn = '<h2>Books Languages Page</h2>';
			$.each( data, function( i, item ) {
				var local = card;
				local = local.replace('{{name}}', item.name);
				local = local.replace('{{wikidataUri}}', item.wikidataUri);
				ctn += local;
			});
			$('#languages').html(ctn);
		},
		error: function(err) {
			$('#languages').html('<h2>Books Languages Page</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}
function showLanguagesAdmin() {
	$("#ctn").children().hide();
	$("#languagesListContainer").show();
	$.ajax({
		url: "https://ibucur.zego.ro/api/languages",
		dataType: "json",
		success: function(data) {

			var content = '<table class="table table-striped table-sm" style="background: #cccccc;"><thead><tr><th>Id</th><th>Language Name</th><th>Wikidata Uri</th><th>Action</th></tr></thead><tbody>';
			$.each( data, function( i, item ) {
				content += '<tr><td>'+item.id+'</td><td>'+item.name+'</td><td>'+item.wikidataUri+'</td><td><a href="#" class="btn btn-primary" onclick="$(\'#languageEditModal\').modal(\'show\'); $(\'#frmLanguageId\').val(\''+item.id+'\');$(\'#frmLanguageName\').val(\''+item.name+'\');$(\'#frmLanguageWikidataUri\').val(\''+item.wikidataUri+'\');">Edit</a></td></tr>';
			});
			content += '</tbody></table>';

			var local = $("#languagesList").html();
			local = local.replace('{{contentList}}', content);
			$('#languagesListContainer').html(local);

		},
		error: function(err) {
			$('#languagesListContainer').html('<h2>Languages Management</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}
function saveLanguage() {
	//console.log('saving');
	if (parseInt($('#frmLanguageId').val()) > 0) {
		var url = 'https://ibucur.zego.ro/api/languages/'+parseInt($('#frmLanguageId').val());
		var data = {id:parseInt($('#frmLanguageId').val()), name: $('#frmLanguageName').val(), wikidataUri: $('#frmLanguageWikidataUri').val()};
		var method = 'PUT';
	}
	else {
		var url = 'https://ibucur.zego.ro/api/languages';
		var data = {name: $('#frmLanguageName').val(), wikidataUri: $('#frmLanguageWikidataUri').val()};
		var method = 'POST';
	}
	console.log(url);
	console.log(data);
	console.log(method);
	$.ajax({
		url: url,
		headers: { 'Authorization': authorization},
		method: method,
		data: data,
		dataType: "json",
		success: function(data) {
			alert('Language has been saved');
			$('#languageEditModal').modal('hide');
			showLanguagesAdmin();
		},
		error: function(err) {
			alert('ERROR: '+JSON.parse(err.responseText).message);
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}

function showPublishers() {
	if (userName.length > 1) {
		showPublishersAdmin();
		return;
	}
	$("#ctn").children().hide();
	$("#publishers")
		.html('<div style="text-align: center;"><div class="loader"></div></div>')
		.show();

	var card = $("#publisherCard").html();
	$.ajax({
		url: "https://ibucur.zego.ro/api/publishers",
		dataType: "json",
		success: function(data) {

			//console.log("DATA: " + JSON.stringify(data));
			var ctn = '<h2>Books Publishers Page</h2>';
			$.each( data, function( i, item ) {
				var local = card;
				local = local.replace('{{name}}', item.name);
				local = local.replace('{{wikidataUri}}', item.wikidataUri);
				ctn += local;
			});
			$('#publishers').html(ctn);
		},
		error: function(err) {
			$('#publishers').html('<h2>Books Publishers Page</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}
function showPublishersAdmin() {
	$("#ctn").children().hide();
	$("#publishersListContainer").show();
	$.ajax({
		url: "https://ibucur.zego.ro/api/publishers",
		dataType: "json",
		success: function(data) {

			var content = '<table class="table table-striped table-sm" style="background: #cccccc;"><thead><tr><th>Id</th><th>Publisher Name</th><th>Wikidata Uri</th><th>Action</th></tr></thead><tbody>';
			$.each( data, function( i, item ) {
				content += '<tr><td>'+item.id+'</td><td>'+item.name+'</td><td>'+item.wikidataUri+'</td><td><a href="#" class="btn btn-primary" onclick="$(\'#publisherEditModal\').modal(\'show\'); $(\'#frmPublisherId\').val(\''+item.id+'\');$(\'#frmPublisherName\').val(\''+item.name+'\');$(\'#frmPublisherWikidataUri\').val(\''+item.wikidataUri+'\');">Edit</a></td></tr>';
			});
			content += '</tbody></table>';

			var local = $("#publishersList").html();
			local = local.replace('{{contentList}}', content);
			$('#publishersListContainer').html(local);

		},
		error: function(err) {
			$('#publishersListContainer').html('<h2>Publishers Management</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}
function savePublisher() {
	//console.log('saving');
	if (parseInt($('#frmPublisherId').val()) > 0) {
		var url = 'https://ibucur.zego.ro/api/publishers/'+parseInt($('#frmPublisherId').val());
		var data = {id:parseInt($('#frmPublisherId').val()), name: $('#frmPublisherName').val(), wikidataUri: $('#frmPublisherWikidataUri').val()};
		var method = 'PUT';
	}
	else {
		var url = 'https://ibucur.zego.ro/api/publishers';
		var data = {name: $('#frmPublisherName').val(), wikidataUri: $('#frmPublisherWikidataUri').val()};
		var method = 'POST';
	}
	console.log(url);
	console.log(data);
	console.log(method);
	$.ajax({
		url: url,
		headers: { 'Authorization': authorization},
		method: method,
		data: data,
		dataType: "json",
		success: function(data) {
			alert('Publisher has been saved');
			$('#publisherEditModal').modal('hide');
			showPublishersAdmin();
		},
		error: function(err) {
			alert('ERROR: '+JSON.parse(err.responseText).message);
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}


function showCurrencies() {
	if (userName.length > 1) {
		showCurrenciesAdmin();
		return;
	}
	$("#ctn").children().hide();
	$("#currencies")
		.html('<div style="text-align: center;"><div class="loader"></div></div>')
		.show();

	var card = $("#currencyCard").html();
	$.ajax({
		url: "https://ibucur.zego.ro/api/currencies",
		dataType: "json",
		success: function(data) {

			//console.log("DATA: " + JSON.stringify(data));
			var ctn = '<h2>Books Currencies Page</h2>';
			$.each( data, function( i, item ) {
				var local = card;
				local = local.replace('{{name}}', item.name);
				local = local.replace('{{currencyShortcut}}', item.shortcut);
				local = local.replace('{{wikidataUri}}', item.wikidataUri);
				ctn += local;
			});
			$('#currencies').html(ctn);
		},
		error: function(err) {
			$('#currencies').html('<h2>Books Currencies Page</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}
function showCurrenciesAdmin() {
	$("#ctn").children().hide();
	$("#currenciesListContainer").show();
	$.ajax({
		url: "https://ibucur.zego.ro/api/currencies",
		dataType: "json",
		success: function(data) {

			var content = '<table class="table table-striped table-sm" style="background: #cccccc;"><thead><tr><th>Id</th><th>Currency Name</th><th>Currency Shortcut</th><th>Wikidata Uri</th><th>Action</th></tr></thead><tbody>';
			$.each( data, function( i, item ) {
				content += '<tr><td>'+item.id+'</td><td>'+item.name+'</td><td>'+item.shortcut+'</td><td>'+item.wikidataUri+'</td><td><a href="#" class="btn btn-primary" onclick="$(\'#currencyEditModal\').modal(\'show\'); $(\'#frmCurrencyId\').val(\''+item.id+'\');$(\'#frmCurrencyName\').val(\''+item.name+'\');$(\'#frmCurrencyShortcut\').val(\''+item.shortcut+'\');$(\'#frmCurrencyWikidataUri\').val(\''+item.wikidataUri+'\');">Edit</a></td></tr>';
			});
			content += '</tbody></table>';

			var local = $("#currenciesList").html();
			local = local.replace('{{contentList}}', content);
			$('#currenciesListContainer').html(local);

		},
		error: function(err) {
			$('#currenciesListContainer').html('<h2>Currencies Management</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}
function saveCurrency() {
	//console.log('saving');
	if (parseInt($('#frmCurrencyId').val()) > 0) {
		var url = 'https://ibucur.zego.ro/api/currencies/'+parseInt($('#frmCurrencyId').val());
		var data = {id:parseInt($('#frmCurrencyId').val()), name: $('#frmCurrencyName').val(), shortcut: $('#frmCurrencyShortcut').val(), wikidataUri: $('#frmCurrencyWikidataUri').val()};
		var method = 'PUT';
	}
	else {
		var url = 'https://ibucur.zego.ro/api/currencies';
		var data = {name: $('#frmCurrencyName').val(), shortcut: $('#frmCurrencyShortcut').val(), wikidataUri: $('#frmCurrencyWikidataUri').val()};
		var method = 'POST';
	}
	console.log(url);
	console.log(data);
	console.log(method);
	$.ajax({
		url: url,
		headers: { 'Authorization': authorization},
		method: method,
		data: data,
		dataType: "json",
		success: function(data) {
			alert('Currency has been saved');
			$('#currencyEditModal').modal('hide');
			showCurrenciesAdmin();
		},
		error: function(err) {
			alert('ERROR: '+JSON.parse(err.responseText).message);
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}

function setBookEditFrmValues(bookId, bookTitle, bookISBN, bookImageUri, bookPlot, bookPagesNo, bookPrice, bookAuthorId, bookGenreId, bookPublisherId, bookLanguageId, bookCurrencyId) {
	$('#frmBookId').val(bookId);
	$('#frmBookTitle').val((bookTitle));
	$('#frmBookISBN').val(bookISBN);
	$('#frmBookImageUri').val((bookImageUri));
	$('#frmBookPlot').val((bookPlot));
	$('#frmBookPagesNo').val(bookPagesNo);
	$('#frmBookPrice').val(bookPrice);

	$('#frmBookAuthorId').empty();
	$('#frmBookGenreId').empty();
	$('#frmBookLanguageId').empty();
	$('#frmBookPublisherId').empty();
	$('#frmBookCurrencyId').empty();

	$.ajax({
		url: "https://ibucur.zego.ro/api/authors",
		dataType: "json",
		success: function(data) {
			$.each( data, function( i, item ) {
				if (parseInt(item.id) == parseInt(bookAuthorId)) {
					$('#frmBookAuthorId').append('<option selected="selected" value="'+item.id+'">'+item.name+'</option>');
				}
				else {
					$('#frmBookAuthorId').append('<option value="'+item.id+'">'+item.name+'</option>');
				}
			});
		}
	});
	$.ajax({
		url: "https://ibucur.zego.ro/api/currencies",
		dataType: "json",
		success: function(data) {
			$.each( data, function( i, item ) {
				if (parseInt(item.id) == parseInt(bookCurrencyId)) {
					$('#frmBookCurrencyId').append('<option selected="selected" value="'+item.id+'">'+item.shortcut+'</option>');
				}
				else {
					$('#frmBookCurrencyId').append('<option value="'+item.id+'">'+item.shortcut+'</option>');
				}
			});
		}
	});
	$.ajax({
		url: "https://ibucur.zego.ro/api/genres",
		dataType: "json",
		success: function(data) {
			$.each( data, function( i, item ) {
				if (parseInt(item.id) == parseInt(bookGenreId)) {
					$('#frmBookGenreId').append('<option selected="selected" value="'+item.id+'">'+item.name+'</option>');
				}
				else {
					$('#frmBookGenreId').append('<option value="'+item.id+'">'+item.name+'</option>');
				}
			});
		}
	});
	$.ajax({
		url: "https://ibucur.zego.ro/api/languages",
		dataType: "json",
		success: function(data) {
			$.each( data, function( i, item ) {
				if (parseInt(item.id) == parseInt(bookLanguageId)) {
					$('#frmBookLanguageId').append('<option selected="selected" value="'+item.id+'">'+item.name+'</option>');
				}
				else {
					$('#frmBookLanguageId').append('<option value="'+item.id+'">'+item.name+'</option>');
				}
			});
		}
	});
	$.ajax({
		url: "https://ibucur.zego.ro/api/publishers",
		dataType: "json",
		success: function(data) {
			$.each( data, function( i, item ) {
				if (parseInt(item.id) == parseInt(bookPublisherId)) {
					$('#frmBookPublisherId').append('<option selected="selected" value="'+item.id+'">'+item.name+'</option>');
				}
				else {
					$('#frmBookPublisherId').append('<option value="'+item.id+'">'+item.name+'</option>');
				}
			});
		}
	});
}
function showBooks() {
	if (userName.length > 1) {
		showBooksAdmin();
		return;
	}

	$("#ctn").children().hide();
	$("#books")
		.html('<div style="text-align: center;"><div class="loader"></div></div>')
		.show();

	var card = $("#bookCard").html();
	$.ajax({
		url: "https://ibucur.zego.ro/api/books",
		dataType: "json",
		success: function(data) {

			//console.log("DATA: " + JSON.stringify(data));
			var ctn = '<h2>Books Page</h2>';
			$.each( data, function( i, item ) {
				var local = card;
				local = local.replace('{{title}}', item.title);
				local = local.replace('{{title}}', item.title);
				local = local.replace('{{author}}', item.author.name);
				local = local.replace('{{shortcut}}', item.currency.shortcut);
				local = local.replace('{{imageUri}}', item.imageUri);
				local = local.replace('{{price}}', item.price);
				local = local.replace('{{language}}', item.language.name);
				local = local.replace('{{bookId}}', item.id);
				ctn += local;
			});
			$('#books').html(ctn);
		},
		error: function(err) {
			$('#books').html('<h2>Books Page</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}
function showBooksAdmin() {
	$("#ctn").children().hide();
	$("#booksListContainer").show();
	$.ajax({
		url: "https://ibucur.zego.ro/api/books",
		dataType: "json",
		success: function(data) {

			var content = '<table class="table table-striped table-sm" style="background: #cccccc;"> <thead><tr><th>Id</th><th>Title</th><th>Author</th><th>Genre</th><th>Price</th><th>Publisher</th><th>Action</th></tr></thead><tbody>';
			$.each( data, function( i, item ) {
				content += '<tr><td>'+item.id+'</td><td>'+item.title+'</td><td>'+item.author.name+'</td><td>'+item.genre.name+'</td><td>'+item.price+' '+item.currency.shortcut+'</td><td>'+item.publisher.name+'</td><td><a href="#" class="btn btn-primary" onclick="$(\'#bookEditModal\').modal(\'show\'); setBookEditFrmValues(\''+item.id+'\', \''+item.title.replace(/'/g,"\\'")+'\', \''+item.isbn+'\', \''+item.imageUri.replace(/'/g,"\\'")+'\', \''+item.plot.replace(/'/g,"\\'")+'\', \''+item.pagesNo+'\', \''+item.price+'\', \''+item.author.id+'\', \''+item.genre.id+'\', \''+item.publisher.id+'\', \''+item.language.id+'\', \''+item.currency.id+'\');">Edit</a></td></tr>';
			});
			content += '</tbody></table>';

			var local = $("#booksList").html();
			local = local.replace('{{contentList}}', content);
			$('#booksListContainer').html(local);

		},
		error: function(err) {
			$('#booksListContainer').html('<h2>Books Management</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}
function saveBook() {
	//console.log('saving');
	if (parseInt($('#frmBookId').val()) > 0) {
		var url = 'https://ibucur.zego.ro/api/books/'+parseInt($('#frmBookId').val());
		var data = {
			id: parseInt($('#frmBookId').val()),
			title: $('#frmBookTitle').val(),
			isbn: $('#frmBookISBN').val(),
			imageUri: $('#frmBookImageUri').val(),
			plot: $('#frmBookPlot').val(),
			pagesNo: parseInt($('#frmBookPagesNo').val()),
			price: $('#frmBookPrice').val(),
			author:{id: parseInt($('#frmBookAuthorId').val())} ,
			currency:{id: parseInt($('#frmBookCurrencyId').val())} ,
			genre:{id: parseInt($('#frmBookGenreId').val())} ,
			publisher:{id: parseInt($('#frmBookPublisherId').val())} ,
			language:{id: parseInt($('#frmBookLanguageId').val())}
		};
		var method = 'PUT';
	}
	else {
		var url = 'https://ibucur.zego.ro/api/books';
		var data = {
			title: $('#frmBookTitle').val(),
			isbn: $('#frmBookISBN').val(),
			imageUri: $('#frmBookImageUri').val(),
			plot: $('#frmBookPlot').val(),
			pagesNo: parseInt($('#frmBookPagesNo').val()),
			price: $('#frmBookPrice').val(),
			author:{id: parseInt($('#frmBookAuthorId').val())} ,
			currency:{id: parseInt($('#frmBookCurrencyId').val())} ,
			genre:{id: parseInt($('#frmBookGenreId').val())} ,
			publisher:{id: parseInt($('#frmBookPublisherId').val())} ,
			language:{id: parseInt($('#frmBookLanguageId').val())}
		};
		var method = 'POST';
	}

	console.log(url);
	console.log(data);
	console.log(method);

	$.ajax({
		url: url,
		headers: { 'Authorization': authorization},
		method: method,
		data: data,
		dataType: "json",
		success: function(data) {
			alert('Book has been saved');
			$('#bookEditModal').modal('hide');
			showBooksAdmin();
		},
		error: function(err) {
			alert('ERROR: '+JSON.parse(err.responseText).message);
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}


function showAuthorBooks(authorId) {
	$("#ctn").children().hide();
	$("#books")
		.html('<div style="text-align: center;"><div class="loader"></div></div>')
		.show();

	var card = $("#bookCard").html();
	$.ajax({
		url: "https://ibucur.zego.ro/api/authors/"+authorId+"/books",
		dataType: "json",
		success: function(data) {

			//console.log("DATA: " + JSON.stringify(data));
			var ctn = '<h2>{{author}} Books Page</h2>';
			$.each( data, function( i, item ) {
				var local = card;
				local = local.replace('{{title}}', item.title);
				local = local.replace('{{title}}', item.title);
				local = local.replace('{{author}}', item.author.name);
				ctn = ctn.replace('{{author}}', item.author.name);
				local = local.replace('{{shortcut}}', item.currency.shortcut);
				local = local.replace('{{imageUri}}', item.imageUri);
				local = local.replace('{{price}}', item.price);
				local = local.replace('{{language}}', item.language.name);
				local = local.replace('{{bookId}}', item.id);
				ctn += local;
			});
			$('#books').html(ctn);
		},
		error: function(err) {
			$('#books').html('<h2>Author Books Page</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}

function showBookDetails(bookId) {
	$("#ctn").children().hide();
	$("#bookDetails")
		.html('<div style="text-align: center;"><div class="loader"></div></div>')
		.show();

	var card = $("#bookDetailsCard").html();
	$.ajax({
		url: "https://ibucur.zego.ro/api/books/"+bookId,
		dataType: "json",
		success: function(data) {

			//console.log("DATA: " + JSON.stringify(data));
			var ctn = '';

				var local = card;
				local = local.replace('{{title}}', data.title);
				local = local.replace('{{title}}', data.title);
				local = local.replace('{{author}}', data.author.name);
				local = local.replace('{{shortcut}}', data.currency.shortcut);
				local = local.replace('{{imageUri}}', data.imageUri);
				local = local.replace('{{price}}', data.price);
				local = local.replace('{{language}}', data.language.name);
				local = local.replace('{{bookId}}', data.id);
				local = local.replace('{{plot}}', data.plot);
				local = local.replace('{{isbn}}', data.isbn);
				local = local.replace('{{pageNo}}', data.pagesNo);
				local = local.replace('{{publisher}}', data.publisher.name);
				ctn += local;

			$.ajax({
				url: "https://ibucur.zego.ro/api/books/"+bookId+"/recomandations",
				dataType: "json",
				success: function(data) {

					//console.log("DATA: " + JSON.stringify(data));
					var sameAuthor = '';
					if (data.sameAuthor.length == 0) sameLanguage = 'No Books Found';
					$.each( data.sameAuthor, function( i, item ) {
						var local = $("#bookCard").html();
						local = local.replace('{{title}}', item.title);
						local = local.replace('{{title}}', item.title);
						local = local.replace('{{author}}', item.author.name);
						local = local.replace('{{shortcut}}', item.currency.shortcut);
						local = local.replace('{{imageUri}}', item.imageUri);
						local = local.replace('{{price}}', item.price);
						local = local.replace('{{language}}', item.language.name);
						local = local.replace('{{bookId}}', item.id);
						sameAuthor += local;
					});
					var sameGenre = '';
					if (data.sameGenre.length == 0) sameLanguage = 'No Books Found';
					$.each( data.sameGenre, function( i, item ) {
						var local = $("#bookCard").html();
						local = local.replace('{{title}}', item.title);
						local = local.replace('{{title}}', item.title);
						local = local.replace('{{author}}', item.author.name);
						local = local.replace('{{shortcut}}', item.currency.shortcut);
						local = local.replace('{{imageUri}}', item.imageUri);
						local = local.replace('{{price}}', item.price);
						local = local.replace('{{language}}', item.language.name);
						local = local.replace('{{bookId}}', item.id);
						sameGenre += local;
					});

					var samePublisher = '';
					if (data.samePublisher.length == 0) sameLanguage = 'No Books Found';
					$.each( data.samePublisher, function( i, item ) {
						var local = $("#bookCard").html();
						local = local.replace('{{title}}', item.title);
						local = local.replace('{{title}}', item.title);
						local = local.replace('{{author}}', item.author.name);
						local = local.replace('{{shortcut}}', item.currency.shortcut);
						local = local.replace('{{imageUri}}', item.imageUri);
						local = local.replace('{{price}}', item.price);
						local = local.replace('{{language}}', item.language.name);
						local = local.replace('{{bookId}}', item.id);
						samePublisher += local;
					});
					var sameLanguage = '';
					if (data.sameLanguage.length == 0) sameLanguage = 'No Books Found';
					$.each( data.sameLanguage, function( i, item ) {
						var local = $("#bookCard").html();
						local = local.replace('{{title}}', item.title);
						local = local.replace('{{title}}', item.title);
						local = local.replace('{{author}}', item.author.name);
						local = local.replace('{{shortcut}}', item.currency.shortcut);
						local = local.replace('{{imageUri}}', item.imageUri);
						local = local.replace('{{price}}', item.price);
						local = local.replace('{{language}}', item.language.name);
						local = local.replace('{{bookId}}', item.id);
						sameLanguage += local;
					});

					ctn = ctn.replace('{{sameAuthor}}', sameAuthor);
					ctn = ctn.replace('{{sameGenre}}', sameGenre);
					ctn = ctn.replace('{{sameLanguage}}', sameLanguage);
					ctn = ctn.replace('{{samePublisher}}', samePublisher);
					$('#bookDetails').html(ctn);
				},
				error: function(err) {
					ctn = ctn.replace('{{sameAuthor}}', 'No Books Found');
					ctn = ctn.replace('{{sameGenre}}', 'No Books Found');
					ctn = ctn.replace('{{sameLanguage}}', 'No Books Found');
					ctn = ctn.replace('{{samePublisher}}', 'No Books Found');
					$('#bookDetails').html(ctn);

					console.log("ERROR: " + JSON.stringify(err));
				}
			});
		},
		error: function(err) {
			$('#bookDetails').html('<h2>Book Details Page</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}


