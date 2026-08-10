//判断对象是否为空
var isEmpty=function (value) {
    return (value == null || value == "" || value == undefined);
};

//判断对象是否为空
var isNotEmpty=function (value) {
    return !isEmpty(value);
};

 var strIsDate = function (value) {
    return isNotEmpty(value) ?  value.substr(0, 10) : "" ;
};

//金钱格式化，并保留2位小数
var strIsMoney=function (value,fixed) {
    if (isNotEmpty(value)) {
        return (parseFloat(value).toFixed(fixed) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    }
    return '';
};

//检查Storage是否为空值
var isNullStorage=function (value) {
    return (value == null || value == "" || value == undefined  || value == "{}");
};





