var BIRDREPORT_VISIT={
    codeHtml :function (){
        layer.open({
            type: 2,
            icon: 5,
            area: ['400px', '200px'],
            title: false,
            content: '/home/code/verify.html',
            end:function (){
                location.reload();
            }
        });
    }
}