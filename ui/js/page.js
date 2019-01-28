var authorization = '';
if ($.cookie("authorization")) authorization = $.cookie("authorization");

function showAuthors() {
	$("#ctn").children().hide();
	$("#authors")
		.html('<div style="text-align: center;"><div class="loader"></div></div>')
		.show();

	var authorCard = $("#authorCard").html();
	$.ajax({
		url: "https://ibucur.zego.ro/api/authors",
		dataType: "json",
		success: function(data) {

			//console.log("DATA: " + JSON.stringify(data));
			var ctn = '<h2>Authors Page</h2>';
			$.each( data, function( i, item ) {
				var local = authorCard;
				local = local.replace('{{name}}', item.name);
				local = local.replace('{{wikidataUri}}', item.wikidataUri);
				ctn += local;
			});
			$('#authors').html(ctn);
		},
		error: function(err) {
			$('#authors').html('<h2>Authors Page</h2>'+$("#errorDiv").html().replace('{{errorMessage}}',JSON.parse(err.responseText).message));
			console.log("ERROR: " + JSON.stringify(err));
		}
	});
}

function showHome() {
	$("#ctn").children().hide();
	$("#home").show();
}

function showGenres() {
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

function showLanguages() {
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

function showPublishers() {
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

function showCurrencies() {
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

function showBooks() {
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
