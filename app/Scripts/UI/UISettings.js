class UISettings 
{
	constructor()
	{
		this.windowSettingsButton = document.querySelector('.window-settings-button');
		this.windowSettingsCloseButton = document.querySelector('.oss-settings-close');
		this.windowModal = document.querySelector('.window-modal');
		this.windowSettingsBox = document.querySelector('.window-settings');
		this.dirInput = document.querySelector('.oss-settings-dirinput');
		this.saveDirButton = document.querySelector('.oss-settings-savedir');
		this.openDirButton = document.querySelector('.oss-settings-opendir');

		this.dirInput.value = OssPlayer.Settings.scanDir;

		this.windowSettingsButton.addEventListener('click', () => {
			this.Open();
		})

		this.windowSettingsCloseButton.addEventListener('click', () => {
			this.Close();
		})

		this.saveDirButton.addEventListener('click', () => {
			OssPlayer.Settings.SetScanDir(this.dirInput.value);
		});
		this.openDirButton.addEventListener('click', () => {
			var path = Remote.dialog.showOpenDialog({
				properties: ['openDirectory']
			})
			if(typeof path != 'undefined' && typeof path[0] != 'undefined')
			{
				this.dirInput.value = path[0];
				OssPlayer.Settings.SetScanDir(path[0]);
			}
		})
	}

	Open()
	{
		this.windowModal.removeAttribute('hide');
	}

	Close()
	{
		this.windowModal.setAttribute('hide','');
	}
}
