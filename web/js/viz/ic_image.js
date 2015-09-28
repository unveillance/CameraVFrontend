var app = app || {};//global Backbone

app.InformaCamImageView = Backbone.View.extend({
	el: '#ic_image_holder',
	render: function() {
		var json = this.model.toJSON().data;
		var img = 'med_' + json.file_name + '.jpg';

		getFileContent(this, [".data", app.docid, img].join('/'), function(data) {
			//this is totally hacky because getFileContent returns either a blob or a JSON object. It should put the blob *inside* the JSON object, so we could treat it the same regardless of what it returns
			if (data.responseText.indexOf('result') == -1) {
				//this seems inefficient (fetching image twice?), but I'll be damned if I can figure out how to get the base64-decoded blob to work as a background-image, even though it seems like it should work...
				this.$el.css('background-image', 'url(http://localhost:8889/files/.data/' + [app.docid, img].join('/') + ')');
			}
		});
		
		return this;
	},
});