module.exports = fun => {
    let retval;
    let calledOnce = false;
    return () => {
        if (!calledOnce) {
            retval = fun();
            calledOnce = true;
        }
        return retval;
    }
}