document.addEventListener('DOMContentLoaded', () => {
    const imageLoader = document.getElementById('imageLoader');
    const downloadBtn = document.getElementById('downloadBtn');
    const canvasContainer = document.getElementById('canvas-container');

    // 初始化 Fabric.js 画布
    const canvas = new fabric.Canvas('c', {
        width: canvasContainer.clientWidth,
        height: 450, // 初始高度
        backgroundColor: '#f0f0f0',
    });

    let hatImg = null;

    // 预加载帽子图片
    fabric.Image.fromURL('hat.png', function(img) {
        hatImg = img;
        hatImg.scaleToWidth(150); // 初始大小
        hatImg.set({
            top: 50,
            left: 50,
            cornerColor: '#F0B90B',
            cornerSize: 10,
            transparentCorners: false,
            borderColor: '#F0B90B',
            cornerStyle: 'circle'
        });
    });

    imageLoader.addEventListener('change', handleImage, false);

    function handleImage(e) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function() {
                const image = new fabric.Image(imgObj);
                
                // 调整画布和背景图尺寸
                const containerWidth = canvasContainer.clientWidth;
                const scale = containerWidth / image.width;
                const newHeight = image.height * scale;
                
                canvas.setWidth(containerWidth);
                canvas.setHeight(newHeight);
                canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas), {
                    scaleX: scale,
                    scaleY: scale,
                });

                // 如果帽子已存在，先移除
                canvas.getObjects().forEach(obj => {
                    if (obj === hatImg) {
                        canvas.remove(obj);
                    }
                });

                // 添加帽子到画布
                if (hatImg) {
                    canvas.add(hatImg);
                    hatImg.center(); // 将帽子居中放置
                    canvas.setActiveObject(hatImg);
                }

                // 激活下载按钮
                downloadBtn.disabled = false;
                downloadBtn.classList.remove('disabled');
                downloadBtn.innerText = '3. 下载Meme图';
            }
        }
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        }
    }
    
    downloadBtn.addEventListener('click', () => {
        if (!downloadBtn.disabled) {
            // 取消帽子的选中状态，隐藏控制框
            canvas.discardActiveObject();
            canvas.renderAll();

            // 创建下载链接
            const link = document.createElement('a');
            link.download = 'make-bsc-great-again.png';
            link.href = canvas.toDataURL({
                format: 'png',
                quality: 1.0
            });
            link.click();
        }
    });
});
