export let fileUtils = {
	openAlbum(): Promise<File> {
		return new Promise((resolve, reject) => {
			var fileDOM = document.createElement('input');
			fileDOM.setAttribute('type', 'file');
			document.body.appendChild(fileDOM);

			fileDOM.addEventListener('change', function () {
				resolve(this.files[0]);

				document.body.removeChild(fileDOM);

			}, false);

			fileDOM.click();
		});
	},

	imgDataURL2File(dataURL, fileName, options = {}): Promise<File> {
		return new Promise((resolve, reject) => {

			var imgDOM = new Image();
			var canvasDOM = document.createElement('canvas');
			var ctx = canvasDOM.getContext('2d');

			imgDOM.onload = function () {
				//裁剪
				canvasDOM.width = options['destWidth'] || imgDOM.width;
				canvasDOM.height = options['destHeight'] || imgDOM.height;

				//ctx.drawImage(imgDOM,0,0,null,null); 会出现全透明的情况
				if (options['imgWidth'] && options['imgHeight']) {
					ctx.drawImage(imgDOM, 0, 0, options['imgWidth'], options['imgHeight']);
				} else {
					ctx.drawImage(imgDOM, 0, 0);
				}

				canvasDOM.toBlob(function (blob) {
					var file = new File([blob], fileName);

					resolve(file);
				});

			};
			imgDOM.src = dataURL;
		});
	},

	File2DataURL(file): Promise<string> {
		return new Promise((resolve, reject) => {
			var fr = new FileReader();

			fr.onload = function (res) {
				resolve(res.target['result']);
			};

			fr.readAsDataURL(file);

		});
	}

};