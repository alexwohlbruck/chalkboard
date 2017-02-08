var covers = [
    'https://goo.gl/OFZ4L0',
	'https://goo.gl/05ZAtu',
	'https://goo.gl/Zjiqc2',
	'https://goo.gl/3exoHX',
	'https://goo.gl/p9IMj7',
	'https://goo.gl/aINp0a',
	'https://goo.gl/7tPzc5',
	'https://goo.gl/n02BMT',
	'https://goo.gl/1oAcXK',
	'https://goo.gl/2sBgl9',
	'https://goo.gl/wZsMXQ',
	'https://goo.gl/Zqe8Vt',
	'https://goo.gl/hM4HKv',
	'https://goo.gl/fwtC0q',
	'https://goo.gl/NqewQu',
	'https://goo.gl/hJdhq7',
	'https://goo.gl/7Ar60Y',
	'https://goo.gl/2kQBFi',
	'https://goo.gl/CyXCLf',
	'https://goo.gl/c8pyWd',
	'https://goo.gl/4Y4DuZ',
	'https://goo.gl/4K97ZL',
	'https://goo.gl/abWYJg',
	'https://goo.gl/xuuBfL',
	'https://goo.gl/7v4D5L',
	'http://goo.gl/g0zjZT',
	'http://goo.gl/pns3DJ',
	'http://i.imgur.com/QuIE1tt.jpg',
	'http://i.imgur.com/YHtgbPE.jpg',
	'http://i.imgur.com/9sFnXQS.jpg',
	'http://i.imgur.com/bpy0dhK.jpg',
	'http://i.imgur.com/bX8bdAA.jpg',
	'http://i.imgur.com/yLdKGdO.jpg',
	'http://i.imgur.com/XhN4il1.jpg',
	'http://i.imgur.com/S7HKnnR.jpg',
	'http://i.imgur.com/87wD3yV.jpg',
	'http://i.imgur.com/0pZOZR5.jpg'
];

module.exports = {
    random: function() {
        return covers[Math.floor(Math.random() * covers.length)];
    }
};