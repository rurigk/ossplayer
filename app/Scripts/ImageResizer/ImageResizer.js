class ImageResizer extends EventEmitter
{
	constructor()
	{
		super();
		this.canvas = document.createElement('canvas');
		this.canvas.width = 256; // 512
		this.canvas.height = 144; // 288
		this.context = this.canvas.getContext('2d');
		this.context.fillStyle = "#FFF";

		this.queue = [];
		this.queueActive = false;
	}

	AddImageToQueue(inputPath, outputPath)
	{
		this.queue.push([inputPath, outputPath]);
		if(!this.queueActive)
		{
			try {
				Fs.accessSync('bgcache', Fs.constants.F_OK);
			}catch(e)
			{
				Fs.mkdirSync('bgcache');
			}
			this.emit('QueueStart');
			this.ProcessQueue();
		}
	}

	ProcessQueue()
	{
		if(this.queue.length > 0)
		{
			this.emit('QueueProgress', {
				remain: this.queue.length
			});
			this.queueActive = true;
			this.ResizeImage(this.queue[0][0], this.queue[0][1], () => {
				this.queue.shift();
				this.ProcessQueue();
			});
		}else{
			this.queueActive = false;
			this.emit('QueueEnd');
		}
	}

	ResizeImage(inputPath, outputPath, callback)
	{
		try {
			Fs.accessSync(outputPath, Fs.constants.F_OK);
			callback();
		} catch (err) {
			var image = document.createElement('img');
			image.addEventListener('load', () => {
				this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
				this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
				var base64img = this.canvas.toDataURL("image/jpeg", 1.0);
				var base64Data = base64img.replace(/^data:[A-Za-z-+\/]+;base64,/, "");

				//console.log('Write:' + outputPath);
				Fs.writeFileSync(outputPath, base64Data, {
					encoding : 'base64'
				});
					
				callback();
			});
			image.src = inputPath;
		}
	}
}
