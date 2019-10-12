export class Settings {

    public static settings = {
        
        // Simulation
        simInterval: 500,

        // Hunting
        huntingSuccess: 35,
        maxHuntingFoodGain: 25,
        
        // Trading
        enableTrade: true,
    };

    private static settingsMeta = [{
        id: 'simInterval',
        name: 'Simulation Speed',
        min: 1, 
        max: 999
    }, {
        id: 'huntingSuccess',
        name: 'Hunting Success %',
        min: 0, 
        max: 100
    }, {
        id: 'maxHuntingFoodGain',
        name: 'Max. Hunting Food Gain',
        min: 1, 
        max: 100
    }, {
        id: 'enableTrade',
        name: 'Enable Trade',
        type: 'bool'
    }];

    private static inputElements = [];

    public static init() {
        
        // Create Value Sliders
        var container = document.getElementById('sliders');

        for (var i = 0; i < this.settingsMeta.length; i++) {
            let setting = this.settingsMeta[i];

            var settingContainer = document.createElement('div');

            let type = 'number';
            if (setting.type) {
                type = setting.type;
            }

            if (type === 'number') {
                var slider = document.createElement('input');
                slider.type = 'range';
                slider.min = setting.min.toString();
                slider.max = setting.max.toString();
                slider.value = this.settings[setting.id];
                slider.className = 'slider';
                slider.onchange = (ev => {
                    this.updateSlider(ev.srcElement);
                });
                this.inputElements.push(slider);

                var label = document.createElement('h5');
                label.innerText = setting.name;

                var text = document.createElement('input');
                text.disabled = true;
                text.className = 'value-text';
                text.value = this.settings[setting.id];

                settingContainer.appendChild(label);
                settingContainer.appendChild(slider);
                settingContainer.appendChild(text);
            }
            else if (type === 'bool') {
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = this.settings[setting.id] === true;
                checkbox.onclick = (ev => {
                    this.updateCheckbox(ev.srcElement);
                });
                this.inputElements.push(checkbox);

                var label = document.createElement('h5');
                label.innerText = setting.name;

                settingContainer.appendChild(label);
                settingContainer.appendChild(checkbox);
            }


            container.appendChild(settingContainer);
        }
    }

    private static updateSlider(slider) {
        let idx = this.inputElements.indexOf(slider);
        this.settings[this.settingsMeta[idx].id] = slider.value;

        // Set Value Text Element
        slider.parentElement.getElementsByClassName('value-text')[0].value = slider.value;
    }

    private static updateCheckbox(checkbox) {
        let idx = this.inputElements.indexOf(checkbox);
        this.settings[this.settingsMeta[idx].id] = checkbox.checked;
    }
}