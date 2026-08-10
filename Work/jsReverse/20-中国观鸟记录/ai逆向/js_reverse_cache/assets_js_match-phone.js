var phoneUtils = {
    matchPhoneNum: function (phoneNumber) {
        var regx = /^1(3|4|5|6|7|8|9)\d{9}$/
        var isPhone = phoneNumber.match(regx);
        if (isPhone) {
            return phoneNumber.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
        } else {
            return phoneNumber;
        }
    }
}
