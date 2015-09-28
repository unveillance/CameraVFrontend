var app = app || {};//global Backbone

app.InformaCamImageView = Backbone.View.extend({
	el: '#ic_image_holder',
	render: function() {
		
		var getAssetsByTagName = function(ctx, tag) {
			var tagged_assets = [];
			if(ctx["assets"]) {
				_.each(ctx["assets"], function(asset) {
					if(asset.tags && asset.tags.indexOf(tag) != -1) {
						tagged_assets.push(asset);
					}
				});
			}
			
			return tagged_assets;
		};

		var img = getAssetsByTagName(this.model.toJSON().data, UV.ASSET_TAGS.THUMB)[0].file_name;

		getFileContent(this, [".data", app.docid, img].join('/'), function(data) {
			//this is totally hacky because getFileContent returns either a blob or a JSON object. It should put the blob *inside* the JSON object, so we could treat it the same regardless of what it returns
			if (data.responseText.indexOf('result') == -1) {
				//this seems inefficient (fetching image twice?), but I'll be damned if I can figure out how to get the base64-decoded blob to work as a background-image, even though it seems like it should work...
				this.$el.css('background-image', 'url(/files/.data/' + [app.docid, img].join('/') + ')');
			}
		});
		
		return this;
	},
});