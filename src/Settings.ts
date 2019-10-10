export class Settings {

    public static settings = {
        
        // Simulation
        simInterval: 500,

        // Hunting
        huntingSuccess: 40,
        maxHuntingFoodGain: 25,
    };

    private static settingsMeta = [{
        id: 'simInterval',
        name: 'Simulation Speed',
        min: 1, 
        max: 950
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
    }];

    private static sliders = [];

    public static init() {
        
        // Create Value Sliders
        var container = document.getElementById('sliders');

        for (var i = 0; i < this.settingsMeta.length; i++) {
            let setting = this.settingsMeta[i];

            var settingContainer = document.createElement('div');

            var slider = document.createElement('input');
            slider.type = 'range';
            slider.min = setting.min.toString();
            slider.max = setting.max.toString();
            slider.value = this.settings[setting.id].toString();
            slider.className = 'slider';
            slider.onchange = (ev => {
                this.updateSlider(ev.srcElement);
            });
            this.sliders.push(slider);

            var label = document.createElement('h5');
            label.innerText = setting.name;

            settingContainer.appendChild(label);
            settingContainer.appendChild(slider);
            container.appendChild(settingContainer);
        }
    }

    private static updateSlider(slider) {
        let idx = this.sliders.indexOf(slider);
        this.settings[this.settingsMeta[idx].id] = slider.value;
    }
}