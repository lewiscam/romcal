
var calendar = require('node-calendar'),
	moment = require('moment'),
	twix = require('twix'),
	lodash = require('lodash'),
	cheerio = require('cheerio');


/**
  * This algorithm is based on the algorithm of Oudin (1940) and quoted in
  *	"Explanatory Supplement to the Astronomical Almanac", P. Kenneth
  *	Seidelmann, editor.
  */
function _dateOfEaster( year ) {

	var century = Math.floor(year/100),
     	N = year - 19*Math.floor(year/19),
    	K = Math.floor((century - 17)/25),
    	I = century - Math.floor(century/4) - Math.floor((century - K)/3) + 19*N + 15;

    I = I - 30*Math.floor((I/30));
    I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
    
    var J = year + Math.floor(year/4) + I + 2 - century + Math.floor(century/4);
    J = J - 7*Math.floor(J/7);
    
    var L = I - J,
    	M = 3 + Math.floor((L + 40)/44),
    	D = L + 28 - 31*Math.floor(M/4);

    // For moment
    M = M - 1;

    var M = (M < 10) ? '0' + M : M,
    	D = (D < 10) ? '0' + D : D;

    return moment({ year: year, month: M, day: D });
}

function _movableSolemnities( easter, firstSundayOfAdvent ) {
	var dates = {
		octaveOfEaster: moment.twix( easter, moment(easter).add('days', 8 ) ),
		ascensionOfTheLord: moment(easter).add('days', 39 ),
		pentecostSunday: moment(easter).add('days', 49 ),
		trinitySunday: moment(easter).add('days', 56 ),
		corpusChristi: moment(easter).add('days', 63 ),
		sacredHeart: moment(easter).add('days', 68 ),
		christTheKing: moment(firstSundayOfAdvent).subtract('days', 7 ), 
		ashWednesday: moment(easter).subtract('days', 46 ),
		palmSunday: moment(easter).subtract('days', 7 ),
		holyThursday: moment(easter).subtract('days', 3 ),
		goodFriday: moment(easter).subtract('days', 2 ),
		holySaturday: moment(easter).subtract('days', 1 ),
	};


	return dates;
}

function _feastsOfTheLord( christmas ) {

	var year = christmas.year(), 
		dates = {
			presentationOfTheLord: moment({year:year, month: 1, day: 2}),
			transfiguration: moment({year:year, month: 7, day: 6}),
			triumphOfTheCross: moment({year:year, month: 8, day: 14})
		};

	if ( christmas.day() === 0 )
		dates.holyFamily = moment({year: year, month: 11, day: 30});
	else
		dates.holyFamily = moment(christmas).add('days', 7);

	return dates
}

function _fixedSolemnities( year ) {
	var dates = {
			maryMotherOfGod: moment({year:year, month: 0, day: 1}),
			epiphanyOfOurLord: moment({year:year, month: 0, day: 6}), // May be a movable Solemnity depending on National Conference
			josephHusbandOfMary: moment({year:year, month: 2, day: 19}),
			annunciation: moment({year:year, month: 2, day: 25}),
			birthOfJohnTheBaptist: moment({year:year, month: 5, day: 24}),
			peterAndPaulApostles: moment({year:year, month: 5, day: 29}),
			assumption: moment({year:year, month: 7, day: 15}),
			allSaints: moment({year:year, month: 10, day: 1}),
			immaculateConception: moment({year:year, month: 11, day: 8}),
			christmas: moment({year:year, month: 11, day: 25})
		};
	return dates;
}

function _adventSeason( christmas ) {

	var dates = {};
		lengthOfAdvent = 0,
		firstSundayOfAdvent = null;

    // The length of Advent depends upon the day of the week on which Christmas occurs
    switch ( christmas.day() ) {
    	case 0:
    		lengthOfAdvent = 28;
    		firstSundayOfAdvent = moment({ year: christmas.year(), month: 10, day: 27 });
    		break;
    	case 1:
    		lengthOfAdvent = 22;
    		firstSundayOfAdvent = moment({ year: christmas.year(), month: 11, day: 3 });
    		break;
    	case 2:
    		lengthOfAdvent = 23;
    		firstSundayOfAdvent = moment({ year: christmas.year(), month: 11, day: 2 });
    		break;
    	case 3:
    		lengthOfAdvent = 24;
    		firstSundayOfAdvent = moment({ year: christmas.year(), month: 11, day: 1 });
    		break;
    	case 4:
    		lengthOfAdvent = 25;
    		firstSundayOfAdvent = moment({ year: christmas.year(), month: 10, day: 30 });
    		break;
    	case 5:
    		lengthOfAdvent = 26;
    		firstSundayOfAdvent = moment({ year: christmas.year(), month: 10, day: 29 });
    		break;
    	case 6:
    		lengthOfAdvent = 27;
    		firstSundayOfAdvent = moment({ year: christmas.year(), month: 10, day: 28 });
    		break;
    	default:
    		break;
    }

    dates.firstSundayOfAdvent = firstSundayOfAdvent;
    dates.secondSundayOfAdvent = moment(dates.firstSundayOfAdvent).add('days', 7 );
    dates.thirdSundayOfAdvent = moment(dates.secondSundayOfAdvent).add('days', 7 );
    dates.fourthSundayOfAdvent = moment(dates.thirdSundayOfAdvent).add('days', 7 );

    return dates;
}

module.exports = {

	dates: function( year ) {

		if ( lodash.isEmpty( year ) )
			year = moment().year();

		var easter = _dateOfEaster( year ),
			fixedSolemnities = _fixedSolemnities( year ),
			adventSeason = _adventSeason( fixedSolemnities.christmas ),
			movableSolemnities = _movableSolemnities( easter, adventSeason.firstSundayOfAdvent ),
			feastsOfTheLord = _feastsOfTheLord( fixedSolemnities.christmas );

		console.log( adventSeason.firstSundayOfAdvent.toString() );
		console.log( adventSeason.secondSundayOfAdvent.toString() );
		console.log( adventSeason.thirdSundayOfAdvent.toString() );
		console.log( adventSeason.fourthSundayOfAdvent.toString() );

	}
};