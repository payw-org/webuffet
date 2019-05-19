$(function() {
    $.jsonRPC.setup({
        endPoint : 'http://localhost:3000/api',
        namespace : ''
    });
    
    $("#requestButton").click(function() {
        var message = $("#messageInput").val();
    
        // 암호화 테스트
        var secret = 'my secret';
        var encrypted = '' + CryptoJS.AES.encrypt(message, secret);
        console.log(encrypted);

        // 복호화 테스트
        var decrypted = CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8);
        console.log(decrypted);
        
        
        var method = 'echo_encrypted';
        $.jsonRPC.request(method, {
            id: 1001,
            params: [encrypted],
            success: function(data) {
                println('정상 응답을 받았습니다.');
                console.dir(data);
                
                var secret = 'my secret';
                var encrypted = data.result[0];
                var decrypted = CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8);
                console.log(decrypted);
                
                println(decrypted);
            },
            error: function(data) {
                println('에러 응답을 받았습니다.');
                console.dir(data);
                
                println(data.error.message);
            }
        });
        
        println('[' + method + '] method로 요청을 보냈습니다.');
    });
});

function println(data) {
    $("#results").append('<p>' + data + '</p>');
}