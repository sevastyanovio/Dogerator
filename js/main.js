
var canvas = this.__canvas = new fabric.Canvas('canvas-area');

var result_button = $('#result-btn')
	.hide()
	.on('click', function () {
		location.href = canvas.toDataURL('image/png');
	});

var image_url_input = $('#get-image-uri')
	.keypress(function (event) {
		if (event.which === 13) {
			load_canvas(image_url_input.val());

			image_url_input.remove();
		}
	});

var doge;
var doge_url = 'http://i.imgur.com/o6nrZGs.png';

function load_canvas(url) {
	imgur.upload_and_get(url).then(function (image) {
		canvas.backgroundImage = image;

		canvas.setWidth(image.width);
		canvas.setHeight(image.height);
	});

	fabric.Image.fromURL(doge_url, function (doge_) {
		doge = doge_;

		doge.scale(0.5).setFlipX(true);
		canvas.add(doge);
	}, { crossOrigin: 'Anonymous' });

	result_button.show();
}


var imgur = {
	upload_and_get: function (url) {
		var deferred = $.Deferred();
		var self = this;

		this.uploadByURL(url).then(function (info) {
			// check

			fabric.Image.fromURL(info.data.link, function (image) {
				// check
				console.log('image', image);

				self.delete_(info.data.deletehash);

				deferred.resolve(image);
			}, { crossOrigin: 'Anonymous' });
		});

		return deferred;
	},

	uploadByURL: function (url) {
		return this._request('POST', 'https://api.imgur.com/3/upload', { image: url, type: 'URL' });
	},

	delete_: function (id) {
		return this._request('DELETE', 'https://api.imgur.com/3/image/' + id);
	},

	_client_id: '7e3fdefe2f96b21',

	_request: function (method, url, data) {
		return $.ajax({ method: method, url: url, data: data, dataType: 'json', headers: { Authorization: 'Client-ID ' + this._client_id } })
	}
};
