const Remote = require('electron').remote;
const EventEmitter = require('events');
const Fs = require('fs');
const Path = require('path');
const Os = require('os');
var Puid = new require('puid');

const OssParser = require('./Scripts/Parser/Parser.js');

var OssPlayer = {};

window.addEventListener('load', () =>{
	OssPlayer.UI = {};
	OssPlayer.Player = new Player();
	OssPlayer.Playlists = new Playlists();
	OssPlayer.ImageResizer = new ImageResizer();
	OssPlayer.Parser = new OssParser();
	OssPlayer.Settings = new Settings();
	OssPlayer.Cache = {
		Maps: {}
	};
	OssPlayer.UI = {};
	OssPlayer.UI.UIMapsList = new UIMapsList();

	OssPlayer.Parser.on('parseEnd', () => {
		Object.assign(OssPlayer.Cache.Maps, OssPlayer.Parser.parsedMaps); // Copy object
		OssPlayer.UI.UIMapsList.UpdateDom();
		for(var mapID in OssPlayer.Cache.Maps)
		{
			if(OssPlayer.Cache.Maps[mapID].backgroundImage != '')
			{
				var outputPath = Path.join('bgcache', OssPlayer.Cache.Maps[mapID].beatmapID + '.jpg');
				OssPlayer.ImageResizer.AddImageToQueue(OssPlayer.Cache.Maps[mapID].backgroundImage, outputPath);
			}
		}
	});

	OssPlayer.Settings.on('valueUpdate', (valuename) => 
	{
		if (valuename == 'scanDir')
		{
			try {
				Fs.accessSync(OssPlayer.Settings.scanDir, Fs.constants.F_OK);
				OssPlayer.Parser.ParseDir(OssPlayer.Settings.scanDir);
			} catch (err) {
				console.log('Directory not exist', err)
			}
		}
	})

	OssPlayer.Settings.on('load', () => 
	{
		try {
			Fs.accessSync(OssPlayer.Settings.scanDir, Fs.constants.F_OK);
			OssPlayer.Parser.ParseDir(OssPlayer.Settings.scanDir);
		} catch (err) {
			console.log('Directory not exist', err)
		}
	})

	OssPlayer.Settings.Init();

	if(OssPlayer.Settings.scanDir == '')
	{
		var userHomePath = Remote.app.getPath('home');
		var osuDefaultPath = Path.join(userHomePath,'AppData','Local','osu!','Songs');
		try {
			Fs.accessSync(osuDefaultPath, Fs.constants.F_OK);
			OssPlayer.Settings.SetScanDir(osuDefaultPath);
		} catch (err) {}
	}

	OssPlayer.UI.UISettings = new UISettings();

	OssPlayer.Playlists.SetCurrentPlaylist(null);
	OssPlayer.Playlists.SetCurrentPlaylistView(null);
});
