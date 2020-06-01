<!--
/*@author: jesse wu
 *基于element-dialog的图片查看器，支持拖动
 *用法： <picturePreview :imgUrl="url" :isVisible="pictureVisible"></picturePreview>
 指令：
    // v-dialogDragWidth: 弹窗宽度拖大 拖小
    Vue.directive('dialogDragWidth', {
      bind(el, binding, vnode, oldVnode) {
        const dragDom = binding.value.$el.querySelector('.el-dialog')

        el.onmousedown = e => {
          // 鼠标按下，计算当前元素距离可视区的距离
          const disX = e.clientX - el.offsetLeft

          document.onmousemove = function(e) {
            e.preventDefault() // 移动时禁用默认事件

            // 通过事件委托，计算移动的距离
            const l = e.clientX - disX
            dragDom.style.width = `${l}px`
          }

          document.onmouseup = function(e) {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    })
 */
 -->
<template>
  <div>
    <el-dialog
      v-dialogDrag
      :width="width"
      title="图片预览"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <img @load="onLoadWidth" :src="url" :class="{ Preview: flag }" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'picture-preview',
  props: {
    isVisible: {
      type: Number
    },
    imgUrl: {
      type: String
    }
  },
  watch: {
    isVisible: {
      handler(val) {
        if (val) {
          this.dialogVisible = true;
        }
      },
      immediate: true
    },
    imgUrl: {
      handler(val) {
        this.url = val;
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      flag: false,
      url: '',
      width: ''
    };
  },
  methods: {
    // 获取图片宽度赋值给预览弹框
    onLoadWidth(e) {
      const img = e.target;
      let width = 0;
      if (img.width < 200) {
        width = 400;
        this.flag = false;
      } else {
        this.flag = true;
        width = img.width + 40;
      }
      if (width > document.body.offsetWidth) {
        this.flag = true;
        this.width = width * 0.9 + 'px';
      } else {
        this.flag = false;
        this.width = width + 'px';
      }
    }
  }
};
</script>

<style>
.Preview {
  width: 100%;
  height: 100%;
}
</style>
