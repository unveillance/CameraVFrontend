var app = app || {};//global Backbone
var documents, search, dropzones;

function failOut() {
	$("#ic_content_header").html("Sorry.  No documents found.");
}

var Main = {
	docid: null, //used to keep track of when document changes
	routePage: function(hash) {
		var location = hash;
		if (app.docid) {
			location += '&_id=' + app.docid;
		}
		window.location.hash = location;

		if (app.docid !== undefined) {
			switch (hash) {
				case 'file':
					this.initFileView();
				break;
				case 'notes':
					this.initNotesView();
				break;
				case 'export':
					this.initExportView();
				break;
				case 'metadata':
				case 'meta_header':
				case 'meta_wrapper':
				case 'meta_sensors':
					this.initMetadataView();
				break;
				case 'search':
					this.initSearchView();
				break;
				case 'documents':
					this.initDocumentsView();
				break;
			}
			this.docid = app.docid;
		}
	},
	
	initFileView: function() {
		if (this.docid == null) { //init search
			$('#clear_and_upload').hide();
			$('#ic_import_dropzone_holder').show();
			$c('this.docid == null');
		}

		$('#clear_and_upload').show();
		$('#ic_import_dropzone_holder').hide();

		if (app.docid == this.docid) { //don't render it twice
			$c('app.docid == this.docid');
			return;
		}
		fileView = new app.CameraVFileView;
		$c('initFileView ' + app.docid);
		$c(fileView);
		
		//fetch all models automatically?
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
		
	},
	
	initNotesView: function() {
		if (app.docid == this.docid) { //don't render it twice
			return;
		}
		notesView = new app.CameraVNotesView;
	},
	
	initExportView: function() {
		if (app.docid == this.docid) { //don't render it twice
			return;
		}
		exportView = new app.CameraVExportView;
	},
	
	initMetadataView: function() {
		if (app.docid == this.docid) { //don't render it twice
			return;
		}
		exportView = new app.CameraVMetadataView;
	},
	
	initSearchView: function() {
		exportView = new app.CameraVSearchView;
	},
	
	initDocumentsView: function() {
		exportView = new app.CameraVDocumentsView;
	},
	
	resetDropzone: function() {
		dropzones[0].dropzone.removeAllFiles();	
		$('#clear_and_upload').hide();
		$('#ic_import_dropzone_holder, .ic_upload_instructions').show();
	},
};

jQuery(document).ready(function($) {

	try {
		updateConf();
	} catch(err) {
		console.warn(err);
		console.warn("no updateConf()");
	}
	
	try {
		Search.onConfLoaded();
	} catch(err) {
		console.warn(err);
		console.warn("no onConfLoaded()");
	}
		

	var vars = _.object(_.compact(_.map(location.hash.slice(1).split('&'), function(item) {  if (item) return item.split('='); })));
	
	if (vars._id !== undefined) {
		app.docid = vars._id;
	}
//http://localhost:8888/#file&_id=7a200f88018146bdeef9d3775f7685a7710ea7a4

	var h = window.location.hash.substring(1).split('&')[0];
	if (h == 'documents' || h == 'file' || h == 'search' || app.docid) {
		if (app.docid) {
			$('#tabs .controls li').removeClass('disabled');
		}
		$('ul.controls li').removeClass('active');
		$('ul.controls li#' + h + '_tab').addClass('active');
		$('#tabs .block').removeClass('active');
		$('#tabs #' + h + '_holder').addClass('active');
		if (h.substring(0,4) == 'meta') {//pretty hacky
			$('ul.controls li#metadata_tab').addClass('active');
			$('#tabs #metadata_holder').addClass('active');
		}
		Main.routePage(h);
	} else if (app.docid) {//don't go to other pages unless there's a docid
		Main.routePage(h);
	} else {
		Main.routePage('file');
	}
	
	
	$('#tabs').find('.controls').find('a').click( function( e ){
		var el = $(this);
		var href = el.attr('href');
		
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

	dropzones = discoverICDropzones({url : "/import/"}, "#ic_import_dropzone_holder",
		function(file, message) {
			// onSuccess
			console.log(message);
			$('#tabs .controls li').removeClass('disabled');
			app.docid = message.data._id;
			window.location.hash = 'file&_id=' + app.docid;
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
					this.removeAllFiles();
				}
			} else {
				messagetext = message;
			}
			return file.previewElement.querySelector("[data-dz-errormessage]").textContent = messagetext;
		});
		
	$('#clear_and_upload').click(function() {
		Main.resetDropzone();
	});
	



		
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

