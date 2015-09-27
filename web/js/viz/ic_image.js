var app = app || {};//global Backbone

app.InformaCamImageView = Backbone.View.extend({
	el: '#ic_image_holder',
	render: function() {
		var json = this.model.toJSON().data;
		img = 'file/' + json.base_path + '/med_' + json.file_name + '.jpg';
		$c(json);
		$c(img);
//		this.$el.css('background-image', 'url(' + img + ')');
		this.$el.css('background-image', 'url(http://localhost:8888/web/images/bt_search_plus.png)');
		return this;
	},
});