const Fs = require('fs');
const Path = require('path');
const Os = require('os');
const EventEmitter = require('events');

class OssParser extends EventEmitter
{
	constructor()
	{
		super();
		this.parserFileList = [];
		this.parsedMaps = {};

		this.beatmapIDRegex = /BeatmapID:(.+)/;

		this.titleRegex = /Title:(.+)/;
		this.titleUnicodeRegex = /TitleUnicode:(.+)/;
		this.artistRegex = /Artist:(.+)/;
		this.artistUnicodeRegex = /ArtistUnicode:(.+)/;

		this.creatorRegex = /Creator:(.+)/;
		this.audioFilenameRegex = /AudioFilename:(.+)/;

		this.backgroundImageRegex = /0,0,"(.+)"/;
	}

	ParseDir(dirPath)
	{
		this.ScanDir(dirPath);
		for (var i = 0; i < this.parserFileList.length; i++) {
			this.ParseFile(this.parserFileList[i]);
		}
		this.emit('parseEnd');
	}

	ParseFile(filePath)
	{
		var dataToParse = Fs.readFileSync(filePath).toString();

		var beatmapID = Path.basename(Path.dirname(filePath));
		beatmapID = beatmapID.substr(0,beatmapID.indexOf(" "));

		var titleMatch = this.titleRegex.exec(dataToParse);
		var titleUnicodeMatch = this.titleUnicodeRegex.exec(dataToParse);
		var artistMatch = this.artistRegex.exec(dataToParse);
		var artistUnicodeMatch = this.artistUnicodeRegex.exec(dataToParse);

		var creatorMatch = this.creatorRegex.exec(dataToParse);
		var backgroundImageMatch = this.backgroundImageRegex.exec(dataToParse);
		var audioFile = this.audioFilenameRegex.exec(dataToParse);

		var ossSong = new OssSong();

		ossSong.beatmapID = beatmapID;
		ossSong.title = titleMatch != null ? titleMatch[1] : '';
		ossSong.titleUnicode = titleUnicodeMatch != null ? titleUnicodeMatch[1] : '';
		ossSong.artist = artistMatch != null ? artistMatch[1] : '';
		ossSong.artistUnicode = artistUnicodeMatch != null ? artistUnicodeMatch[1] : '';
		ossSong.creator = creatorMatch != null ? creatorMatch[1] : '';
		ossSong.backgroundImage = backgroundImageMatch != null ? Path.join(Path.dirname(filePath), backgroundImageMatch[1]) : '';
		ossSong.audioFile = audioFile != null ? audioFile[1] : '';

		ossSong.basepath = Path.dirname(filePath);

		this.parsedMaps[beatmapID] = ossSong;
	}

	ScanDir(dirPath)
	{
		// Clean the parser file list
		this.parserFileList = [];

		// List "Songs" dir
		var candidateDirs = Fs.readdirSync(dirPath);
		// Search for valid files in candidate dirs
		for (var dirsIndex = 0; dirsIndex < candidateDirs.length; dirsIndex++) {
			// Compose the path
			var composedCandidateDir = Path.join(dirPath, candidateDirs[dirsIndex]);
			// List files in candidate dir
			var candidateFiles = Fs.readdirSync(composedCandidateDir);
			// Search for .osu file in the list
			var osuFile = '';
			for (var filesIndex = 0; filesIndex < candidateFiles.length; filesIndex++) {
				// Extract the extension of the file
				var fileExtension = Path.extname(candidateFiles[filesIndex]);
				// Check if the extension is .osu
				if(fileExtension == '.osu')
				{
					// Save the file name and break the cycle
					osuFile = candidateFiles[filesIndex];
					break;
				}
			}

			// Check if the osu file is founded
			if(osuFile != '')
			{
				// Compose the osu file path and push to the parser file list
				var osuFilePath = Path.join(dirPath, candidateDirs[dirsIndex], osuFile);
				this.parserFileList.push(osuFilePath);
			}
		}
	}
}

class OssSong
{
	constructor()
	{
		this.beatmapID = 0;
		this.title = '';
		this.titleUnicode = '';
		this.artist = '';
		this.artistUnicode = '';
		this.creator = '';
		this.audioFilename = '';
		this.backgroundImage = '';
		this.basepath = '';
	}
}

module.exports = OssParser;
