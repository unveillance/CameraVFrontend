var app = app || {};//global Backbone

app.InformaCamAssetBrowserView = Backbone.View.extend({
	el: '#cv_export_view_holder',
	template: getTemplate("asset_browser.html"),
	render: function() {
		var html = Mustache.to_html(this.template, this.model.attributes.data);
		this.$el.html(html);
		return this;
	},
});
