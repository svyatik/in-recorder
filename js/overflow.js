const {ipcRenderer} = require('electron');

const $black_left   =  document.getElementById('black_left'),
      $black_right  =  document.getElementById('black_right'),
      $black_top    =  document.getElementById('black_top'),
      $black_bottom =  document.getElementById('black_bottom');

(function () {
    'use strict';
    const $wrapper = document.getElementById('wrapper');

    const global_width = $wrapper.offsetWidth;
    const global_height = $wrapper.offsetHeight;

    let rectangle = {
        x: 0,
        y: 0,
        width: global_width,
        height: global_height
    };

    let drug_direct = '';

    function move(cords) {
        if (cords.width !== undefined) {
            rectangle.width = cords.width;
        }
        if (cords.height !== undefined) {
            rectangle.height = cords.height;
        }
        if (cords.x !== undefined) {
            rectangle.x = cords.x;
        }
        if (cords.y !== undefined) {
            rectangle.y = cords.y;
        }

        $wrapper.style.left = rectangle.x + 'px';
        $wrapper.style.width = rectangle.width + 'px';
        $wrapper.style.top = rectangle.y + 'px';
        $wrapper.style.height = rectangle.height + 'px';

        $black_left.style.width = rectangle.x + 'px';

        $black_right.style.width = global_width - (rectangle.x + rectangle.width) + 'px';
        $black_right.style.left = rectangle.x + rectangle.width + 'px';

        $black_top.style.height = rectangle.y + 'px';
        $black_top.style.left = rectangle.x + 'px';
        $black_top.style.width = rectangle.width + 'px';

        $black_bottom.style.height = global_height - (rectangle.y + rectangle.height) + 'px';
        $black_bottom.style.top = rectangle.y + rectangle.height + 'px';
        $black_bottom.style.left = rectangle.x + 'px';
        $black_bottom.style.width = rectangle.width + 'px';

        return true;
    }

    function checkPosition(event) {
        let x = event.clientX;
        let y = event.clientY;

        if (x > rectangle.x - 12 && x < rectangle.x + 12) {
            return 'left';
        }
        if (x > (rectangle.width + rectangle.x) - 12 && x < (rectangle.width + rectangle.x) + 12) {
            return 'right';
        }
        if (y > rectangle.y - 12 && y < rectangle.y + 12) {
            return 'top';
        }
        if (y > (rectangle.height + rectangle.y) - 12 && y < (rectangle.height + rectangle.y) + 12) {
            return 'bottom';
        }
        if ((x > (rectangle.x + rectangle.width / 2 - 32) && x < (rectangle.x + rectangle.width / 2 + 32)) && (y > (rectangle.y + rectangle.height / 2 - 32) && y < (rectangle.y + rectangle.height / 2 + 32)) && ((drug_direct === '') || (drug_direct === 'center'))) {
            return 'center';
        }
    }

    function calcMovement(x, y) {
        switch (drug_direct) {
        case 'left':
            return {
                x: x,
                width: global_width - rectangle.x - x
            };
        case 'right':
            return {
                x: global_width - x,
                width: x - rectangle.x
            };
        case 'top':
            return {
                y: y,
                height: global_height - rectangle.y - y
            };
        case 'bottom':
            return {
                y: global_height - y,
                height: y - rectangle.y
            };
        case 'center':
            return {
                x: x - rectangle.width / 2,
                y: y - rectangle.height / 2
            };
        default:
            return false;
        }
    }

    function sendViaIPC() {
        ipcRenderer.send('asynchronous-message', rectangle);
    }

    function init() {
        document.body.addEventListener('mousedown', function (event) {
            drug_direct = checkPosition(event);
        });

        document.body.addEventListener('mouseup', function () {
            drug_direct = '';
            sendViaIPC();
        });

        document.body.addEventListener('mousemove', function (event) {
            const property = checkPosition(event);

            switch (property) {
            case 'left':
                document.body.style.cursor = 'e-resize';
                break;
            case 'right':
                document.body.style.cursor = 'e-resize';
                break;
            case 'top':
                document.body.style.cursor = 'n-resize';
                break;
            case 'bottom':
                document.body.style.cursor = 'n-resize';
                break;
            case 'center':
                document.body.style.cursor = 'move';
                break;
            default:
                document.body.style.cursor = 'auto';
            }

            if (drug_direct === '') {
                return false;
            }

            let new_cords = calcMovement(event.clientX, event.clientY);

            if (new_cords && ((new_cords.width >= 128) || (new_cords.height >= 128))) {
                move(new_cords);
            }

            if (property === 'center') {
                if (new_cords.x > 0 && rectangle.width + new_cords.x < global_width) {
                    move({x: new_cords.x});
                }
                if (new_cords.y > 0 && rectangle.height + new_cords.y < global_height) {
                    move({y: new_cords.y});
                }
            }
        });
    }

    init();
}());
