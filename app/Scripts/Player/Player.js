class Player extends EventEmitter{
	constructor()
	{
		super();
		this.songTitle = document.querySelector('.song-title');
		this.songArtist = document.querySelector('.song-artist');
		this.songProgressBar = document.querySelector('.song-progress-bar');

		this.audio = new Audio();
		this.audio.volume = 0.1;

		this.audio.addEventListener('timeupdate', () => {
			this.UpdateProgressBar();
		});

		this.audio.addEventListener('ended', () => {
			this.NextSong()
		});

		this.currentMapPlaying = null;
		this.isSeeking = false;

		window.addEventListener('mouseup', () => {
			this.isSeeking = false;
		});

		this.songProgressBar.addEventListener('mousedown', () => {
			this.isSeeking = true;
		});

		this.songProgressBar.addEventListener('mousemove', (e) => {
			if(this.isSeeking){this.Seek(e);}
		});

		this.songProgressBar.addEventListener('click', (e) => {
			this.Seek(e);
		});

		Remote.getCurrentWindow().on('blur', () => {
			this.isSeeking = false;
		})
	}

	Seek(e)
	{
		console.log(e.layerX)
		var trackbarWidth = parseInt(getComputedStyle(this.songProgressBar, null).width);
		var time = 100 * (e.layerX / trackbarWidth);
		var timeToSeek = ((this.audio.duration / 100) * time);
		if(!isNaN(timeToSeek)){
			this.audio.pause();
			this.audio.currentTime = timeToSeek;
			this.audio.play();
		}
	}

	UpdateProgressBar()
	{
		this.songProgressBar.style.backgroundSize = (100 * (this.audio.currentTime / this.audio.duration))+"% 100%";
	}

	StartPlay(mapID)
	{
		var playlist = OssPlayer.Playlists.GetCurrentPlaylistView();
		if(playlist == null)
		{
			this._Play(playlist, mapID);
			OssPlayer.Playlists.SetCurrentPlaylist(playlist);
		}
	}

	Play(mapID)
	{
		var playlist = OssPlayer.Playlists.GetCurrentPlaylist();
		if(playlist == null)
		{
			this._Play(playlist, mapID);
			OssPlayer.Playlists.SetCurrentPlaylist(playlist);
		}
	}

	_Play(playlist, mapID)
	{
		if(typeof OssPlayer.Cache.Maps[mapID] != 'undefined')
		{
			var mapData = OssPlayer.Cache.Maps[mapID];
			this.songTitle.innerText = mapData.titleUnicode != ''? mapData.titleUnicode : mapData.title;
			this.songArtist.innerText = mapData.artistUnicode != ''? mapData.artistUnicode : mapData.artist;

			var audioFile = Path.join(OssPlayer.Cache.Maps[mapID].basepath, OssPlayer.Cache.Maps[mapID].audioFile.trim());
			this.audio.src = audioFile;
			this.audio.play();
			this.currentMapPlaying = mapID;
		}
	}

	NextSong()
	{
		if(this.currentMapPlaying != null)
		{
			var playlist = OssPlayer.Playlists.GetCurrentPlaylist();
			var playlistMaps = OssPlayer.Playlists.GetPlaylistMaps(playlist);
			var indexOfMapID = playlistMaps.indexOf(this.currentMapPlaying);
			if(indexOfMapID >= 0)
			{
				if(indexOfMapID + 1 < playlistMaps.length)
				{
					var mapID = playlistMaps[indexOfMapID + 1];
					this.Play(mapID);
				}
				else if(playlistMaps.length > 0)
				{
					var mapID = playlistMaps[0];
					this.Play(mapID);
				}
			}
		}
	}
}
