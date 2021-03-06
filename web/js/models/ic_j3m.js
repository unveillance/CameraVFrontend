var app = app || {};//global Backbone

jQuery(document).ready(function($) {
	app.InformaCamJ3MHeader = Backbone.Model.extend({
		urlRoot: '/j3mheader',
		parse: function(response) {
			response.data.dateCreatedFormatted = moment(Number(response.data.genealogy.dateCreated)).format("MM/DD/YYYY HH:mm:ss");
			return response;
		},
	});

	app.InformaCamDocumentWrapper = Backbone.Model.extend({
		urlRoot: '/DocumentWrapper',
		parse: function(response) {
			response.data.dateAddedFormatted = moment(Number(response.data.date_added)).format("MM/DD/YYYY HH:mm:ss");;
			if (response.data.upload_attempts === undefined) {
				response.data.upload_attempts = 1;
			}
			if (response.data.j3m_verified === undefined) {
				response.data.j3m_verified = 'unverified';
			} else if (response.data.j3m_verified === true) {
				response.data.j3m_verified = 'passed';
			} else {
				response.data.j3m_verified = 'failed';
			}

			if (response.data.media_verified === undefined) {
				response.data.media_verified = 'unverified';
			} else if (response.data.media_verified === true) {
				response.data.media_verified = 'passed';
			} else {
				response.data.media_verified = 'failed';
			}
			return response;
		}
	});

	app.InformaCamImage = Backbone.Model.extend({
		urlRoot: '/DocumentWrapper',
	});

	app.InformaCamDocument = Backbone.Model.extend();

	app.InformaCamDocumentBrowser = Backbone.Collection.extend({
		model:app.InformaCamDocument,
		url: '/documents/',
		fetch: function(options) {
			//this is only because I can't figure out how to set the xsrf token in backbone
			var result = doInnerAjax("documents", "post", null, null, false);
			_.each(result.data.documents, _.bind(function(doc) {
				var d = new app.InformaCamDocument;
				d.set('_id', doc._id);
				d.set('mime_type', doc.mime_type);
				if (doc.file_name !== undefined) {
					d.set('file_name', doc.file_name);
				} else {
					d.set('file_name', doc.public_hash);
				}
				this.add(d);
			}, this));
		}
	});
	
	app.InformaCamAssetBrowser = Backbone.Model.extend({
		urlRoot: '/DocumentWrapper',
		parse: function(response) {
			_.each(response.data.assets, function(asset) {
				if (asset.description == undefined) {
					asset.description = asset.file_name;
				}
			});
			response.data = response.data.assets;
			return response;
		},
	});
	
	

	app.InformaCamAppendedUserData = Backbone.Model.extend({
		urlRoot: '/AppendedUserData',
	});

	app.InformaCamJ3MStripped = Backbone.Model.extend({
		urlRoot: '/j3mretrieve',
	});

	app.InformaCamJ3MTimeStampedData = Backbone.Model.extend({
		initialize: function(options) {
			this.urlRoot = options.urlRoot;
		},
		parse: function(response) {
			this.set({values: response}, {silent: true});
			_.each(response, function(r) {
				r.timestampFormatted = moment(Number(r.timestamp)).format("MM/DD/YYYY HH:mm:ss");;
			});
			return response;
		},
	});	
});

function $c(foo) {
	console.log(foo);
}
