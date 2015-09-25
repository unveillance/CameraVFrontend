var app = app || {};//global Backbone
var documents, search;

function failOut() {
	$("#ic_content_header").html("Sorry.  No documents found.");
}

var Main = {
	onConfLoaded: function() {
		try {
			$c('main onconfloaded');
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
	
	routePage: function(hash) {
		var location = hash;
		if (app.docid) {
			location += '&_id=' + app.docid;
		}
		window.location.hash = location;

		switch (hash) {
			case 'file':
				if (app.docid !== undefined) {
					this.initFileView();
				}
			break;
			case 'notes':
				this.initNotesView();
			break;
			case 'export':
				this.initSearchView();
			break;
			case 'metadata':
				this.initSearchView();
			break;
			case 'search':
				this.initSearchView();
			break;
			case 'documents':
				this.initSearchView();
			break;
			case 'meta_header':
				this.initSearchView();
			break;
			case 'meta_wrapper':
				this.initSearchView();
			break;
			case 'meta_sensors':
				this.initSearchView();
			break;
		}
	},
	
	initFileView: function() {
		var fileView = new app.CameraVFileView;
		$c('initFileView ' + app.docid);
		$c(fileView);
		for (thing in fileView) {
			if (fileView[thing] instanceof Backbone.View) {
//				fileView[thing].model.fetch();
//				$c(fileView[thing]);
			}
		}

		fileView.timeseriesMapView.model.fetch();
		fileView.J3MHeaderView.model.fetch();
		fileView.documentWrapperView.model.fetch();
		fileView.appendedUserDataView.model.fetch();

		
//		$c(fileView.timeseriesMapView.model);
//		fileView.documentWrapperView.model.set('jimmyHat', true);
	},
	
	initSearchView: function() {
	},
	
};

/* modified from Svet's ic_landing.js */
jQuery(document).ready(function($) {

	var vars = _.object(_.compact(_.map(location.hash.slice(1).split('&'), function(item) {  if (item) return item.split('='); })));
	
	if (vars._id !== undefined) {
		app.docid = vars._id;
	}
//http://localhost:8888/#file&_id=7a200f88018146bdeef9d3775f7685a7710ea7a4

	var h = window.location.hash.substring(1);
	if (h == 'documents' || h == 'file' || h == 'search') {
		$('ul.controls li').removeClass('active');
		$('ul.controls li#' + h + '_tab').addClass('active');
		$('#tabs .block').removeClass('active');
		$('#tabs #' + h + '_holder').addClass('active');
		Main.routePage(h);
	} else if (app.docid) {//don't go to other pages unless there's a docid
		Main.routePage(h);
	} else {
		Main.routePage('file');
	}
	
	$('#tabs').find('.controls').find('a').click( function( e ){
		var el = $(this);
		var href = el.attr('href');
		$c(el.attr('href'));
		
		e.preventDefault();
		if (el.parent('li').hasClass('disabled') || el.parent('li').hasClass('active')) {
			return;
		}
		
		
		el.parents('ul').find('li').removeClass('active');
		el.parent('li').addClass('active');
		el.parents('ul').siblings('div.active').removeClass('active');
		$('#tabs').find(href + '_holder').addClass('active');
		$c(app.docid);
		
		Main.routePage(href.substring(1));
		

//		$('#ic_search_button').before($($("input[name='_xsrf']")[0]).clone());
	
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
			$('#tabs .controls li').removeClass('disabled');
			app.docid = message.data._id;
			window.location.hash = 'file&_id=' + app.docid;
			this.disable();
			Main.initFileView();
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
		
			Search.onConfLoaded();
		try {
			Main.onConfLoaded();
			Search.onConfLoaded();
		} catch(err) {
			console.warn(err);
			console.warn("no onConfLoaded()");
		}
		
		
//Jonny revised search mockup 09/2015
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

$('.search_plus').click(function(){
	Search.appendAdvancedSearch($(this));
});

});

function $c(msg) {
	console.log(msg);
}

