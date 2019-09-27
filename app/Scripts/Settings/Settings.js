class Settings extends EventEmitter
{
	constructor()
	{
		super();
		this.volume = 50;
		this.scanDir = '';
	}

	Init()
	{
		this.LoadSettings();
	}

	SetScanDir(path)
	{
		this.scanDir = path;
		this.SaveSettings();
		this.emit('valueUpdate', 'scanDir');
	}

	SetVolume(volume)
	{
		this.volume = volume;
		this.SaveSettings();
		this.emit('valueUpdate', 'volume');
	}

	SaveSettings()
	{
		var settings = {
			volume: this.volume,
			scanDir: this.scanDir
		}
		Fs.writeFileSync('settings.json', JSON.stringify(settings));
	}

	LoadSettings()
	{
		try{
			var settings = JSON.parse(Fs.readFileSync('settings.json').toString());
			this.volume = settings.volume;
			this.scanDir = settings.scanDir;
			this.emit('load');
		}catch(e)
		{
			this.SaveSettings();
		}
	}
}
