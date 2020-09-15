async function main () {

    var themeModel,
        monarchModel,
        srcModel,
        themeContainer,
        monarchContainer,
        srcContainer,
        valOf,
        theme,
        monarch,
        src;

    async function saveValue () {
        theme = await fetch('./theme.js').then(response => response.text());
        monarch = await fetch('./monarch.js').then(response => response.text());
        src = await fetch('./src.js').then(response => response.text());

        valOf = {
            theme: themeContainer ? themeContainer.getValue() : theme,
            monarch: monarchContainer ? monarchContainer.getValue() : monarch,
            src: srcContainer ? srcContainer.getValue() : src
        }
    }
    await saveValue();

    const ctaBtn = document.querySelector('.callToActionBtn button');
    ctaBtn.addEventListener('click', function () {
        /**
         * Complete monaco instance is flushed here
         */
        delete window.monaco;
        saveValue();
        require.reset();
        var scriptToDelete = document.head.querySelector('#loader');
        // All Added script tags are removed
        while (scriptToDelete) {
            let temp = scriptToDelete;
            scriptToDelete = scriptToDelete.nextElementSibling;
            document.head.removeChild(temp);
        }
        initiateMonaco();
    });

    function loadScript (url, appendTo, attrs, callback) {
        const script = document.createElement('script');
        for (let attr in attrs) {
            script.setAttribute(attr, attrs[attr]);
        }
        script.src = url;
        script.onload = callback;
        appendTo.appendChild(script)
    }

    function initiateMonaco () {
        require.config({
            paths: {
                vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs"
            }
        })
        require(['vs/editor/editor.main'], createEditor);
        async function createEditor () {
            const srcDiv = document.querySelector('.srcDiv');
            const monarchDiv = document.querySelector('.monarchDiv');
            const themeDiv = document.querySelector('.themeDiv');
            const updateLangConf = async function () {
                srcDiv.innerHTML = '';
                monarchDiv.innerHTML = '';
                themeDiv.innerHTML = '';

                /**
                 * For demonstration purpose eval is used ... 
                 * ! Dont use it in production
                 */
                const monarchObject = eval('(function(){' + valOf.monarch + '}())')
                eval(valOf.theme);

                /**
                 * Actual Extending Code Starts here
                 * 
                 * This code first gets the configuration for the desired language (here, it is javascript)
                 * Then the loader function for it is called and then the configuration of the language is constructed
                 * This language object is then altered without modifying its base reference
                 * Thus our custom monarch tokens are embedded into the language object
                 * 
                 * Advantages 
                 *  - Extends Javascript language with custom keywords
                 *  - Custom syntax highlighting can be achieved from this
                 * 
                 * Disadvantages
                 *  - This has to be done before creation of any model (or) editor in monaco, 
                 *    As, once created the language configuration is somehow cached inside the monaco instance
                 *  - Thus monarch tokens cannot be added in runtime
                 * 
                 * Take Away 
                 *  - As the configuration is more likely to be static and in many cases it doesn't change in runtime
                 *    So, This method can be used to set the initial configuration for the desired language
                 * 
                 *  If you want to alter the monarch token in runtime, you may need a new monaco instance
                 *  Here, in this playground, everytime the monaco instance is recreated
                 * 
                 * 
                 */
                const allLangs = monaco.languages.getLanguages();
                const { conf, language: jsLang } = await allLangs.find(({ id }) => id === 'javascript').loader();
                for (let key in monarchObject) {
                    const value = monarchObject[key];
                    if (key === 'tokenizer') {
                        for (let category in value) {
                            const tokenDefs = value[category];
                            if (!jsLang.tokenizer.hasOwnProperty(category)) {
                                jsLang.tokenizer[category] = [];
                            }
                            if (Array.isArray(tokenDefs)) {
                                jsLang.tokenizer[category].unshift.apply(jsLang.tokenizer[category], tokenDefs)
                            }
                        }
                    } else if (Array.isArray(value)) {
                        if (!jsLang.hasOwnProperty(key)) {
                            jsLang[key] = [];
                        }
                        jsLang[key].unshift.apply(jsLang[key], value)
                    }
                }
                /* Actual Extending Code Starts here */


                themeModel = monaco.editor.createModel(valOf.theme, 'javascript');
                monarchModel = monaco.editor.createModel(valOf.monarch, 'javascript');
                srcModel = monaco.editor.createModel(valOf.src, 'javascript');

                srcContainer = monaco.editor.create(srcDiv, {
                    wordWrap: 'on',
                    fontSize: '14px',
                    theme: 'myCustomTheme',
                    tabSize : 2,
                })
                monarchContainer = monaco.editor.create(monarchDiv, {
                    wordWrap: 'on',
                    fontSize: '14px',
                    tabSize : 2
                })
                themeContainer = monaco.editor.create(themeDiv, {
                    wordWrap: 'on',
                    fontSize: '14px',
                    tabSize : 2
                })
                srcContainer.setModel(srcModel);
                monarchContainer.setModel(monarchModel);
                themeContainer.setModel(themeModel);
            }
            updateLangConf();
        }
    }
    initiateMonaco();
}
main();

