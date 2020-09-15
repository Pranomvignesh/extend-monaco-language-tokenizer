/** Theme configuration
 */
monaco.editor.defineTheme('myCustomTheme', {
	base: 'vs', 
	inherit: true,
	rules: [
		{ 
			token: 'customClass', 
			foreground: 'ffa500',
			fontStyle: 'italic underline' 
		},
		{ 
			token: 'redClass', 
			foreground: 'ff0000'
		}
	]
});