var app = app || {};//global Backbone

app.CameraVDocumentsView = Backbone.View.extend({
	el: '#cv_documents_view_holder',
	initialize: function() {
		if (this.$el.hasClass("rendered")) {
			return;
		}
		this.documentBrowser = new app.InformaCamDocumentBrowser;
		var self = this;
		$.when(this.documentBrowser.fetch()).done(
			function() {
				self.render();
			}
		);

	},
	template: getTemplate("document_browser.html"),
	render: function() {

		this.docs = [];
		this.keys = [];
		_.each(this.documentBrowser.models, function(doc) {
			m = doc.get('mime_type');
			if (this.docs[m] == undefined) {
				this.docs[m] = [];
				this.keys.push(m);
			}
			this.docs[m].push({_id: doc.get('_id'), file_name: doc.get('file_name')});
		}, this);

		this.keys.sort();
		this.p = [];
		for (x in this.keys) {
			this.p.push({mime_type: this.keys[x], docs: this.docs[this.keys[x]]});
		}
		html = Mustache.to_html(this.template, this.p);
		this.$el.html(html);
		this.$el.addClass("rendered");



		return this;
	}
});
