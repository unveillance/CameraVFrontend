var documents, search;

function failOut() {
	$("#ic_content_header").html("Sorry.  No documents found.");
}

var Main = {
	onConfLoaded: function() {
		try {
		/*
			documents = new InformaCamDocumentBrowser(_.extend(
				doInnerAjax("documents", "post", 
					{ mime_type : "[" + UV.DEFAULT_MIME_TYPES.join() + "]", doc_type : "uv_document" }, null, false),
				{ root_el : $("#ic_document_browser") }));

			if(documents.get('result') != 200) {
				failOut();
				return;
			}

			documents.unset('result');
			*/
		} catch(err) {
			console.error(err);
			failOut();
		}
	},
};

/* modified from Svet's ic_landing.js */
jQuery(document).ready(function($) {

	var h = window.location.hash.substring(1);
	if (h == 'documents' || h == 'file' || h == 'search') {
		$('ul.controls li').removeClass('active');
		$('ul.controls li#' + h + '_tab').addClass('active');
		$('#tabs .block').removeClass('active');
		$('#tabs #' + h + '_holder').addClass('active');
	}
	$( '#tabs' ).find( '.controls' ).find( 'a' ).click( function( e ){
		
//		e.preventDefault();
	
		var el = $( this );
		
		if (el.parent( 'li' ).hasClass('disabled')) {
			return;
		}
		
		el.parents( 'ul' ).find( 'li' ).removeClass( 'active' );
		el.parent( 'li' ).addClass( 'active' );
		el.parents('ul').siblings('div.active').removeClass( 'active' );
		$( '#tabs' ).find( el.attr( 'href' )  + '_holder' ).addClass( 'active' );

		$('#ic_search_button')
			.before($($("input[name='_xsrf']")[0]).clone());
	
	} );
	
	$("#ic_url_search_button").click(function() {
			//alert($("#ic_search_url").val());
			return doInnerAjax("SubmitViaURL", "post", {
			url : $("#ic_search_url").val() }, function(message){
				console.log(message);
			
				try {
					json = JSON.parse(message.responseText);
				} catch(err) {
					alert("Could not upload file from URL!");
					return;
				}
			
				if(json.result == 200) {
					path = json.data.mime_type !== undefined && json.data.mime_type.indexOf("application/pgp") > -1 ? "/source/" : "/submission/";
					location.href = path + json.data._id + '/';
				} else {
					alert("Could not upload file from URL!");
				}
			
			});
		});
	
	
	discoverICDropzones({url : "/import/"}, "#ic_import_dropzone_holder",
		function(file, message) {
			// onSuccess
			console.log(message);
			path = message.data.mime_type !== undefined && message.data.mime_type.indexOf("application/pgp") > -1 ? "/source/" : "/submission/";
			location.href = path + message.data._id + '/';
		},
		function(file, message) {
			// onError
			console.error(message);
			messagetext = '';
			if (typeof message !== null && typeof message === 'object') {
				if (message.result == 403) {
					messagetext = "It's not you, it's us. We're looking into the problem. Please try again later. (" + message.result + ")";
					this.disable();
				}
			} else {
				messagetext = message;
			}
			return file.previewElement.querySelector("[data-dz-errormessage]").textContent = messagetext;
		});


		try {
			updateConf();
		} catch(err) {
			console.warn(err);
			console.warn("no updateConf()");
		}
		
		try {
			Main.onConfLoaded();
			Search.onConfLoaded();
		} catch(err) {
			console.warn(err);
			console.warn("no onConfLoaded()");
		}
		
		
//Jonny revised search mockup 09/2015
$('#advanced').click(function() {
	$('.search_advanced').show();
});

$('.search_options_main select').change(function() {
	option = $(this).val();
	$c(option);
	$('.search_option').hide();
	$('.' + option + '_options').show();
});

$('.by_date_created_options select').change(function() {
	option = $(this).val();
	if (option == 'date_created_on') {
		$('.search_date_start, .search_date_end').hide();
		$('.search_date').show();
	} else {
		$('.search_date_start, .search_date_end').show();
		$('.search_date').hide();
	}
});

$('.search_advanced .search_plus, .search_advanced .search_minus').click(function(){
	alert('This doesn\'t do anything yet, but it will allow the user to add or remove a set of search criteria.');
});

});

function $c(msg) {
	console.log(msg);
}

