// Sayfa yüklendiğinde çalışacak fonksiyon
window.onload = function() {
    // Yükleme animasyonunu yavaşça gizle
    setTimeout(function() {
        var loaderBg = document.querySelector(".loader_bg");
        loaderBg.style.opacity = "0";
        setTimeout(function() {
            loaderBg.style.display = "none";
        }, 1000); // 1 saniye sonra tamamen gizle
    }, 1000); // 3000 milisaniye (3 saniye) sonra başla
};