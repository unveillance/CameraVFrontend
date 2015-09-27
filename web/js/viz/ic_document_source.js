var app = app || {};//global Backbone

app.InformaCamDocumentSourceView = Backbone.View.extend({
	el: '#ic_download_j3m',
	render: function() {
		this.$el.empty();
		$('<a>download JSON</a>').appendTo(this.$el).click( function() {
			 onDownloadRequested('j3m.json', this);
		});
		return this;
	},
});
