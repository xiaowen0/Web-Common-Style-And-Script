/**
 * test formatTimeLength function.
 */
function testFormatTimeLength()
{
    log('test formatTimeLength function:');
    log('0 second: ' + formatTimeLength(0));
    log('include floating number: ' + formatTimeLength(1234));
    log('only return integer: ' + formatTimeLength(1234, {
        integer : true
    }));
    log('1:00 : ' + formatTimeLength(60234, {
        integer : true
    }));
    log('1:30 : ' + formatTimeLength(90234, {
        integer : true
    }));
    log('11:59 : ' + formatTimeLength(719234, {
        integer : true
    }));
    log('59:59 : ' + formatTimeLength(3599234, {
        integer : true
    }));
    log('1:00:00 : ' + formatTimeLength(3600234, {
        integer : true
    }));
    log('30:59:00 : ' + formatTimeLength(111540234, {
        integer : true
    }));
    log('101:00:59 : ' + formatTimeLength(363659234, {
        integer : true
    }));
}

