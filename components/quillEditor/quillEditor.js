'use strict';

import './quillEditor.less';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor, Quill } from 'vue-quill-editor';
import { ImageExtend, QuillWatch } from './quillImageExtend';
Quill.register('modules/ImageExtend', ImageExtend);

const container = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['clean'],
  ['link', 'image', 'video']
];
const customOptions = [['image']];

export default {
  name: 'lu-quill-editor',
  data: getData,
  components: {
    quillEditor,
    quillEditorContent: {}
  },
  props: ['quillEditorContent', 'content', 'custom'],
  created() {
    if (this.content) this.quillEditorContent.content = this.content;
  },
  methods: {
    onEditorReady(event) {
      this.setFocus();
    },
    setFocus() {
      if (this.quillEditorContent.callbackFun) {
        this.quillEditorContent.callbackFun(this.$refs.myQuillEditor);
      }
    },
    onEditorChange({ html, text }) {
      this.quillEditorContent.content = html;
      this.quillEditorContent.text = text;
      if (this.quillEditorContent.vuexSetDataFun) {
        this.quillEditorContent.vuexSetDataFun(html);
      }
      this.setFocus();
    }
  }
};

function getData() {
  const domain =
    window.location.hostname === 'localhost'
      ? 'http://localhost:8080'
      : window.location.origin;
  return {
    editorOption: {
      placeholder: this.custom
        ? '@通知他人，Ctrl+V粘贴截图，文字上限2000字'
        : '请输入你的描述...',
      modules: {
        ImageExtend: {
          loading: true,
          name: 'img',
          size: 4,
          action: `${domain}/upload/file?url=${encodeURIComponent(
            '/luckydevplatform/common/attachment/upload'
          )}&name=attachment&_csrf=${window.pageConfig._csrf}`,
          response: res => {
            return res.data.url;
          }
        },
        toolbar: {
          container: this.custom ? customOptions : container,
          handlers: {
            image() {
              QuillWatch.emit(this.quill.id);
            }
          }
        }
      }
    }
  };
}
