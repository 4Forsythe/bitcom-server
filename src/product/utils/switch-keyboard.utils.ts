const ruLayout = {
	q: 'й',
	w: 'ц',
	e: 'у',
	r: 'к',
	t: 'е',
	y: 'н',
	u: 'г',
	i: 'ш',
	o: 'щ',
	p: 'з',
	'[': 'х',
	']': 'ъ',
	a: 'ф',
	s: 'ы',
	d: 'в',
	f: 'а',
	g: 'п',
	h: 'р',
	j: 'о',
	k: 'л',
	l: 'д',
	';': 'ж',
	"'": 'э',
	z: 'я',
	x: 'ч',
	c: 'с',
	v: 'м',
	b: 'и',
	n: 'т',
	m: 'ь',
	',': 'б',
	'.': 'ю',
	'/': '.'
}

const enLayout = {
	й: 'q',
	ц: 'w',
	у: 'e',
	к: 'r',
	е: 't',
	н: 'y',
	г: 'u',
	ш: 'i',
	щ: 'o',
	з: 'p',
	х: '[',
	ъ: ']',
	ф: 'a',
	ы: 's',
	в: 'd',
	а: 'f',
	п: 'g',
	р: 'h',
	о: 'j',
	л: 'k',
	д: 'l',
	ж: ';',
	э: "'",
	я: 'z',
	ч: 'x',
	с: 'c',
	м: 'v',
	и: 'b',
	т: 'n',
	ь: 'm',
	б: ',',
	ю: '.',
	'.': '/'
}

export const switchKeyboard = (input: string): { en: string; ru: string } => {
	const ru = input
		.split('')
		.map((char) => ruLayout[char] || char)
		.join('')

	const en = input
		.split('')
		.map((char) => enLayout[char] || char)
		.join('')

	return { ru, en }
}
