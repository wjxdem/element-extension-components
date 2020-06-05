# element-extension-components
饿了么拓展组件库


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
  
  ```
#### 3.基于el-dialog任意拖拽图片预览组件 picturePreview
  ```javascript
  
  ```
#### 4.基于quill.js富文本编辑器，支持拖动上传图片
  ```javascript
  
  ```

