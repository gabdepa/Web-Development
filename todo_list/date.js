module.exports.getDate = function () {
    const today = new Date();
    // Used to render the date
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    // Formatting our date string
    return today.toLocaleDateString("en-US", options);
}

module.exports.getDay = function () {
    const today = new Date();
    // Used to render the date
    const options = {
        weekday: "long"
    };

    // Formatting our date string
    return today.toLocaleDateString("en-US", options);
}