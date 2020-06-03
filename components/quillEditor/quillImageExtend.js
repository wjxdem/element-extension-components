/**
 *@description 观察者模式 全局监听富文本编辑器
 */
export const QuillWatch = {
  watcher: {}, // 登记编辑器信息
  active: null, // 当前触发的编辑器
  on: function(imageExtendId, ImageExtend) {
    // 登记注册使用了ImageEXtend的编辑器
    if (!this.watcher[imageExtendId]) {
      this.watcher[imageExtendId] = ImageExtend;
    }
  },
  emit: function(activeId, type = 1) {
    // 事件发射触发
    this.active = this.watcher[activeId];
    if (type === 1) {
      imgHandler();
    }
  }
};

/**
 * @description 图片功能拓展： 增加上传 拖动 复制
 */
export class ImageExtend {
  /**
   * @param quill {Quill}富文本实例
   * @param config {Object} options
   * config  keys: action, headers, editForm start end error  size response
   */
  constructor(quill, config = {}) {
    this.id = Math.random();
    this.quill = quill;
    this.quill.id = this.id;
    this.config = config;
    this.file = ''; // 要上传的图片
    this.imgURL = ''; // 图片地址
    quill.root.addEventListener('paste', this.pasteHandle.bind(this), false);
    quill.root.addEventListener('drop', this.dropHandle.bind(this), false);
    quill.root.addEventListener(
      'dropover',
      function(e) {
        e.preventDefault();
      },
      false
    );
    this.cursorIndex = 0;
    QuillWatch.on(this.id, this);
  }

  /**
   * @description 粘贴
   * @param e
   */
  pasteHandle(e) {
    QuillWatch.emit(this.quill.id, 0);
    console.log(e);
    if (e.clipboardData || e.originalEvent) {
      let clipboardData = e.clipboardData;
      if (clipboardData.items) {
        let i = 0;
        let items, item, types;
        // for chrome or 新版本火狐
        items = clipboardData.items;
        if (!items) {
          return;
        }
        // 火狐78版本items[0]有值并且item.kind === 'string'，之前的版本没有值
        item = items[0];
        types = clipboardData.types || [];

        for (; i < types.length; i++) {
          if (types[i] === 'Files') {
            item = items[i];
            break;
          }
        }
        if (items.length === 0 || (item && item.kind === 'string')) {
          setTimeout(() => {
            const imgList = this.quill.container.querySelectorAll('img');
            const $imgList = $(imgList);
            let src_str = '';
            let i;
            for (i = 0; i < imgList.length; i++) {
              src_str = imgList[i].src;
            }
            // 去掉再带的base64img标签
            // if(src_str.indexOf('data:image/'>-1)) {
            //   $imgList.remove();
            // }
            const selfFile = this.base64toFile(src_str);
            if (this.config.action) {
              $imgList.remove();
              this.uploadImg(selfFile);
            } else {
              this.toBase64();
            }
          }, 500);
        }

        console.log(item);
        if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
          console.log(190);
          //阻止默认行为即不让剪贴板内容在div中显示出来
          e.preventDefault();
          this.file = item.getAsFile();
          let self = this;
          // 如果图片限制大小
          if (
            self.config.size &&
            self.file.size >= self.config.size * 1024 * 1024
          ) {
            if (self.config.sizeError) {
              self.config.sizeError();
            }
            return;
          }
          if (this.config.action) {
            this.uploadImg();
          } else {
            this.toBase64();
          }
        }
      } else {
        // for firefox 老版本
        // console.log(e.explicitOriginalTarget.innerHTML)
        // console.log(e.target.childNodes)
        // const childNodes = e.target.childNodes
        // const childNodes = e.originalTarget.childNodes
        // console.log(e)
        // console.log(childNodes.length)
        // console.log(childNodes)
        // for( let i = 0; i< childNodes.length; i++) {
        //     console.log(childNodes[i].localName)
        //     if(childNodes[i].localName === 'img') {
        //         e.preventDefault();
        //     }
        // }
        // e.preventDefault();
        // 开始
        setTimeout(() => {
          const imgList = this.quill.container.querySelectorAll('img');
          const $imgList = $(imgList);
          console.log($imgList);
          let src_str = '';
          let i;
          for (i = 0; i < imgList.length; i++) {
            src_str = imgList[i].src;
          }
          if (src_str.indexOf('data:image/' > -1)) {
            console.log(0);
            $imgList.remove();
          }
          console.log(src_str);
          // const blob = this.dataURLtoBlob(src_str);
          // const selfFile = this.dataURLtofile(src_str, 'file');
          const selfFile = this.base64toFile(src_str);
          console.log(selfFile);
          if (this.config.action) {
            // $imgList.remove();
            this.uploadImg(selfFile);
          } else {
            this.toBase64();
          }
        }, 500);
      }
      console.log(56);
    } else {
      // for ie
      console.log(12);
      setTimeout(() => {
        const imgList = this.quill.container.querySelectorAll('img');
        const $imgList = $(imgList);
        // 这个代码可以放弃黏贴图片的功能
        // if(src_str.indexOf('data:image/'>-1)) {
        //   $imgList.remove();
        // }
        let src_str = '';
        let i;
        for (i = 0; i < imgList.length; i++) {
          src_str = imgList[i].src;
        }
        console.log(src_str);
        // const blob = this.dataURLtoBlob(src_str);
        // IE有兼容问题，没时间研究
        const selfFile = this.dataURLtofile(src_str, 'file');
        if (this.config.action) {
          this.uploadImg(selfFile);
        } else {
          this.toBase64();
        }
      }, 1000);
    }
    console.log(34);
  }

  /**
   * 拖拽
   * @param e
   */
  dropHandle(e) {
    QuillWatch.emit(this.quill.id, 0);
    const self = this;
    e.preventDefault();
    // 如果图片限制大小
    if (self.config.size && self.file.size >= self.config.size * 1024 * 1024) {
      if (self.config.sizeError) {
        self.config.sizeError();
      }
      return;
    }
    self.file = e.dataTransfer.files[0]; // 获取到第一个上传的文件对象
    if (this.config.action) {
      self.uploadImg();
    } else {
      self.toBase64();
    }
  }

  /**
   * @description 将图片转为base4
   */
  toBase64() {
    const self = this;
    const reader = new FileReader();
    reader.onload = e => {
      // 返回base64
      self.imgURL = e.target.result;
      self.insertImg();
    };
    reader.readAsDataURL(self.file);
  }
  // base64转文件流
  base64toFile(dataurl, filename = 'file') {
    let arr = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let suffix = mime.split('/')[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${filename}.${suffix}`, {
      type: mime
    });
  }
  dataURLtofile(dataurl, fileName) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      suffix = mime.split('/')[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    console.log(suffix);
    const theBlob = new Blob([u8arr], { type: mime });
    theBlob.lastModifiedDate = new Date();
    theBlob.name = `${fileName}.${suffix}`;
    return theBlob;
  }
  // blobToFile(theBlob, fileName) {
  //   theBlob.lastModifiedDate = new Date();
  //   theBlob.name = `${filename}.${suffix}`;
  //   return theBlob;
  // }

  /**
   * @description 上传图片到服务器
   */
  uploadImg(sf) {
    const self = this;
    let quillLoading = self.quillLoading;
    let config = self.config;
    // console.log(self)
    // 构造表单
    let formData = new FormData();
    if (!sf) {
      formData.append(config.name, self.file);
    } else {
      formData.append(config.name, sf);
    }
    // 自定义修改表单
    if (config.editForm) {
      config.editForm(formData);
    }
    // 创建ajax请求
    let xhr = new XMLHttpRequest();
    xhr.open('post', config.action, true);
    // 如果有设置请求头
    if (config.headers) {
      config.headers(xhr);
    }
    if (config.change) {
      config.change(xhr, formData);
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          //success
          let res = JSON.parse(xhr.responseText);
          // console.log(res)
          self.imgURL = config.response(res);
          QuillWatch.active.uploadSuccess();
          self.insertImg();
          if (self.config.success) {
            self.config.success();
          }
        } else {
          //error
          if (self.config.error) {
            self.config.error();
          }
          QuillWatch.active.uploadError();
        }
      }
    };
    // 开始上传数据
    xhr.upload.onloadstart = function(e) {
      QuillWatch.active.uploading();
      // let length = (self.quill.getSelection() || {}).index || self.quill.getLength()
      // self.quill.insertText(length, '[uploading...]', { 'color': 'red'}, true)
      if (config.start) {
        config.start();
      }
    };
    // 上传过程
    xhr.upload.onprogress = function(e) {
      let complete = (((e.loaded / e.total) * 100) | 0) + '%';
      QuillWatch.active.progress(complete);
    };
    // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
    xhr.upload.onerror = function(e) {
      QuillWatch.active.uploadError();
      if (config.error) {
        config.error();
      }
    };
    // 上传数据完成（成功或者失败）时会触发
    xhr.upload.onloadend = function(e) {
      if (config.end) {
        config.end();
      }
    };
    xhr.send(formData);
  }

  /**
   * @description 往富文本编辑器插入图片
   */
  insertImg() {
    const self = QuillWatch.active;
    self.quill.insertEmbed(QuillWatch.active.cursorIndex, 'image', self.imgURL);
    self.quill.update();
    self.quill.setSelection(self.cursorIndex + 1);
  }

  /**
   * @description 显示上传的进度
   */
  progress(pro) {
    pro = '[' + 'uploading' + pro + ']';
    QuillWatch.active.quill.root.innerHTML = QuillWatch.active.quill.root.innerHTML.replace(
      /\[uploading.*?\]/,
      pro
    );
  }

  /**
   * 开始上传
   */
  uploading() {
    let length =
      (QuillWatch.active.quill.getSelection() || {}).index ||
      QuillWatch.active.quill.getLength();
    QuillWatch.active.cursorIndex = length;
    QuillWatch.active.quill.insertText(
      QuillWatch.active.cursorIndex,
      '[uploading...]',
      { color: 'red' },
      true
    );
  }

  /**
   * 上传失败
   */
  uploadError() {
    QuillWatch.active.quill.root.innerHTML = QuillWatch.active.quill.root.innerHTML.replace(
      /\[uploading.*?\]/,
      '[upload error]'
    );
  }

  uploadSuccess() {
    QuillWatch.active.quill.root.innerHTML = QuillWatch.active.quill.root.innerHTML.replace(
      /\[uploading.*?\]/,
      ''
    );
  }
}

/**
 * @description 点击图片上传
 */
export function imgHandler() {
  let fileInput = document.querySelector('.quill-image-input');
  if (fileInput === null) {
    fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.classList.add('quill-image-input');
    fileInput.style.display = 'none';
    // 监听选择文件
    fileInput.addEventListener('change', function() {
      let self = QuillWatch.active;
      self.file = fileInput.files[0];
      fileInput.value = '';
      // 如果图片限制大小
      if (
        self.config.size &&
        self.file.size >= self.config.size * 1024 * 1024
      ) {
        if (self.config.sizeError) {
          self.config.sizeError();
        }
        return;
      }
      if (self.config.action) {
        self.uploadImg();
      } else {
        self.toBase64();
      }
    });
    document.body.appendChild(fileInput);
  }
  fileInput.click();
}
