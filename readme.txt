<script>
            var doc = document,
           win = window;
           function initFontSize  () {
                var docEl = doc.documentElement,
                    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
                    recalc = function() {
                        var clientWidth = docEl.clientWidth; //window.innerWidth;
                        if (!clientWidth) return;
                        fontSizeRate = (clientWidth / 750);
                        var baseFontSize = 100 * fontSizeRate;
                        docEl.style.fontSize = baseFontSize + 'px';
                    };

                recalc();
                if (!doc.addEventListener) return;
                win.addEventListener(resizeEvt, recalc, false);
                doc.addEventListener('DOMContentLoaded', recalc, false);
            };
            initFontSize();
 </script>
 
 移动端自动适应  REM