# element-extension-components
### 基于element，quill拓展组件库


#### 1.基于el-table和el-pagination表格分页组件  
  ```javascript

  <common-table
      class="table"
      :columns="columns"
      :contents="tableData"
      :pagination="pagination"
    ></common-table>

   import CommonTable from '@/components/commonTable/commonTable.vue';
   
    data() {
      return {
        columns: [
            {
              no: 'taskNo',
              prop: 'topic',
              label: '需求主题',
              type: 'routerlink',
              linkName: '/#/task/',
              paramsName: 'taskNo',
              showTooltip: true,
              onClick: data => {
                if (data.type === 4) {

                }
              },
              width: 180
            },
            { prop: 'typeDesc', label: '需求类型', type: 'text', width: 100 },
            { prop: 'priorityObj', label: '优先级', type: 'priority', width: 120 },
            { prop: 'statusDesc', label: '状态', type: 'text', width: 80 }
          ],
          tableData: [],
          pagination: {
            total: 0,
            currentPage: 1,
            currentPageSize: 10,
            currentPageChange: page => {
              this.pagination.currentPage = page;
              this.params.searchFlag = false;
              this.handleflushFilter(this.params);
            },
            sizeChange: size => {
              this.pagination.currentPageSize = size;
              this.params.searchFlag = false;
              this.handleflushFilter(this.params);
            }
          }
        }
      }
  ```
  
#### 2.基于el-table，el-radio和el-pagination单选表格分页组件
  ```javascript

<single-table
  class="table"
  :columns="columns"
  :contents="tableData"
  :pagination="pagination"
  :singleSelectionChange="handleSingleSelectionChange"
  :clearFlag="clearFlag">
 </single-table>

import singleTable from '@/components/singleTable/singleTable.vue';
  
  data() {
      return {
        // 列数据
    columns: [
      { prop: 'groupName', label: '用户组' },
      {
        prop: 'userCount',
        label: '用户数'
      },
      { prop: 'isDeletedDesc', label: '状态' }
    ],
    // table 数据
    tableData: [],

    // 底部导航数据
    pagination: {
      total: 0,
      currentPage: 1,
      currentPageSize: 10,
      currentPageChange: page => {
        this.pagination.currentPage = page;
        this.getGroupList();
      },
      sizeChange: size => {
        console.log('更改每页显示条数', size);
      }
    },
      }
  },
  methods:{
    handleSingleSelectionChange(row) {
      this.currentRow = row;
    }
  }
  
  ```
#### 3.基于el-dialog任意拖拽图片预览组件 picturePreview
  ```javascript
  用法：<picturePreview :imgUrl="url" :isVisible="pictureVisible"></picturePreview>
  
  添加指令：
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
  ```
#### 4.基于quill.js富文本编辑器，支持拖动上传图片
  ```javascript
  <quill-editor :quillEditorContent="quillEditorContent"></quill-editor>
  
  import QuillEditor from '@components/quillEditor/quillEditor.vue';
  
  data(){
   return {
     quillEditorContent: {
        content: ''  //  富文本框的默认值 
      },
   }
  }
  
  
  ```

