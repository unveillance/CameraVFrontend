function discoverICDropzones(dz_profile, el, onSuccess, onError, onFileAdded) {
	if(!el) { el = "#content"; }
	
	file_zones = $(el).find("input:file");
	
	$.each(file_zones, function(idx, item) {
		var param_name = $(item).attr('name');
		var max_files = $(item).attr('rel');
	
		var dz_profile_ = _.clone(dz_profile);
		dz_profile_.paramName = param_name;
		dz_profile_.maxFiles = max_files ? max_files : 1;
		dz_profile.uploadMultiple = dz_profile_.maxFiles > 1 ? true : false;
		
		var dropzone_id = param_name.replace(/\./g, "_") + "_dropzone";
		var mandatory = $(item).hasClass('uv_mandatory');

		$($(item).parent()).append($(document.createElement('div'))
			.attr({ 'id' : dropzone_id, 'name' : param_name })
			.addClass('uv_dropzone_holder' + (mandatory ? ' uv_mandatory_dz' : "")));
		$(item).remove();

		dz_profile_.error = function(file, message) {
			file.previewElement.classList.add("dz-error");
			console.error('dz_profile_.error');
			console.error(message);
			console.error(message.data);
//			location.href = '/submission/' + message.data._id + '/';
			messagetext = '';
			if (typeof message !== null && typeof message === 'object') {
				if (message.result == 403) {
					messagetext = "It's not you, it's us. We're looking into the problem. Please try again later. (403)";
	//				this.removeAllFiles();
				}
			} else {
				messagetext = message;
			}
			return file.previewElement.querySelector("[data-dz-errormessage]").textContent = messagetext;
		}

      		dropzones.push(new InformacamDropzone(dropzone_id, dz_profile_, 
			onSuccess, onError, onFileAdded));
	});
	
	return dropzones;
}

var InformacamDropzone = UnveillanceDropzone.extend({
	onFileAdded: function(file) {
		console.info("added file:");
		console.info(file);
		$('#ic_upload_instructions_holder').hide();
	}
});