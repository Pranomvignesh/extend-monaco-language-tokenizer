/** Monarch Tokenizer
 */
return {
	keywords: [
    'apple',
    'orange'
	],
	// The main tokenizer for language
	tokenizer: {
		root: [
			{ include: 'custom' }
		],
    custom : [
			[ 'someSampleWord','customClass' ],
			[ 'Array' , 'redClass']
    ]
	},
};
