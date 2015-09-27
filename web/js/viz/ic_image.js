var app = app || {};//global Backbone

app.InformaCamImageView = Backbone.View.extend({
	el: '#ic_image_holder',
	render: function() {
		var json = this.model.toJSON().data;
//		this.$el.css('background-image', 'url(med_' + json.file_name + '.jpg)');
		this.$el.css('background-image', 'url(http://localhost:8888/web/images/bt_search_plus.png)');
		$c(this.$el);
		return this;
	},
});