class UIMapsList extends EventEmitter
{
	constructor()
	{
		super();

		this.songsList = document.querySelector('.songs-list');

		this.domElements = {}

		OssPlayer.Playlists.on('playlistChanged', () => {
			this.UpdateSongsList();
		})

		OssPlayer.ImageResizer.on('QueueProgress', () => {
			this.UpdateBackgrounds();
		})

		OssPlayer.ImageResizer.on('QueueEnd', () => {
			this.UpdateBackgrounds();
		})

		this.songsList.addEventListener('scroll', () => {
			this.UpdateBackgrounds();
		})
	}

	UpdateDom()
	{
		this.domElements = {}; // Posible memory leak
		for(var mapID in OssPlayer.Cache.Maps)
		{
			this.domElements[mapID] = this.CreateSongItem(OssPlayer.Cache.Maps[mapID]);
		}
	}

	UpdateSongsList()
	{
		this.RemoveDomChilds();
		var mapsIDs = OssPlayer.Playlists.GetPlaylistMaps(OssPlayer.Playlists.GetCurrentPlaylistView());
		for (var i = 0; i < mapsIDs.length; i++) {
			this.songsList.appendChild(this.domElements[mapsIDs[i]]);
		}
		this.UpdateBackgrounds();
	}

	UpdateBackgrounds()
	{
		for (var i = 0; i < this.songsList.childNodes.length; i++) {
			var item = this.songsList.childNodes[i];
			var itemPlayButton = item.querySelector('.song-list-item-play');

			var listScroll = this.songsList.scrollTop;
			var listHeight = this.songsList.offsetHeight;

			var itemTop = item.offsetTop;
			var itemHeight = item.offsetHeight;

			if(
				(itemTop >= listScroll - 500) &&
				(itemTop + itemHeight <= (listScroll + listHeight) + 500)
			)
			{
				var mapID = item.getAttribute('mapid');
				var thumbnailPath = `bgcache/${mapID}.jpg`;
				try{
					Fs.accessSync(thumbnailPath, Fs.constants.F_OK);
					itemPlayButton.style.backgroundImage = `url("../bgcache/${mapID}.jpg")`;
				}catch(e){}
			}else{
				itemPlayButton.style.backgroundImage = '';
			}
		}
	}

	RemoveDomChilds()
	{
		while (this.songsList.firstChild) {
			this.songsList.removeChild(this.songsList.firstChild);
		}
	}

	CreateSongItem(mapData)
	{
		//console.log(mapData);
		// Main element
		var songListItem = document.createElement('div');
		// Childen
		var songListItemPlay = document.createElement('div');
		var songListItemInfo = document.createElement('div');
		var songListItemControls = document.createElement('div');
		// Info children
		var songListItemTitle = document.createElement('div');
		var songListItemArtist = document.createElement('div');
		var songListItemCreator = document.createElement('div');

		// Build
		songListItem.appendChild(songListItemPlay);
		songListItem.appendChild(songListItemInfo);
		songListItem.appendChild(songListItemControls);

		songListItemInfo.appendChild(songListItemTitle);
		songListItemInfo.appendChild(songListItemArtist);
		songListItemInfo.appendChild(songListItemCreator);

		// Main element classes
		songListItem.classList.add('songs-list-item');
		// Childen classes
		songListItemPlay.classList.add('song-list-item-play');
		songListItemInfo.classList.add('songs-list-item-info');
		songListItemControls.classList.add('songs-list-item-controls');
		// Info children classes
		songListItemTitle.classList.add('songs-list-item-title');
		songListItemArtist.classList.add('songs-list-item-artist');
		songListItemCreator.classList.add('songs-list-item-creator');

		songListItem.setAttribute('mapid', mapData.beatmapID);

		songListItemPlay.addEventListener('click', () => {
			OssPlayer.Player.StartPlay(mapData.beatmapID);
		});

		songListItemTitle.innerText = mapData.titleUnicode != ''? mapData.titleUnicode : mapData.title;
		songListItemArtist.innerText = mapData.artistUnicode != ''? mapData.artistUnicode : mapData.artist;
		songListItemCreator.innerText = mapData.creator;

		return songListItem;
	}
}
